"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalculationStep } from "@/tools/_shared/types";
import type { Locale } from "@/utils/locale";
import type { ToolSummaryResponse } from "@/src/lib/ai/types";
import { useCalculationTrace } from "@/hooks/useCalculationTrace";

const LABELS = {
  tr: {
    title: "Hesaplama Detayları",
    formulaHelp: "Bu formül nedir?",
    explanationTitle: "AI Açıklaması",
    noSteps: "Hesaplama adımı yok.",
    variables: "Değerler",
    result: "Sonuç",
    standard: "Standart",
    status: "Durum",
    close: "Kapat",
    loading: "Yükleniyor...",
    explainLoading: "Açıklama hazırlanıyor...",
    explanationError: "Açıklama şu anda yüklenemiyor.",
    openPanel: "Hesaplama Detaylarını Göster",
  },
  en: {
    title: "Calculation Details",
    formulaHelp: "What is this formula?",
    explanationTitle: "AI Explanation",
    noSteps: "No calculation steps available.",
    variables: "Values",
    result: "Result",
    standard: "Standard",
    status: "Status",
    close: "Close",
    loading: "Loading...",
    explainLoading: "Preparing explanation...",
    explanationError: "Explanation could not be loaded.",
    openPanel: "Show Calculation Details",
  },
} as const;

const STATUS_STYLES: Record<CalculationStep["status"], string> = {
  pass: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  fail: "bg-rose-100 text-rose-700",
  info: "bg-slate-100 text-slate-600",
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderMarkdownToHtml = (markdown: string) => {
  const lines = markdown.split(/\r?\n/);
  const blocks: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${paragraph.join(" ")}</p>`);
    paragraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
      continue;
    }

    paragraph.push(escapeHtml(trimmed));
  }

  flushParagraph();
  return blocks.join("");
};

type TraceSource = {
  auditTrail?: CalculationStep[] | (() => CalculationStep[] | null) | null;
};

type CalculationAuditPanelProps = {
  locale: Locale;
  toolId: string;
  toolName: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  traceSource?: TraceSource | null;
};

export default function CalculationAuditPanel({
  locale,
  toolId,
  toolName,
  inputs,
  outputs,
  traceSource,
}: CalculationAuditPanelProps) {
  const labels = LABELS[locale];
  const [open, setOpen] = useState(false);
  const [katexPackage, setKatexPackage] = useState<typeof import("katex") | null>(null);
  const [loadingExplanationFor, setLoadingExplanationFor] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [explanationError, setExplanationError] = useState(false);

  const steps = useCalculationTrace(traceSource, open);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    void import("katex")
      .then((mod) => {
        if (!cancelled) setKatexPackage(mod);
      })
      .catch(() => {
        if (!cancelled) setKatexPackage(null);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const renderFormulaHtml = useMemo(
    () =>
      (formula: string) => {
        if (katexPackage) {
          try {
            return {
              __html: katexPackage.renderToString(formula, {
                throwOnError: false,
                displayMode: false,
              }),
            };
          } catch {
            return { __html: escapeHtml(formula) };
          }
        }

        return { __html: escapeHtml(formula) };
      },
    [katexPackage],
  );

  const handleExplain = async (step: CalculationStep) => {
    const stepKey = step.id;
    setLoadingExplanationFor(stepKey);
    setExplanationError(false);

    try {
      const response = await fetch("/api/ai/tool-summary", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          locale,
          toolId,
          toolName,
          inputs,
          outputs,
          notes: [
            locale === "tr"
              ? `Aşağıdaki formülü ve değişkenlerini mühendislik odaklı olarak açıkla: ${step.formula}`
              : `Explain the following formula and its variables in an engineering context: ${step.formula}`,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("ai_request_failed");
      }

      const payload = await response.json() as { data?: ToolSummaryResponse };
      const summaryMd = payload?.data?.summaryMd;
      if (!summaryMd) {
        throw new Error("invalid_ai_response");
      }

      setExplanations((current) => ({ ...current, [stepKey]: summaryMd }));
    } catch {
      setExplanationError(true);
    } finally {
      setLoadingExplanationFor(null);
    }
  };

  const panelSteps = open ? steps : [];

  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mb-4 inline-flex items-center justify-between w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:border-slate-400"
      >
        <span>{open ? labels.close : labels.openPanel}</span>
        <span className="text-xs text-slate-500">{panelSteps.length} adım</span>
      </button>

      {open ? (
        panelSteps.length === 0 ? (
          <p className="text-sm text-slate-600">{labels.noSteps}</p>
        ) : (
          <div className="space-y-4">
            {panelSteps.map((step) => (
              <article key={step.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{step.name}</h3>
                    <p className="text-xs text-slate-500">{step.standard}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[step.status]}`}>
                    {step.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-3 rounded-2xl bg-white p-3 text-sm text-slate-800 shadow-sm">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Formül</div>
                  <div
                    className="prose-sm overflow-x-auto text-slate-900"
                    dangerouslySetInnerHTML={renderFormulaHtml(step.formula)}
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-3 text-sm text-slate-800 shadow-sm">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{labels.variables}</div>
                    <dl className="space-y-2 text-[13px]">
                      {step.variables.map((variable) => (
                        <div key={variable.key} className="flex items-start justify-between gap-2">
                          <dt className="font-medium text-slate-700">{variable.label}</dt>
                          <dd className="text-right text-slate-600">{variable.value} {variable.unit ?? ""}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="rounded-2xl bg-white p-3 text-sm text-slate-800 shadow-sm">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{labels.result}</div>
                    <p className="text-base font-semibold text-slate-900">{step.result} {step.unit}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => handleExplain(step)}
                    className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    {labels.formulaHelp}
                  </button>
                  <span className="text-xs text-slate-500">{labels.status}: {step.status}</span>
                </div>

                {loadingExplanationFor === step.id ? (
                  <p className="mt-3 text-sm text-slate-500">{labels.explainLoading}</p>
                ) : explanationError ? (
                  <p className="mt-3 text-sm text-rose-600">{labels.explanationError}</p>
                ) : explanations[step.id] ? (
                  <div className="mt-3 rounded-2xl bg-white p-3 text-sm text-slate-800 shadow-sm">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{labels.explanationTitle}</div>
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(explanations[step.id]) }} />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )
      ) : null}
    </section>
  );
}
