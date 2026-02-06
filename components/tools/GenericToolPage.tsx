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
import ToolTrustPanel from "@/components/tools/ToolTrustPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage, getMessages } from "@/utils/messages";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildShareUrl, decodeToolState, encodeToolState } from "@/utils/tool-share";
import type { ToolDefinition, ToolInputDefinition, ToolInputOption } from "@/tools/registry";

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

type GenericToolPageProps<TInputs extends Record<string, unknown>, TResult> = {
  tool: ToolDefinition<TInputs, TResult>;
  initialDocs?: ComponentProps<typeof ToolDocTabs>["initialDocs"];
};

const getDefaultValues = (inputs: ToolInputDefinition[]) =>
  inputs.reduce<Record<string, string>>((acc, input) => {
    acc[input.key] = String(input.default ?? "");
    return acc;
  }, {});

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

export default function GenericToolPage<TInputs extends Record<string, unknown>, TResult>({
  tool,
  initialDocs,
}: GenericToolPageProps<TInputs, TResult>) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.components.genericToolPage;
  const validationCopy = messages.components.toolValidation;
  const calcFailedCopy = copy.calcFailed;
  const common = messages.common;
  const [values, setValues] = useState<Record<string, string>>(() => getDefaultValues(tool.inputs));
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasHydrated = useRef(false);

  useEffect(() => {
    Promise.resolve().then(() => setValues(getDefaultValues(tool.inputs)));
  }, [tool.id, tool.inputs]);

  useEffect(() => {
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
  }, [searchParams, tool.inputs]);

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    tool.inputs.forEach((input) => {
      shape[input.key] = buildFieldSchema(input, validationCopy);
    });
    return z.object(shape);
  }, [tool.inputs, validationCopy]);

  const parsed = useMemo(() => schema.safeParse(values), [schema, values]);
  const errors = useMemo(() => {
    if (parsed.success) return {};
    const flattened = parsed.error.flatten().fieldErrors;
    return Object.entries(flattened).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value && value.length > 0) {
        acc[key] = value[0] ?? "";
      }
      return acc;
    }, {});
  }, [parsed]);

  const normalizedInputs = useMemo(() => {
    if (!parsed.success) return null;
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
    return normalized as TInputs;
  }, [parsed, tool.inputs]);

  const { results, calcError } = useMemo(() => {
    if (!normalizedInputs) return { results: null, calcError: "" };
    try {
      return { results: tool.calculate(normalizedInputs), calcError: "" };
    } catch {
      return { results: null, calcError: calcFailedCopy };
    }
  }, [normalizedInputs, tool, calcFailedCopy]);

  const resultEntries = useMemo(() => {
    if (!results || typeof results !== "object") return [];
    return Object.entries(results).filter(([, value]) => isPrimitive(value));
  }, [results]);

  const chartConfig = useMemo(() => {
    if (!results || !normalizedInputs || !tool.chartConfig) return null;
    try {
      return tool.chartConfig(results, normalizedInputs);
    } catch {
      return null;
    }
  }, [results, normalizedInputs, tool]);

  const formula = resolveLocalizedValue(tool.formula, locale) ?? tool.formulaDisplay;
  const assumptions = resolveLocalizedValue(tool.assumptions, locale);
  const references = resolveLocalizedValue(tool.references, locale);

  const encodedState = useMemo(() => encodeToolState(values), [values]);
  const shareUrl = useMemo(() => {
    if (!pathname || typeof window === "undefined") return "";
    return buildShareUrl(`${window.location.origin}${pathname}`, values);
  }, [pathname, values]);
  const reportBase = withLocalePrefix(`/tools/${tool.id}/report`, locale);
  const reportUrl = encodedState ? `${reportBase}?input=${encodedState}` : reportBase;

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

  return (
    <PageShell>
      <ToolDocTabs slug={tool.id} initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
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
            {parsed.success && results ? (
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
