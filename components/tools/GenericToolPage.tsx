"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { useLocale } from "@/components/i18n/LocaleProvider";
import type {
  ToolChartConfig,
  ToolDefinition,
  ToolInputDefinition,
  ToolInputOption,
} from "@/tools/registry";

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
}: GenericToolPageProps<TInputs, TResult>) {
  const { locale } = useLocale();
  const [values, setValues] = useState<Record<string, string>>(() => getDefaultValues(tool.inputs));
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setValues(getDefaultValues(tool.inputs));
  }, [tool.id, tool.inputs]);

  const copy =
    locale === "en"
      ? {
          inputs: "Inputs",
          results: "Results",
          formula: "Formula",
          chart: "Chart",
          chartEmpty: "Provide valid values to render the chart.",
          resultEmpty: "Fix the highlighted inputs to see results.",
          required: "Required field.",
          invalidNumber: "Enter a valid number.",
          invalidOption: "Select a valid option.",
          min: "Min",
          max: "Max",
        }
      : {
          inputs: "Girdiler",
          results: "Sonuclar",
          formula: "Formul",
          chart: "Grafik",
          chartEmpty: "Grafik icin gecerli degerler girin.",
          resultEmpty: "Sonuclari gormek icin hatali alanlari duzeltin.",
          required: "Zorunlu alan.",
          invalidNumber: "Gecerli sayi girin.",
          invalidOption: "Gecerli bir secim yapin.",
          min: "Min",
          max: "Max",
        };

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    tool.inputs.forEach((input) => {
      shape[input.key] = buildFieldSchema(input, copy);
    });
    return z.object(shape);
  }, [tool.inputs, copy]);

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

  const results = useMemo(
    () => (normalizedInputs ? tool.calculate(normalizedInputs) : null),
    [normalizedInputs, tool],
  );

  const resultEntries = useMemo(() => {
    if (!results || typeof results !== "object") return [];
    return Object.entries(results).filter(([, value]) => isPrimitive(value));
  }, [results]);

  const chartConfig = useMemo(() => {
    if (!results || !normalizedInputs || !tool.chartConfig) return null;
    return tool.chartConfig(results, normalizedInputs);
  }, [results, normalizedInputs, tool]);

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
      <ToolDocTabs slug={tool.id}>
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
                  <ResultRow key={key} label={formatKey(key)} value={formatValue(value, locale)} />
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-red-600">{copy.resultEmpty}</p>
            )}
          </div>
        </section>

        {tool.formulaDisplay ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">{copy.formula}</h2>
            <p className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700">
              {tool.formulaDisplay}
            </p>
          </section>
        ) : null}

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
  if (input.type === "select") {
    const options = (input.options ?? []).map((option) => String(option.value));
    return z
      .string({ required_error: copy.required })
      .refine((value) => options.includes(String(value)), copy.invalidOption);
  }

  const numberSchema = z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return NaN;
        return Number(trimmed);
      }
      return value;
    },
    z.number({
      invalid_type_error: copy.invalidNumber,
      required_error: copy.required,
    }),
  );

  let schema = numberSchema.refine((value) => Number.isFinite(value), copy.invalidNumber);

  if (typeof input.min === "number") {
    const minLabel = input.unit ? `${copy.min} ${input.min} ${input.unit}` : `${copy.min} ${input.min}`;
    schema = schema.min(input.min, minLabel);
  }

  if (typeof input.max === "number") {
    const maxLabel = input.unit ? `${copy.max} ${input.max} ${input.unit}` : `${copy.max} ${input.max}`;
    schema = schema.max(input.max, maxLabel);
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

function formatValue(value: unknown, locale: "tr" | "en") {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") {
    return locale === "en" ? (value ? "Yes" : "No") : value ? "Evet" : "Hayir";
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "-";
    return value.toLocaleString(locale === "en" ? "en-US" : "tr-TR", { maximumFractionDigits: 4 });
  }
  return String(value);
}
