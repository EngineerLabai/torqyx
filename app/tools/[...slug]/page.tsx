"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ToolTrustPanel from "@/components/tools/ToolTrustPanel";
import ReportChart from "@/components/tools/report/ReportChart";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { decodeToolState } from "@/utils/tool-share";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { toolRegistry, type ToolChartConfig } from "@/tools/registry";
import { toolCatalog, getToolCopy } from "@/tools/_shared/catalog";
import { getToolPageTool } from "@/tools/tool-page-tools";
import { getReportTool } from "@/tools/report-tools";
import { downloadReportPdf } from "@/utils/report-export";
import type { ToolReference } from "@/tools/_shared/types";

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

type ReportRow = { label: string; value: string };

type ReportData = {
  title: string;
  description?: string;
  inputs: ReportRow[];
  results: ReportRow[];
  formula?: string;
  assumptions?: string[];
  references?: ToolReference[];
  chartConfig?: ToolChartConfig | null;
  toolHref: string;
};

export default function ToolReportRoute() {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.components.toolReport;
  const common = messages.common;
  const params = useParams();
  const searchParams = useSearchParams();

  const slugParts = Array.isArray(params?.slug) ? params.slug : params?.slug ? [params.slug] : [];
  const isReportRoute = slugParts.at(-1) === "report";
  const toolSlug = isReportRoute ? slugParts.slice(0, -1).join("/") : "";

  const shared = useMemo(
    () => decodeToolState<Record<string, string | number>>(searchParams?.get("input") ?? null),
    [searchParams],
  );

  const reportData = useMemo(() => {
    if (!isReportRoute || !toolSlug) return null;
    return buildReportData(toolSlug, shared ?? {}, locale, common);
  }, [isReportRoute, toolSlug, shared, locale, common]);

  if (!reportData) {
    return (
      <PageShell>
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          {copy.missing}
        </section>
      </PageShell>
    );
  }

  const today = new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", DATE_FORMAT);
  const pdfTitle = `${reportData.title} - ${copy.title}`;

  return (
    <PageShell>
      <section id="report-print-area" className="space-y-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">{copy.title}</p>
              <h1 className="text-lg font-semibold text-slate-900">{reportData.title}</h1>
              {reportData.description ? (
                <p className="text-xs text-slate-600">{reportData.description}</p>
              ) : null}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-[11px] text-slate-500">
              <span className="block font-semibold text-slate-700">{copy.dateLabel}</span>
              <span className="block">{today}</span>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.inputs}</h2>
            <div className="space-y-2">
              {reportData.inputs.map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-[11px] text-slate-600">{row.label}</span>
                  <span className="font-mono text-[11px] font-semibold text-slate-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.results}</h2>
            {reportData.results.length > 0 ? (
              <div className="space-y-2">
                {reportData.results.map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-[11px] text-slate-600">{row.label}</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-900">{row.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">{copy.missing}</p>
            )}
          </div>
        </section>

        {reportData.chartConfig ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">{messages.components.genericToolPage.chart}</h2>
            <ReportChart config={reportData.chartConfig} />
          </section>
        ) : null}

        <ToolTrustPanel
          formula={reportData.formula}
          assumptions={reportData.assumptions}
          references={reportData.references}
        />

        <div className="no-print flex flex-wrap items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
          >
            {copy.print}
          </button>
          <button
            type="button"
            onClick={() => downloadReportPdf("report-print-area", pdfTitle)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400"
          >
            {copy.downloadPdf}
          </button>
          <Link
            href={reportData.toolHref}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400"
          >
            {copy.back}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function buildReportData(
  slug: string,
  shared: Record<string, string | number>,
  locale: "tr" | "en",
  common: { yes: string; no: string },
): ReportData | null {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  if (!normalized) return null;

  const toolPath = `/tools/${normalized}`;
  const catalogItem = toolCatalog.find((tool) => tool.href === toolPath || tool.id === normalized) ?? null;
  const catalogCopy = catalogItem ? getToolCopy(catalogItem, locale) : null;
  const localizedToolHref = withLocalePrefix(catalogItem?.href ?? toolPath, locale);

  const genericTool = toolRegistry.find((tool) => tool.id === normalized) ?? null;
  if (genericTool) {
    const defaults = genericTool.inputs.reduce<Record<string, string | number>>((acc, input) => {
      acc[input.key] = input.default;
      return acc;
    }, {});
    const merged = mergeSharedValues(defaults, shared);

    const inputs = genericTool.inputs.map((input) => {
      const raw = merged[input.key];
      const label = input.unit ? `${input.label} (${input.unit})` : input.label;
      const value = formatValue(raw, locale, common, input.unit);
      return { label, value };
    });

    const calcInputs = genericTool.inputs.reduce<Record<string, unknown>>((acc, input) => {
      const raw = merged[input.key];
      if (input.type === "select") {
        acc[input.key] = raw;
      } else {
        const fallback = Number(input.default);
        const num = Number(raw);
        acc[input.key] = Number.isFinite(num) ? num : fallback;
      }
      return acc;
    }, {});

    const results = safeCalculate(() => genericTool.calculate(calcInputs as never));
    const resultRows = buildResultRows(results, locale, common);
    const chartConfig = genericTool.chartConfig
      ? safeCalculate(() => genericTool.chartConfig?.(results as never, calcInputs as never))
      : null;

    return {
      title: catalogCopy?.title ?? genericTool.title,
      description: catalogCopy?.description ?? genericTool.description,
      inputs,
      results: resultRows,
      formula: resolveLocalizedValue(genericTool.formula, locale) ?? genericTool.formulaDisplay,
      assumptions: resolveLocalizedValue(genericTool.assumptions, locale),
      references: resolveLocalizedValue(genericTool.references, locale),
      chartConfig: chartConfig ?? null,
      toolHref: localizedToolHref,
    };
  }

  const pageTool = getToolPageTool(normalized);
  if (pageTool) {
    const initial = pageTool.initialInput as Record<string, unknown>;
    const merged = mergeSharedValues(initial, shared);
    const inputs = pageTool.inputMeta
      ? pageTool.inputMeta.map((meta) => {
          const raw = merged[meta.key];
          const label = meta.unit ? `${meta.label} (${meta.unit})` : meta.label;
          return { label, value: formatValue(raw, locale, common, meta.unit) };
        })
      : Object.entries(merged).map(([key, value]) => ({
          label: formatKey(key),
          value: formatValue(value, locale, common),
        }));

    const results = safeCalculate(() => pageTool.calculate(merged as never));
    const resultRows = buildResultRows(results, locale, common);

    return {
      title: catalogCopy?.title ?? pageTool.title,
      description: catalogCopy?.description ?? pageTool.description,
      inputs,
      results: resultRows,
      formula: resolveLocalizedValue(pageTool.formula, locale),
      assumptions: resolveLocalizedValue(pageTool.assumptions, locale),
      references: resolveLocalizedValue(pageTool.references, locale),
      toolHref: localizedToolHref,
    };
  }

  const reportTool = getReportTool(normalized);
  if (reportTool) {
    const defaults = reportTool.inputs.reduce<Record<string, string>>((acc, input) => {
      acc[input.key] = input.default;
      return acc;
    }, {});
    const merged = mergeSharedValues(defaults, shared, true);

    const inputs = reportTool.inputs.map((input) => {
      const label = resolveLocalizedValue(input.label, locale) ?? input.key;
      const value = formatValue(merged[input.key], locale, common, input.unit);
      return { label: input.unit ? `${label} (${input.unit})` : label, value };
    });

    const results = safeCalculate(() => reportTool.calculate(merged));
    const resultRows = buildResultRows(results, locale, common);

    return {
      title: resolveLocalizedValue(reportTool.title, locale) ?? catalogCopy?.title ?? normalized,
      description: resolveLocalizedValue(reportTool.description, locale) ?? catalogCopy?.description,
      inputs,
      results: resultRows,
      formula: resolveLocalizedValue(reportTool.formula, locale),
      assumptions: resolveLocalizedValue(reportTool.assumptions, locale),
      references: resolveLocalizedValue(reportTool.references, locale),
      toolHref: localizedToolHref,
    };
  }

  return null;
}

function mergeSharedValues<T extends Record<string, unknown>>(
  base: T,
  shared: Record<string, string | number>,
  forceString = false,
) {
  const next = { ...base } as Record<string, unknown>;
  Object.entries(shared).forEach(([key, value]) => {
    if (key in next) {
      next[key] = forceString ? String(value) : value;
    }
  });
  return next as T;
}

function buildResultRows(results: unknown, locale: "tr" | "en", common: { yes: string; no: string }) {
  if (!results || typeof results !== "object") return [] as ReportRow[];
  return Object.entries(results)
    .filter(([, value]) => isPrimitive(value))
    .map(([key, value]) => ({ label: formatKey(key), value: formatValue(value, locale, common) }));
}

function safeCalculate<T>(fn: () => T) {
  try {
    return fn();
  } catch {
    return null;
  }
}

function isPrimitive(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function formatKey(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value: unknown, locale: "tr" | "en", common: { yes: string; no: string }, unit?: string) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? common.yes : common.no;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "-";
    return `${formatNumber(value, locale)}${unit ? ` ${unit}` : ""}`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return "-";
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return `${formatNumber(parsed, locale)}${unit ? ` ${unit}` : ""}`;
    }
    return `${value}${unit ? ` ${unit}` : ""}`;
  }

  return String(value);
}

function formatNumber(value: number, locale: "tr" | "en") {
  return value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
    maximumFractionDigits: 4,
  });
}
