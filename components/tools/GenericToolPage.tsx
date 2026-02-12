"use client";

import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
} from "chart.js";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ToolActions from "@/components/tools/ToolActions";
import ToolDataActions from "@/components/tools/ToolDataActions";
import ToolTrustPanel from "@/components/tools/ToolTrustPanel";
import ToolMethodNotes from "@/components/tools/ToolMethodNotes";
import AccessBadge from "@/components/tools/AccessBadge";
import { useLocale } from "@/components/i18n/LocaleProvider";
import AdvisorPanel from "@/src/components/tools/AdvisorPanel";
import { getAdvisorInsights } from "@/src/lib/advisor/engine";
import { formatMessage, getMessages } from "@/utils/messages";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildShareUrl, decodeToolState, encodeToolState } from "@/utils/tool-share";
import { getToolById, type ToolDefinition, type ToolInputDefinition, type ToolInputOption } from "@/tools/registry";
import { getToolMethodNotes } from "@/lib/tool-method-notes";
import { toolCatalog } from "@/tools/_shared/catalog";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
);

type GenericToolPageProps = {
  toolId: string;
  initialDocs?: ComponentProps<typeof ToolDocTabs>["initialDocs"];
};

const getDefaultValues = (inputs: ToolInputDefinition[]) =>
  inputs.reduce<Record<string, string>>((acc, input) => {
    acc[input.key] = String(input.default ?? "");
    return acc;
  }, {});

type GenericToolInputs = Record<string, unknown>;

const formatKey = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());

const isPrimitive = (value: unknown) =>
  value === null ||
  value === undefined ||
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean";

export default function GenericToolPage({ toolId, initialDocs }: GenericToolPageProps) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.components.genericToolPage;
  const validationCopy = messages.components.toolValidation;
  const calcFailedCopy = copy.calcFailed;
  const common = messages.common;
  const tool = getToolById(toolId) as ToolDefinition<GenericToolInputs, Record<string, unknown>> | null;
  const catalogEntry = tool ? toolCatalog.find((item) => item.id === tool.id) ?? null : null;
  const access = catalogEntry?.access ?? "free";
  const accessLabel = messages.common.access?.[access] ?? messages.common.access?.free ?? "";
  const [values, setValues] = useState<Record<string, string>>(() => getDefaultValues(tool?.inputs ?? []));
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!tool) return;
    Promise.resolve().then(() => setValues(getDefaultValues(tool.inputs)));
  }, [tool]);

  useEffect(() => {
    if (!tool) return;
    if (hasHydrated.current) return;
    const shared = decodeToolState<Record<string, string | number>>(searchParams?.get("input") ?? null);
    if (shared) {
      const defaults = getDefaultValues(tool.inputs);
      const normalized: Record<string, string> = { ...defaults };
      Object.entries(shared).forEach(([key, value]) => {
        normalized[key] = String(value);
      });
      Promise.resolve().then(() => setValues(normalized));
    }
    hasHydrated.current = true;
  }, [searchParams, tool]);

  const schema = (() => {
    if (!tool) return null;
    const shape: Record<string, z.ZodTypeAny> = {};
    tool.inputs.forEach((input) => {
      shape[input.key] = buildFieldSchema(input, validationCopy);
    });
    return z.object(shape);
  })();

  const parsed = schema ? schema.safeParse(values) : null;
  const errors = (() => {
    if (!parsed || parsed.success) return {};
    const flattened = parsed.error.flatten().fieldErrors;
    return Object.entries(flattened).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value && value.length > 0) {
        acc[key] = value[0] ?? "";
      }
      return acc;
    }, {});
  })();

  const normalizedInputs = (() => {
    if (!parsed || !parsed.success || !tool) return null;
    const data = parsed.data as Record<string, unknown>;
    const normalized: Record<string, unknown> = {};
    tool.inputs.forEach((input) => {
      const raw = data[input.key];
      if (input.type === "select") {
        const match = findOption(input.options, raw);
        normalized[input.key] = match ?? raw;
      } else {
        normalized[input.key] = raw;
      }
    });
    return normalized as GenericToolInputs;
  })();

  let results: Record<string, unknown> | null = null;
  let calcError = "";
  if (normalizedInputs && tool) {
    try {
      results = tool.calculate(normalizedInputs);
    } catch {
      results = null;
      calcError = calcFailedCopy;
    }
  }

  const resultEntries =
    results && typeof results === "object"
      ? Object.entries(results).filter(([, value]) => isPrimitive(value))
      : [];

  const chartConfig = (() => {
    if (!results || !normalizedInputs || !tool?.chartConfig) return null;
    try {
      return tool.chartConfig(results, normalizedInputs);
    } catch {
      return null;
    }
  })();

  const formula = tool ? resolveLocalizedValue(tool.formula, locale) ?? tool.formulaDisplay : "";
  const assumptions = tool ? resolveLocalizedValue(tool.assumptions, locale) : undefined;
  const references = tool ? resolveLocalizedValue(tool.references, locale) : undefined;
  const methodNotes = tool ? getToolMethodNotes(tool.id, locale) : null;

  const encodedState = useMemo(() => encodeToolState(values), [values]);
  const shareUrl = useMemo(() => {
    if (!pathname || typeof window === "undefined") return "";
    return buildShareUrl(`${window.location.origin}${pathname}`, values);
  }, [pathname, values]);
  const reportBase = tool ? withLocalePrefix(`/tools/${tool.id}/report`, locale) : "";
  const reportUrl = encodedState ? `${reportBase}?input=${encodedState}` : reportBase;

  const showAdvisor = tool?.id === "torque-power";
  const advisorInsights = useMemo(() => {
    if (!showAdvisor || !tool) return [];
    return getAdvisorInsights(tool.id, normalizedInputs, {
      locale,
      reportUrl: results ? reportUrl : undefined,
    });
  }, [showAdvisor, tool, normalizedInputs, locale, reportUrl, results]);

  useEffect(() => {
    if (!chartConfig || !canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: chartConfig.type ?? "line",
      data: {
        labels: chartConfig.labels,
        datasets: chartConfig.datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.map((value) => (value === null ? NaN : value)),
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { boxWidth: 10, boxHeight: 10 } },
        },
        scales: {
          x: {
            title: chartConfig.xLabel ? { display: true, text: chartConfig.xLabel } : undefined,
            ticks: { color: "#64748b", font: { size: 10 } },
            grid: { color: "rgba(148, 163, 184, 0.2)" },
          },
          y: {
            title: chartConfig.yLabel ? { display: true, text: chartConfig.yLabel } : undefined,
            ticks: { color: "#64748b", font: { size: 10 } },
            grid: { color: "rgba(148, 163, 184, 0.2)" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [chartConfig]);

  if (!tool) {
    const notFoundCopy = messages.pages.notFound;
    return (
      <PageShell>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[11px] text-rose-700 md:text-xs">
              <span className="font-semibold">404</span>
            </div>
            <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">
              {notFoundCopy.title}
            </h1>
            <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
              {notFoundCopy.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={withLocalePrefix("/tools", locale)}
                className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                {notFoundCopy.primaryCta}
              </a>
              <a href={withLocalePrefix("/", locale)} className="text-xs font-semibold text-slate-500 hover:text-slate-700">
                {notFoundCopy.secondaryCta}
              </a>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ToolDocTabs slug={tool.id} initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {accessLabel ? <AccessBadge access={access} label={accessLabel} /> : null}
            {tool.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
              >
                {category}
              </span>
            ))}
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{tool.title}</h1>
          <p className="mt-2 text-xs text-slate-600">{tool.description}</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.inputs}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tool.inputs.map((input) => (
                <InputField
                  key={input.key}
                  input={input}
                  value={values[input.key] ?? ""}
                  error={errors[input.key]}
                  onChange={(next) => setValues((prev) => ({ ...prev, [input.key]: next }))}
                  locale={locale}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.results}</h2>
            {parsed?.success && results ? (
              <div className="space-y-2">
                {resultEntries.map(([key, value]) => (
                  <ResultRow key={key} label={formatKey(key)} value={formatValue(value, locale, common)} />
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-red-600">{calcError || copy.resultEmpty}</p>
            )}
          </div>
        </section>

        {parsed?.success && results ? (
          <ToolDataActions
            toolSlug={tool.id}
            toolTitle={tool.title}
            inputs={values}
            outputs={results}
            reportUrl={reportUrl}
          />
        ) : null}

        {showAdvisor ? <AdvisorPanel insights={advisorInsights} /> : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">{copy.actionsTitle}</h2>
            <p className="text-[11px] text-slate-500">{copy.actionsDescription}</p>
          </div>
          <div className="mt-3">
            <ToolActions shareUrl={shareUrl} reportUrl={reportUrl} />
          </div>
        </section>

        <ToolTrustPanel formula={formula} assumptions={assumptions} references={references} />
        {methodNotes ? <ToolMethodNotes notes={methodNotes} /> : null}

        {chartConfig ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">{copy.chart}</h2>
            <div className="h-64 w-full">
              <canvas ref={canvasRef} className="h-full w-full" />
            </div>
          </section>
        ) : (
          tool.chartConfig && (
            <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-xs text-slate-500">
              {copy.chartEmpty}
            </section>
          )
        )}
      </ToolDocTabs>
    </PageShell>
  );
}

function buildFieldSchema(input: ToolInputDefinition, copy: Record<string, string>) {
  const label = input.unit ? `${input.label} (${input.unit})` : input.label;
  if (input.type === "select") {
    const options = (input.options ?? []).map((option) => String(option.value));
    return z
      .string()
      .min(1, formatMessage(copy.required, { field: label }))
      .refine((value) => options.includes(String(value)), formatMessage(copy.invalidOption, { field: label }));
  }

  let schema = z
    .string()
    .min(1, formatMessage(copy.required, { field: label }))
    .refine((value) => Number.isFinite(Number(value)), formatMessage(copy.invalidNumber, { field: label }))
    .transform((value) => Number(value));

  const minValue = input.min;
  if (typeof minValue === "number") {
    const minLabel = formatMessage(copy.min, {
      field: label,
      min: input.unit ? `${minValue} ${input.unit}` : minValue,
    });
    schema = schema.refine((value) => value >= minValue, minLabel);
  }

  const maxValue = input.max;
  if (typeof maxValue === "number") {
    const maxLabel = formatMessage(copy.max, {
      field: label,
      max: input.unit ? `${maxValue} ${input.unit}` : maxValue,
    });
    schema = schema.refine((value) => value <= maxValue, maxLabel);
  }

  return schema;
}

function findOption(options: ToolInputOption[] | undefined, value: unknown) {
  if (!options || options.length === 0) return null;
  const match = options.find((option) => String(option.value) === String(value));
  return match ? match.value : null;
}

function InputField({
  input,
  value,
  error,
  onChange,
  locale,
}: {
  input: ToolInputDefinition;
  value: string;
  error?: string;
  onChange: (next: string) => void;
  locale: "tr" | "en";
}) {
  const label = input.unit ? `${input.label} (${input.unit})` : input.label;
  const ariaLabel = input.unit ? `${input.label} ${input.unit}` : input.label;

  if (input.type === "select") {
    return (
      <label className="space-y-1">
        <span className="block text-[11px] font-medium text-slate-700">{label}</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          aria-label={ariaLabel}
        >
          {(input.options ?? []).map((option) => (
            <option key={`${input.key}-${option.value}`} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
        {input.help ? <span className="text-[10px] text-slate-500">{input.help}</span> : null}
        {error ? <span className="text-[10px] text-red-600">{error}</span> : null}
      </label>
    );
  }

  if (input.type === "slider") {
    const displayValue = value || String(input.min ?? 0);
    return (
      <label className="space-y-1">
        <span className="block text-[11px] font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={input.min}
            max={input.max}
            step={input.step ?? 1}
            value={displayValue}
            onChange={(event) => onChange(event.target.value)}
            className="w-full accent-emerald-500"
            aria-label={ariaLabel}
          />
          <span className="min-w-[48px] text-[11px] font-semibold text-slate-700">
            {displayValue}
            {input.unit ? ` ${input.unit}` : ""}
          </span>
        </div>
        {input.help ? <span className="text-[10px] text-slate-500">{input.help}</span> : null}
        {error ? <span className="text-[10px] text-red-600">{error}</span> : null}
      </label>
    );
  }

  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        min={input.min}
        max={input.max}
        step={input.step ?? "any"}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        aria-label={ariaLabel}
        inputMode={locale === "en" ? "decimal" : "numeric"}
      />
      {input.help ? <span className="text-[10px] text-slate-500">{input.help}</span> : null}
      {error ? <span className="text-[10px] text-red-600">{error}</span> : null}
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function formatValue(value: unknown, locale: "tr" | "en", common: { yes: string; no: string }) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") {
    return value ? common.yes : common.no;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "-";
    return value.toLocaleString(locale === "en" ? "en-US" : "tr-TR", { maximumFractionDigits: 4 });
  }
  return String(value);
}
