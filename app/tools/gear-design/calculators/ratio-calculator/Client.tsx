"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ToolActions from "@/components/tools/ToolActions";
import ToolTrustPanel from "@/components/tools/ToolTrustPanel";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage, getMessages } from "@/utils/messages";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildShareUrl, decodeToolState, encodeToolState } from "@/utils/tool-share";
import { getReportTool } from "@/tools/report-tools";

const TOOL_ID = "gear-design/calculators/ratio-calculator";

const DEFAULT_INPUTS = {
  z1: "20",
  z2: "60",
  rpm1: "1500",
  torque1: "50",
  efficiency: "0.97",
};

type Inputs = typeof DEFAULT_INPUTS;

type RatioResults = {
  ratio: number;
  rpm2: number | null;
  torque2: number | null;
  efficiency: number;
};

type RatioCalculatorClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function RatioCalculatorPage({ initialDocs }: RatioCalculatorClientProps) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.pages.gearRatio;
  const validationCopy = messages.components.toolValidation;
  const actionsCopy = messages.components.toolActions;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [inputs, setInputs] = useState<Inputs>(() => buildInitialInputs(searchParams?.get("input") ?? null));

  const schema = useMemo(
    () =>
      z.object({
        z1: buildNumberSchema(copy.fields.z1, validationCopy, { min: 1 }),
        z2: buildNumberSchema(copy.fields.z2, validationCopy, { min: 1 }),
        rpm1: buildNumberSchema(copy.fields.rpm1, validationCopy, { min: 0 }),
        torque1: buildNumberSchema(copy.fields.torque1, validationCopy, { min: 0 }),
        efficiency: buildNumberSchema(copy.fields.efficiency, validationCopy, { min: 0, max: 1 }),
      }),
    [copy.fields, validationCopy],
  );

  const parsed = useMemo(() => schema.safeParse(inputs), [schema, inputs]);
  const errors = useMemo(() => mapErrors(parsed), [parsed]);

  const { results, calcError } = useMemo(() => {
    if (!parsed.success) return { results: null as RatioResults | null, calcError: validationCopy.resultFix };
    try {
      const { z1, z2, rpm1, torque1, efficiency } = parsed.data;
      const ratio = z2 / z1;
      const rpm2 = rpm1 > 0 ? rpm1 / ratio : null;
      const torque2 = torque1 > 0 ? torque1 * ratio * efficiency : null;
      return { results: { ratio, rpm2, torque2, efficiency }, calcError: "" };
    } catch {
      return { results: null as RatioResults | null, calcError: validationCopy.calcFailed };
    }
  }, [parsed, validationCopy.calcFailed, validationCopy.resultFix]);

  const reportTool = getReportTool(TOOL_ID);
  const formula = resolveLocalizedValue(reportTool?.formula, locale);
  const assumptions = resolveLocalizedValue(reportTool?.assumptions, locale);
  const references = resolveLocalizedValue(reportTool?.references, locale);

  const encodedState = useMemo(() => encodeToolState(inputs), [inputs]);
  const shareUrl = useMemo(() => {
    if (!pathname || typeof window === "undefined") return "";
    return buildShareUrl(`${window.location.origin}${pathname}`, inputs);
  }, [pathname, inputs]);
  const reportBase = withLocalePrefix(`/tools/${TOOL_ID}/report`, locale);
  const reportUrl = encodedState ? `${reportBase}?input=${encodedState}` : reportBase;

  const formatDecimal = (value: number, digits: number) =>
    value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });

  return (
    <PageShell>
      <ToolDocTabs slug={TOOL_ID} initialDocs={initialDocs}>
        <Header copy={copy.header} />

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{copy.card.title}</h2>
              <p className="text-sm text-slate-700">{copy.card.description}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              {copy.card.status}
            </span>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label={copy.fields.z1}
              value={inputs.z1}
              onChange={(value) => setInputs((prev) => ({ ...prev, z1: value }))}
              error={errors.z1}
              min={1}
            />
            <Field
              label={copy.fields.z2}
              value={inputs.z2}
              onChange={(value) => setInputs((prev) => ({ ...prev, z2: value }))}
              error={errors.z2}
              min={1}
            />
            <Field
              label={copy.fields.rpm1}
              value={inputs.rpm1}
              onChange={(value) => setInputs((prev) => ({ ...prev, rpm1: value }))}
              error={errors.rpm1}
              min={0}
            />
            <Field
              label={copy.fields.torque1}
              value={inputs.torque1}
              onChange={(value) => setInputs((prev) => ({ ...prev, torque1: value }))}
              error={errors.torque1}
              min={0}
            />
            <Field
              label={copy.fields.efficiency}
              value={inputs.efficiency}
              onChange={(value) => setInputs((prev) => ({ ...prev, efficiency: value }))}
              error={errors.efficiency}
              min={0}
              max={1}
              step={0.01}
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setInputs(DEFAULT_INPUTS)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
              >
                {copy.fields.sample}
              </button>
            </div>
          </div>

          {results ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Result label={copy.results.ratio} value={formatDecimal(results.ratio, 3)} />
              <Result
                label={copy.results.rpm2}
                value={results.rpm2 !== null ? formatDecimal(results.rpm2, 1) : "—"}
              />
              <Result
                label={copy.results.torque2}
                value={results.torque2 !== null ? formatDecimal(results.torque2, 1) : "—"}
              />
              <Result label={copy.results.efficiency} value={formatDecimal(results.efficiency, 3)} />
            </div>
          ) : (
            <p className="mt-3 text-xs text-red-600">{calcError}</p>
          )}

          <p className="mt-3 text-[11px] text-slate-600">{copy.note}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">{actionsCopy.shareTitle}</h2>
            <p className="text-xs text-slate-500">{actionsCopy.shareDescription}</p>
          </div>
          <div className="mt-3">
            <ToolActions shareUrl={shareUrl} reportUrl={reportUrl} />
          </div>
        </section>

        <ToolTrustPanel formula={formula} assumptions={assumptions} references={references} />
      </ToolDocTabs>
    </PageShell>
  );
}

function Header({ copy }: { copy: { back: string; badge: string; title: string; description: string } }) {
  const { locale } = useLocale();
  const calculatorsHref = withLocalePrefix("/tools/gear-design/calculators", locale);
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
      <div className="relative space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={calculatorsHref}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {copy.back}
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            {copy.badge}
          </span>
        </div>
        <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">{copy.title}</h1>
        <p className="text-sm leading-relaxed text-slate-700">{copy.description}</p>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step ?? "any"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
      />
      {error ? <span className="text-[10px] text-red-600">{error}</span> : null}
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
      <span className="text-slate-600">{label}</span>
      <span className="font-mono text-[12px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function buildNumberSchema(
  label: string,
  copy: Record<string, string>,
  options: { min?: number; max?: number },
) {
  let schema = z
    .string()
    .min(1, formatMessage(copy.required, { field: label }))
    .refine((value) => Number.isFinite(Number(value)), formatMessage(copy.invalidNumber, { field: label }))
    .transform((value) => Number(value));

  if (typeof options.min === "number") {
    schema = schema.refine(
      (value) => value >= options.min!,
      formatMessage(copy.min, { field: label, min: options.min }),
    );
  }

  if (typeof options.max === "number") {
    schema = schema.refine(
      (value) => value <= options.max!,
      formatMessage(copy.max, { field: label, max: options.max }),
    );
  }

  return schema;
}

function mapErrors(result: { success: boolean; error?: z.ZodError }) {
  if (result.success) return {} as Record<string, string>;
  if (!result.error) return {} as Record<string, string>;
  const flattened = result.error.flatten().fieldErrors as Record<string, string[]>;
  return Object.entries(flattened).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value && value.length > 0) {
      acc[key] = value[0] ?? "";
    }
    return acc;
  }, {});
}

function buildInitialInputs(param: string | null) {
  const shared = decodeToolState<Record<string, string | number>>(param);
  if (!shared) return { ...DEFAULT_INPUTS };
  return {
    ...DEFAULT_INPUTS,
    ...Object.fromEntries(Object.entries(shared).map(([key, value]) => [key, String(value)])),
  } as Inputs;
}
