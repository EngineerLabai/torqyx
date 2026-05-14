"use client";

import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ToolActions from "@/components/tools/ToolActions";
import AccessBadge from "@/components/tools/AccessBadge";
import ToolBadge from "@/components/tools/ToolBadge";
import InfoTooltip from "@/components/ui/InfoTooltip";
import UpgradePrompt from "@/components/billing/UpgradePrompt";
import { ShareButton } from "@/components/share/ShareButton";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import type { ReportData } from "@/lib/pdf/types";
import { getToolPdfConverter } from "@/lib/pdf/reportConverters";
import { getAdvisorInsights } from "@/src/lib/advisor/engine";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildShareUrl, decodeToolState, encodeToolState, decodeToolStateShort } from "@/utils/tool-share";
import { formatMessage, getMessages } from "@/utils/messages";
import { getToolMethodNotes } from "@/lib/tool-method-notes";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import { useUnitSystem } from "@/contexts/UnitSystemContext";
import type { TraceSource } from "@/hooks/useCalculationTrace";

type ToolInputRecord = Record<string, unknown>;
type ToolResultRecord = Record<string, unknown>;

const AdvancedLoading = () => (
  <div aria-hidden className="h-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="h-full animate-pulse rounded-xl bg-slate-100" />
  </div>
);

const ComparePanel = dynamic(() => import("@/components/tools/ComparePanel"), {
  loading: () => <AdvancedLoading />,
}) as typeof import("@/components/tools/ComparePanel").default;
const ToolHistory = dynamic(() => import("@/components/tools/ToolHistory"), {
  loading: () => <AdvancedLoading />,
});
const ToolDataActions = dynamic(() => import("@/components/tools/ToolDataActions"), {
  loading: () => <AdvancedLoading />,
});
const ToolTrustPanel = dynamic(() => import("@/components/tools/ToolTrustPanel"), {
  loading: () => <AdvancedLoading />,
});
const ToolMethodNotes = dynamic(() => import("@/components/tools/ToolMethodNotes"), {
  loading: () => <AdvancedLoading />,
});
const AdvisorPanel = dynamic(() => import("@/src/components/tools/AdvisorPanel"), {
  loading: () => <AdvancedLoading />,
});
const CalculationAuditPanel = dynamic(() => import("@/components/tools/CalculationAuditPanel"), {
  loading: () => <AdvancedLoading />,
});
const PdfExportButton = dynamic(() => import("@/components/pdf/PdfExportButton"), {
  loading: () => <AdvancedLoading />,
});
const PdfPreviewModal = dynamic(() => import("@/components/pdf/PdfPreviewModal"), {
  loading: () => <AdvancedLoading />,
});

export default function ToolPage<TInput extends ToolInputRecord, TResult extends ToolResultRecord>({
  tool,
  initialDocs,
}: {
  tool: ToolDefinition<TInput, TResult>;
  initialDocs?: ComponentProps<typeof ToolDocTabs>["initialDocs"];
}) {
  const { locale } = useLocale();
  const { system } = useUnitSystem();
  const messages = getMessages(locale);
  const copy = messages.components.toolActions;
  const toolPageCopy = messages.components.toolPage;
  const accessLabels = messages.common.access;
  const validationCopy = messages.components.toolValidation;
  const catalogEntry = toolCatalog.find((item) => item.id === tool.id);
  const toolCopy = catalogEntry ? getToolCopy(catalogEntry, locale) : null;
  const access = catalogEntry?.access ?? "free";
  const accessLabel = accessLabels?.[access] ?? accessLabels?.free ?? "";
  const status = catalogEntry?.status ?? "verified";
  const validationStandard = catalogEntry?.validationStandard;
  const toolTitle = toolCopy?.title ?? tool.title;
  const toolDescription = toolCopy?.description ?? tool.description;
  const [input, setInput] = useState<TInput>(tool.initialInput);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);
  const calculateTimeout = useRef<number | null>(null);
  const hasTrackedInitial = useRef(false);
  const hasHydrated = useRef(false);
  const { track } = useAnalytics();

  useEffect(() => {
    const historyId = searchParams?.get("historyId");
    if (!hasHydrated.current) {
      // Eski format: input parametresi
      const shared = decodeToolState<Record<string, string | number>>(searchParams?.get("input") ?? null);
      // Yeni format: s parametresi (kısa)
      const sharedShort = decodeToolStateShort<Record<string, string | number>>(tool.id, searchParams?.get("s") ?? null);
      // Kısa linkten gelen paylaşım
      const sharedFromLink = searchParams?.get("shared");

      let mergedInput: ToolInputRecord | null = null;

      if (shared) {
        mergedInput = { ...(tool.initialInput as ToolInputRecord) };
        Object.entries(shared).forEach(([key, value]) => {
          (mergedInput as ToolInputRecord)[key] = value;
        });
      } else if (sharedShort) {
        mergedInput = { ...(tool.initialInput as ToolInputRecord) };
        Object.entries(sharedShort).forEach(([key, value]) => {
          (mergedInput as ToolInputRecord)[key] = value;
        });
      } else if (sharedFromLink) {
        try {
          const parsed = JSON.parse(decodeURIComponent(sharedFromLink));
          mergedInput = { ...(tool.initialInput as ToolInputRecord), ...parsed };
        } catch {
          // ignore invalid shared data
        }
      }

      if (mergedInput) {
        Promise.resolve().then(() => setInput(mergedInput as TInput));
      }

      hasHydrated.current = true;
      return;
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
  }, [searchParams, tool.id, tool.initialInput, loadedHistoryId]);

  const resolvedInputMeta = useMemo(() => tool.inputMeta ?? null, [tool.inputMeta]);

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

  const encodedState = useMemo(() => encodeToolState(input), [input]);
  const toolAccessGate = useFeatureGate("tool_access", { toolId: tool.id });
  const dailyCalculationGate = useFeatureGate("daily_calculations", {
    autoConsume: Boolean(result),
    consumeKey: result ? `${tool.id}:${encodedState}` : null,
  });
  const dailyLimitReached = !dailyCalculationGate.isLoading && !dailyCalculationGate.hasAccess;
  const gatedResult = dailyLimitReached ? null : result;

  const reportData = useMemo((): ReportData | null => {
    if (!showAdvanced || !gatedResult || !validation.success) return null;

    try {
      // Tool-specific converter kullan
      const converter = getToolPdfConverter(tool.id);
      return converter(validation.data as TInput, gatedResult, tool.id, toolTitle, system);
    } catch (error) {
      console.error("PDF report data generation error:", error);
      return null;
    }
  }, [showAdvanced, gatedResult, validation.success, validation.data, tool.id, toolTitle, system]);

  useEffect(() => {
    if (!hasTrackedInitial.current) {
      hasTrackedInitial.current = true;
      return;
    }

    if (calculateTimeout.current) {
      window.clearTimeout(calculateTimeout.current);
    }

    calculateTimeout.current = window.setTimeout(() => {
      track("tool_run", {
        tool_id: tool.id,
        tool_name: toolTitle,
        input_count: Object.keys(input as ToolInputRecord).length,
      });
    }, 600);

    return () => {
      if (calculateTimeout.current) {
        window.clearTimeout(calculateTimeout.current);
      }
    };
  }, [input, tool.id, toolTitle, track]);

  const shareUrl = useMemo(() => {
    if (!pathname) return "";
    return buildShareUrl(pathname, input as ToolInputRecord);
  }, [pathname, input]);
  const reportBase = withLocalePrefix(`/tools/${tool.id}/report`, locale);
  const reportUrl = encodedState ? `${reportBase}?input=${encodedState}` : reportBase;

  const formula = resolveLocalizedValue(tool.formula, locale);
  const assumptions = resolveLocalizedValue(tool.assumptions, locale);
  const references = resolveLocalizedValue(tool.references, locale);
  const methodNotes = getToolMethodNotes(tool.id, locale);
  const showAdvisor = tool.id === "bolt-calculator" || tool.id === "pipe-pressure-loss";
  const advisorInsights = useMemo(() => {
    if (!showAdvisor) return [];
    return getAdvisorInsights(tool.id, input as ToolInputRecord, {
      locale,
      reportUrl: gatedResult ? reportUrl : undefined,
    });
  }, [showAdvisor, tool.id, input, locale, reportUrl, gatedResult]);

  const InputSection = tool.InputSection;
  const ResultSection = tool.ResultSection;
  const VisualizationSection = tool.VisualizationSection;
  const CompareVisualizationSection = tool.CompareVisualizationSection;
  const resolvedCompareMetrics = useMemo(() => tool.compareMetrics ?? undefined, [tool.compareMetrics]);
  const advancedCtaLabel =
    locale === "tr"
      ? "Rapor, grafik ve karşılaştırma araçlarını göster"
      : "Show reports, charts, and comparison tools";
  const advancedCtaDescription =
    locale === "tr"
      ? "Temel sonucu kontrol ettikten sonra paylaşım, PDF, yöntem notları ve karşılaştırma panellerini aç."
      : "After checking the basic result, open sharing, PDF, method notes, and comparison panels.";

  if (!toolAccessGate.isLoading && !toolAccessGate.hasAccess) {
    return (
      <PageShell>
        <UpgradePrompt
          source="tool_access_limit"
          title={locale === "tr" ? "Bu araca Pro plan ile erişebilirsiniz." : "This tool requires Pro access."}
          description={
            locale === "tr"
              ? "Ücretsiz plan araç limitini doldurdunuz. Pro'ya geçerek tüm araçları açabilirsiniz."
              : "You reached the Free plan tool limit. Upgrade to Pro to unlock all tools."
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ToolDocTabs slug={tool.id} initialDocs={initialDocs}>
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {toolPageCopy.badge}
              </span>
              <ToolBadge status={status} standard={validationStandard} locale={locale} />
              {accessLabel ? <AccessBadge access={access} label={accessLabel} size="sm" /> : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">{toolTitle}</h1>
              <InfoTooltip
                label={toolPageCopy.howItWorksLabel}
                content={toolPageCopy.howItWorksDescription}
              />
            </div>
            <p className="text-sm text-slate-600">{toolDescription}</p>
          </div>
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <InputSection input={input} onChange={setInput} errors={errors} />
          </div>
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {gatedResult ? (
              <>
                <ResultSection result={gatedResult} />
              </>
            ) : dailyLimitReached ? (
              <UpgradePrompt
                compact
                source="daily_calculation_limit"
                title={locale === "tr" ? "Günlük hesap limiti doldu." : "Daily calculation limit reached."}
                description={
                  locale === "tr"
                    ? "Pro'ya geç, sınırsız hesap yap."
                    : "Upgrade to Pro for unlimited calculations."
                }
              />
            ) : (
              <p className="text-xs text-red-600">{calcError}</p>
            )}
          </div>
        </section>

        {gatedResult && !showAdvanced ? (
          <section className="min-w-0 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900">{advancedCtaLabel}</h2>
                <p className="text-xs text-slate-600">{advancedCtaDescription}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(true)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                {locale === "tr" ? "İleri seçenekleri aç" : "Open advanced tools"}
              </button>
            </div>
          </section>
        ) : null}

        {gatedResult && showAdvanced ? (
          <>
            <CalculationAuditPanel
              locale={locale}
              toolId={tool.id}
              toolName={toolTitle}
              inputs={validation.success ? (validation.data as ToolInputRecord) : (input as ToolInputRecord)}
              outputs={gatedResult as ToolResultRecord}
              traceSource={gatedResult as TraceSource}
            />

            {reportData ? (
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  <PdfPreviewModal
                    toolId={tool.id}
                    reportData={reportData}
                    trigger={
                      <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        {locale === "tr" ? "Önizleme" : "Preview"}
                      </button>
                    }
                  />
                  <PdfExportButton toolId={tool.id} reportData={reportData} variant="default" size="sm" />
                  <ShareButton
                    toolId={tool.id}
                    currentInput={input}
                    currentResult={gatedResult}
                    variant="outline"
                    size="sm"
                  />
                </div>
              </section>
            ) : null}

            <ToolDataActions
              toolSlug={tool.id}
              toolTitle={toolTitle}
              inputs={input as ToolInputRecord}
              outputs={gatedResult as ToolResultRecord}
              reportUrl={reportUrl}
            />

            {showAdvisor ? <AdvisorPanel insights={advisorInsights} /> : null}

            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <VisualizationSection input={input} result={gatedResult} />
            </section>

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-900">{copy.shareTitle}</h2>
                <p className="text-xs text-slate-500">{copy.shareDescription}</p>
              </div>
              <div className="mt-3">
                <ToolActions shareUrl={shareUrl} reportUrl={reportUrl} />
              </div>
            </section>

            <ToolTrustPanel formula={formula} assumptions={assumptions} references={references} />
            {methodNotes ? <ToolMethodNotes notes={methodNotes} /> : null}

            {!dailyLimitReached ? (
              <ComparePanel
                toolId={tool.id}
                initialInput={tool.initialInput}
                baseInput={input}
                calculate={tool.calculate}
                InputSection={InputSection}
                compareMetrics={resolvedCompareMetrics}
                CompareVisualizationSection={CompareVisualizationSection}
              />
            ) : null}

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ToolHistory toolId={tool.id} toolTitle={toolTitle} input={input} result={gatedResult} />
            </section>
          </>
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
