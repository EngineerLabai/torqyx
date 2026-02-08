"use client";

import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ComparePanel from "@/components/tools/ComparePanel";
import ToolHistory from "@/components/tools/ToolHistory";
import ToolActions from "@/components/tools/ToolActions";
import ToolTrustPanel from "@/components/tools/ToolTrustPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import { trackEvent } from "@/utils/analytics";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildShareUrl, decodeToolState, encodeToolState } from "@/utils/tool-share";
import { formatMessage, getMessages } from "@/utils/messages";

type ToolPageProps<TInput, TResult> = {
  tool: ToolDefinition<TInput, TResult>;
  initialDocs?: ComponentProps<typeof ToolDocTabs>["initialDocs"];
};

export default function ToolPage<TInput, TResult>({ tool, initialDocs }: ToolPageProps<TInput, TResult>) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.components.toolActions;
  const toolPageCopy = messages.components.toolPage;
  const validationCopy = messages.components.toolValidation;
  const toolCopy = messages.tools?.[tool.id];
  const toolTitle = toolCopy?.title ?? tool.title;
  const toolDescription = toolCopy?.description ?? tool.description;
  const [input, setInput] = useState<TInput>(tool.initialInput);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);
  const calculateTimeout = useRef<number | null>(null);
  const hasTrackedInitial = useRef(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const historyId = searchParams?.get("historyId");
    if (!hasHydrated.current) {
      const shared = decodeToolState<Record<string, string | number>>(searchParams?.get("input") ?? null);
      if (shared) {
        const merged = { ...(tool.initialInput as Record<string, unknown>) } as Record<string, unknown>;
        Object.entries(shared).forEach(([key, value]) => {
          merged[key] = value;
        });
        Promise.resolve().then(() => setInput(merged as TInput));
        hasHydrated.current = true;
        return;
      }
      hasHydrated.current = true;
    }

    if (!historyId || historyId === loadedHistoryId) return;

    try {
      const stored = localStorage.getItem(`tool-history:${tool.id}`);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Array<{ id: string; input: TInput }>;
      const match = parsed.find((entry) => entry.id === historyId);
      if (!match) return;
      Promise.resolve().then(() => {
        setInput(match.input);
        setLoadedHistoryId(historyId);
      });
    } catch {
      // ignore invalid storage data
    }
  }, [searchParams, tool.id, loadedHistoryId]);

  const resolvedInputMeta = useMemo(() => {
    if (!tool.inputMeta) return null;
    const inputCopy = toolCopy?.inputMeta;
    return tool.inputMeta.map((meta) => ({
      ...meta,
      label: inputCopy?.[meta.key] ?? meta.label,
    }));
  }, [tool.inputMeta, toolCopy?.inputMeta]);

  const schema = useMemo(() => {
    if (!resolvedInputMeta) return null;
    const shape: Record<string, z.ZodTypeAny> = {};
    resolvedInputMeta.forEach((meta) => {
      shape[meta.key] = buildToolFieldSchema(meta, validationCopy);
    });
    return z.object(shape);
  }, [resolvedInputMeta, validationCopy]);

  const validation = useMemo(() => {
    if (!schema) return { success: true, data: input } as const;
    return schema.safeParse(input);
  }, [schema, input]);

  const errors = useMemo(() => {
    if (validation.success) return {} as Record<string, string>;
    const flattened = validation.error.flatten().fieldErrors;
    return Object.entries(flattened).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value && value.length > 0) {
        acc[key] = value[0] ?? "";
      }
      return acc;
    }, {});
  }, [validation]);

  const { result, calcError } = useMemo(() => {
    if (!validation.success) {
      return { result: null as TResult | null, calcError: validationCopy.resultFix };
    }
    try {
      return { result: tool.calculate(validation.data as TInput), calcError: "" };
    } catch {
      return { result: null as TResult | null, calcError: validationCopy.calcFailed };
    }
  }, [validation, tool, validationCopy.calcFailed, validationCopy.resultFix]);

  useEffect(() => {
    if (!hasTrackedInitial.current) {
      hasTrackedInitial.current = true;
      return;
    }

    if (calculateTimeout.current) {
      window.clearTimeout(calculateTimeout.current);
    }

    calculateTimeout.current = window.setTimeout(() => {
      trackEvent("calculate_click", { tool_id: tool.id, tool_title: toolTitle });
    }, 600);

    return () => {
      if (calculateTimeout.current) {
        window.clearTimeout(calculateTimeout.current);
      }
    };
  }, [input, tool.id, toolTitle]);

  const encodedState = useMemo(() => encodeToolState(input as Record<string, unknown>), [input]);
  const shareUrl = useMemo(() => {
    if (!pathname || typeof window === "undefined") return "";
    return buildShareUrl(`${window.location.origin}${pathname}`, input as Record<string, unknown>);
  }, [pathname, input]);
  const reportBase = withLocalePrefix(`/tools/${tool.id}/report`, locale);
  const reportUrl = encodedState ? `${reportBase}?input=${encodedState}` : reportBase;

  const formula = resolveLocalizedValue(tool.formula, locale);
  const assumptions = resolveLocalizedValue(tool.assumptions, locale);
  const references = resolveLocalizedValue(tool.references, locale);

  const InputSection = tool.InputSection;
  const ResultSection = tool.ResultSection;
  const VisualizationSection = tool.VisualizationSection;
  const CompareVisualizationSection = tool.CompareVisualizationSection;
  const resolvedCompareMetrics = useMemo(() => {
    if (!tool.compareMetrics) return undefined;
    const metricCopy = toolCopy?.compareMetrics;
    return tool.compareMetrics.map((metric) => ({
      ...metric,
      label: metricCopy?.[metric.key] ?? metric.label,
    }));
  }, [tool.compareMetrics, toolCopy?.compareMetrics]);

  return (
    <PageShell>
      <ToolDocTabs slug={tool.id} initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {toolPageCopy.badge}
            </p>
            <h1 className="text-lg font-semibold text-slate-900">{toolTitle}</h1>
            <p className="text-sm text-slate-600">{toolDescription}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <InputSection input={input} onChange={setInput} errors={errors} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {result ? <ResultSection result={result} /> : <p className="text-xs text-red-600">{calcError}</p>}
          </div>
        </section>

        {result ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <VisualizationSection input={input} result={result} />
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">{copy.shareTitle}</h2>
            <p className="text-xs text-slate-500">{copy.shareDescription}</p>
          </div>
          <div className="mt-3">
            <ToolActions shareUrl={shareUrl} reportUrl={reportUrl} />
          </div>
        </section>

        <ToolTrustPanel formula={formula} assumptions={assumptions} references={references} />

        <ComparePanel
          toolId={tool.id}
          initialInput={tool.initialInput}
          baseInput={input}
          calculate={tool.calculate}
          InputSection={InputSection}
          compareMetrics={resolvedCompareMetrics}
          CompareVisualizationSection={CompareVisualizationSection}
        />

        {result ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <ToolHistory toolId={tool.id} toolTitle={toolTitle} input={input} result={result} />
          </section>
        ) : null}
      </ToolDocTabs>
    </PageShell>
  );
}

function buildToolFieldSchema(meta: ToolInputMeta, copy: Record<string, string>) {
  const label = meta.unit ? `${meta.label} (${meta.unit})` : meta.label;
  const fieldType = meta.type ?? "number";

  if (fieldType === "select") {
    const options = (meta.options ?? []).map((option) => String(option));
    return z
      .string()
      .min(1, formatMessage(copy.required, { field: label }))
      .refine((value) => options.includes(String(value)), formatMessage(copy.invalidOption, { field: label }));
  }

  let schema = z
    .string()
    .min(1, formatMessage(copy.required, { field: label }))
    .refine((value) => Number.isFinite(Number(value)), formatMessage(copy.invalidNumber, { field: label }));

  const minValue = meta.min;
  if (typeof minValue === "number") {
    const minLabel = formatMessage(copy.min, {
      field: label,
      min: meta.unit ? `${minValue} ${meta.unit}` : minValue,
    });
    schema = schema.refine((value) => Number(value) >= minValue, minLabel);
  }

  const maxValue = meta.max;
  if (typeof maxValue === "number") {
    const maxLabel = formatMessage(copy.max, {
      field: label,
      max: meta.unit ? `${maxValue} ${meta.unit}` : maxValue,
    });
    schema = schema.refine((value) => Number(value) <= maxValue, maxLabel);
  }

  return schema;
}
