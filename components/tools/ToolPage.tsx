"use client";

import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ComparePanel from "@/components/tools/ComparePanel";
import ToolHistory from "@/components/tools/ToolHistory";
import ToolActions from "@/components/tools/ToolActions";
import ToolDataActions from "@/components/tools/ToolDataActions";
import ToolTrustPanel from "@/components/tools/ToolTrustPanel";
import ToolMethodNotes from "@/components/tools/ToolMethodNotes";
import AccessBadge from "@/components/tools/AccessBadge";
import ToolBadge from "@/components/tools/ToolBadge";
import InfoTooltip from "@/components/ui/InfoTooltip";
import UpgradePrompt from "@/components/billing/UpgradePrompt";
import PdfExportButton from "@/components/pdf/PdfExportButton";
import PdfPreviewModal from "@/components/pdf/PdfPreviewModal";
import { ShareButton } from "@/components/share/ShareButton";
import AISummaryPanel from "@/src/components/ai/AISummaryPanel";
import ExplainResultPanel from "@/src/components/ai/ExplainResultPanel";
import CalculationAuditPanel from "@/components/tools/CalculationAuditPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolDefinition, ToolInputMeta } from "@/tools/_shared/types";
import type { ReportData } from "@/lib/pdf/types";
import { getToolPdfConverter } from "@/lib/pdf/reportConverters";
import AdvisorPanel from "@/src/components/tools/AdvisorPanel";
import { getAdvisorInsights } from "@/src/lib/advisor/engine";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildShareUrl, decodeToolState, encodeToolState, decodeToolStateShort } from "@/utils/tool-share";
import { formatMessage, getMessages } from "@/utils/messages";
import { getToolMethodNotes } from "@/lib/tool-method-notes";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";

type ToolInputRecord = Record<string, unknown>;
type ToolResultRecord = Record<string, unknown>;
const AI_SUMMARY_TOOL_IDS = new Set(["bolt-calculator", "unit-converter", "pipe-pressure-loss"]);

export default function ToolPage<TInput extends ToolInputRecord, TResult extends ToolResultRecord>({
  tool,
  initialDocs,
}: {
  tool: ToolDefinition<TInput, TResult>;
  initialDocs?: ComponentProps<typeof ToolDocTabs>["initialDocs"];
}) {
  const { locale } = useLocale();
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
          mergedInput[key] = value;
        });
      } else if (sharedShort) {
        mergedInput = { ...(tool.initialInput as ToolInputRecord) };
        Object.entries(sharedShort).forEach(([key, value]) => {
          mergedInput[key] = value;
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

  // PDF rapor verisini oluştur
  const reportData = useMemo((): ReportData | null => {
    if (!gatedResult || !validation.success) return null;

    try {
      // Tool-specific converter kullan
      const converter = getToolPdfConverter(tool.id);
      return converter(validation.data as TInput, gatedResult, tool.id, toolTitle, system);
    } catch (error) {
      console.error("PDF report data generation error:", error);
      return null;
    }
  }, [gatedResult, validation.success, validation.data, tool.id, toolTitle, system]);

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
  const showAiSummary = AI_SUMMARY_TOOL_IDS.has(tool.id);
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

  if (!toolAccessGate.isLoading && !toolAccessGate.hasAccess) {
    return (
      <PageShell>
        <UpgradePrompt
          source="tool_access_limit"
          title={locale === "tr" ? "Bu araca Pro plan ile erisebilirsiniz." : "This tool requires Pro access."}
          description={
            locale === "tr"
              ? "Free plan arac limitini doldurdunuz. Pro'ya gecerek tum araclari acabilirsiniz."
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
                <CalculationAuditPanel
                  locale={locale}
                  toolId={tool.id}
                  toolName={toolTitle}
                  inputs={validation.success ? (validation.data as ToolInputRecord) : (input as ToolInputRecord)}
                  outputs={gatedResult as ToolResultRecord}
                  traceSource={gatedResult as { auditTrail?: unknown }}
                />
                <div className="mt-4">
                  <ExplainResultPanel
                    locale={locale}
                    toolId={tool.id}
                    toolName={toolTitle}
                    inputs={validation.success ? (validation.data as ToolInputRecord) : (input as ToolInputRecord)}
                    outputs={gatedResult as ToolResultRecord}
                    auditTrail={(gatedResult as { auditTrail?: unknown }).auditTrail}
                  />
                </div>
                {reportData && (
                  <div className="mt-4 flex gap-2 border-t pt-4">
                    <PdfPreviewModal
                      toolId={tool.id}
                      reportData={reportData}
                      trigger={
                        <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                          Önizleme
                        </button>
                      }
                    />
                    <PdfExportButton
                      toolId={tool.id}
                      reportData={reportData}
                      variant="default"
                      size="sm"
                    />
                    <ShareButton
                      toolId={tool.id}
                      currentInput={input}
                      currentResult={gatedResult}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                )}
              </>
            ) : dailyLimitReached ? (
              <UpgradePrompt
                compact
                source="daily_calculation_limit"
                title={locale === "tr" ? "Gunluk hesap limiti doldu." : "Daily calculation limit reached."}
                description={
                  locale === "tr"
                    ? "Pro'ya gec, sinirsiz hesap yap."
                    : "Upgrade to Pro for unlimited calculations."
                }
              />
            ) : (
              <p className="text-xs text-red-600">{calcError}</p>
            )}
          </div>
        </section>

        {gatedResult ? (
          <ToolDataActions
            toolSlug={tool.id}
            toolTitle={toolTitle}
            inputs={input as ToolInputRecord}
            outputs={gatedResult as ToolResultRecord}
            reportUrl={reportUrl}
          />
        ) : null}

        {gatedResult && showAiSummary ? (
          <AISummaryPanel
            locale={locale}
            toolId={tool.id}
            toolName={toolTitle}
            inputs={validation.success ? (validation.data as ToolInputRecord) : (input as ToolInputRecord)}
            outputs={gatedResult as ToolResultRecord}
          />
        ) : null}

        {showAdvisor ? <AdvisorPanel insights={advisorInsights} /> : null}

        {gatedResult ? (
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <VisualizationSection input={input} result={gatedResult} />
          </section>
        ) : null}

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

        {gatedResult ? (
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <ToolHistory toolId={tool.id} toolTitle={toolTitle} input={input} result={gatedResult} />
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
