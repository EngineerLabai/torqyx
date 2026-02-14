"use client";

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import ToolActions from "@/components/tools/ToolActions";
import ToolDataActions from "@/components/tools/ToolDataActions";
import ToolTrustPanel from "@/components/tools/ToolTrustPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage, getMessages } from "@/utils/messages";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildShareUrl, decodeToolState, encodeToolState } from "@/utils/tool-share";
import { getReportTool } from "@/tools/report-tools";

const TOOL_ID = "fluids-hvac";

const DEFAULT_INPUTS = {
  pipeFlow: "12",
  pipeDiameter: "40",
  pipeLength: "50",
  pipeRoughness: "0.05",
  ductFlow: "1800",
  ductVelocity: "6",
  achVolume: "150",
  achRate: "8",
};

type Inputs = typeof DEFAULT_INPUTS;

type PipeResults = {
  Re: number;
  f: number;
  v: number;
  dp: number;
};

type DuctResults = {
  A: number;
  D: number;
  q: number;
};

type AchResults = {
  Q_m3h: number;
  Q_m3s: number;
};

type FluidsHvacClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function FluidsHvacPage({ initialDocs }: FluidsHvacClientProps) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.pages.fluidsHvac;
  const validationCopy = messages.components.toolValidation;
  const actionsCopy = messages.components.toolActions;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [inputs, setInputs] = useState<Inputs>(() => buildInitialInputs(searchParams?.get("input") ?? null));

  const pipeSchema = useMemo(
    () =>
      z.object({
        flow: buildNumberSchema(copy.pipe.flow, validationCopy, { min: 0.001 }),
        diameter: buildNumberSchema(copy.pipe.diameter, validationCopy, { min: 0.001 }),
        length: buildNumberSchema(copy.pipe.length, validationCopy, { min: 0.001 }),
        roughness: buildNumberSchema(copy.pipe.roughness, validationCopy, { min: 0 }),
      }),
    [copy.pipe, validationCopy],
  );

  const ductSchema = useMemo(
    () =>
      z.object({
        flow: buildNumberSchema(copy.duct.flow, validationCopy, { min: 0.001 }),
        velocity: buildNumberSchema(copy.duct.velocity, validationCopy, { min: 0.001 }),
      }),
    [copy.duct, validationCopy],
  );

  const achSchema = useMemo(
    () =>
      z.object({
        volume: buildNumberSchema(copy.ach.volume, validationCopy, { min: 0.001 }),
        ach: buildNumberSchema(copy.ach.rate, validationCopy, { min: 0.001 }),
      }),
    [copy.ach, validationCopy],
  );

  const pipeValidation = useMemo(
    () =>
      pipeSchema.safeParse({
        flow: inputs.pipeFlow,
        diameter: inputs.pipeDiameter,
        length: inputs.pipeLength,
        roughness: inputs.pipeRoughness,
      }),
    [pipeSchema, inputs],
  );

  const ductValidation = useMemo(
    () =>
      ductSchema.safeParse({
        flow: inputs.ductFlow,
        velocity: inputs.ductVelocity,
      }),
    [ductSchema, inputs],
  );

  const achValidation = useMemo(
    () =>
      achSchema.safeParse({
        volume: inputs.achVolume,
        ach: inputs.achRate,
      }),
    [achSchema, inputs],
  );

  const pipeErrors = useMemo(() => mapErrors(pipeValidation), [pipeValidation]);
  const ductErrors = useMemo(() => mapErrors(ductValidation), [ductValidation]);
  const achErrors = useMemo(() => mapErrors(achValidation), [achValidation]);

  const { pipeResults, pipeError } = useMemo(() => {
    if (!pipeValidation.success) return { pipeResults: null as PipeResults | null, pipeError: validationCopy.resultFix };
    try {
      const { flow, diameter, length, roughness } = pipeValidation.data;
      const rho = 1000;
      const mu = 1e-3;
      const Q = flow / 3600;
      const D = diameter / 1000;
      const eps = roughness / 1000;
      const A = (Math.PI * D * D) / 4;
      const v = Q / A;
      const Re = (rho * v * D) / mu;
      let f: number;
      if (Re < 2300) {
        f = 64 / Re;
      } else {
        const term = (eps / D) / 3.7;
        f = Math.pow(-1.8 * Math.log10(Math.pow(term, 1.11) + 6.9 / Re), -2);
      }
      const dp = f * (length / D) * (0.5 * rho * v * v);
      return { pipeResults: { Re, f, v, dp }, pipeError: "" };
    } catch {
      return { pipeResults: null as PipeResults | null, pipeError: validationCopy.calcFailed };
    }
  }, [pipeValidation, validationCopy.calcFailed, validationCopy.resultFix]);

  const { ductResults, ductError } = useMemo(() => {
    if (!ductValidation.success) return { ductResults: null as DuctResults | null, ductError: validationCopy.resultFix };
    try {
      const { flow, velocity } = ductValidation.data;
      const Q = flow / 3600;
      const A = Q / velocity;
      const D = Math.sqrt((4 * A) / Math.PI);
      const rho = 1.2;
      const q = 0.5 * rho * velocity * velocity;
      return { ductResults: { A, D, q }, ductError: "" };
    } catch {
      return { ductResults: null as DuctResults | null, ductError: validationCopy.calcFailed };
    }
  }, [ductValidation, validationCopy.calcFailed, validationCopy.resultFix]);

  const { achResults, achError } = useMemo(() => {
    if (!achValidation.success) return { achResults: null as AchResults | null, achError: validationCopy.resultFix };
    try {
      const { volume, ach } = achValidation.data;
      const Q_m3h = volume * ach;
      const Q_m3s = Q_m3h / 3600;
      return { achResults: { Q_m3h, Q_m3s }, achError: "" };
    } catch {
      return { achResults: null as AchResults | null, achError: validationCopy.calcFailed };
    }
  }, [achValidation, validationCopy.calcFailed, validationCopy.resultFix]);

  const encodedState = useMemo(() => encodeToolState(inputs), [inputs]);
  const shareUrl = useMemo(() => {
    if (!pathname) return "";
    return buildShareUrl(pathname, inputs);
  }, [pathname, inputs]);
  const reportBase = withLocalePrefix(`/tools/${TOOL_ID}/report`, locale);
  const reportUrl = encodedState ? `${reportBase}?input=${encodedState}` : reportBase;

  const reportTool = getReportTool(TOOL_ID);
  const formula = resolveLocalizedValue(reportTool?.formula, locale);
  const assumptions = resolveLocalizedValue(reportTool?.assumptions, locale);
  const references = resolveLocalizedValue(reportTool?.references, locale);

  const combinedOutputs = useMemo(() => {
    const output: Record<string, unknown> = {};
    if (pipeResults) {
      output.pipeRe = pipeResults.Re;
      output.pipeF = pipeResults.f;
      output.pipeVelocity = pipeResults.v;
      output.pipeDp = pipeResults.dp;
    }
    if (ductResults) {
      output.ductArea = ductResults.A;
      output.ductDiameter = ductResults.D;
      output.ductPressure = ductResults.q;
    }
    if (achResults) {
      output.achFlowM3h = achResults.Q_m3h;
      output.achFlowM3s = achResults.Q_m3s;
    }
    return Object.keys(output).length > 0 ? output : null;
  }, [pipeResults, ductResults, achResults]);

  const formatNumber = (value: number, digits: number) =>
    value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });

  return (
    <PageShell>
      <ToolDocTabs slug={TOOL_ID} initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {copy.header.badge}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
              {copy.header.subBadge}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{copy.header.title}</h1>
          <p className="mt-2 text-xs text-slate-600">{copy.header.description}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.pipe.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field
              label={copy.pipe.flow}
              value={inputs.pipeFlow}
              onChange={(value) => setInputs((prev) => ({ ...prev, pipeFlow: value }))}
              error={pipeErrors.flow}
            />
            <Field
              label={copy.pipe.diameter}
              value={inputs.pipeDiameter}
              onChange={(value) => setInputs((prev) => ({ ...prev, pipeDiameter: value }))}
              error={pipeErrors.diameter}
            />
            <Field
              label={copy.pipe.length}
              value={inputs.pipeLength}
              onChange={(value) => setInputs((prev) => ({ ...prev, pipeLength: value }))}
              error={pipeErrors.length}
            />
            <Field
              label={copy.pipe.roughness}
              value={inputs.pipeRoughness}
              onChange={(value) => setInputs((prev) => ({ ...prev, pipeRoughness: value }))}
              helper={copy.pipe.roughnessHelp}
              error={pipeErrors.roughness}
            />
          </div>
          {pipeResults ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <ResultRow label={copy.pipe.resultRe} value={formatNumber(pipeResults.Re, 0)} />
              <ResultRow label={copy.pipe.resultF} value={formatNumber(pipeResults.f, 4)} />
              <ResultRow label={copy.pipe.resultVelocity} value={`${formatNumber(pipeResults.v, 2)} m/s`} />
              <ResultRow
                label={copy.pipe.resultDp}
                value={`${formatNumber(pipeResults.dp / 1000, 2)} kPa`}
              />
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-red-600">{pipeError}</p>
          )}
          <p className="mt-2 text-[11px] text-slate-600">{copy.pipe.note}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.duct.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={copy.duct.flow}
              value={inputs.ductFlow}
              onChange={(value) => setInputs((prev) => ({ ...prev, ductFlow: value }))}
              error={ductErrors.flow}
            />
            <Field
              label={copy.duct.velocity}
              value={inputs.ductVelocity}
              onChange={(value) => setInputs((prev) => ({ ...prev, ductVelocity: value }))}
              error={ductErrors.velocity}
            />
          </div>
          {ductResults ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <ResultRow label={copy.duct.resultArea} value={`${formatNumber(ductResults.A * 1e4, 2)} dm²`} />
              <ResultRow label={copy.duct.resultDiameter} value={`${formatNumber(ductResults.D * 1000, 0)} mm`} />
              <ResultRow label={copy.duct.resultPressure} value={`${formatNumber(ductResults.q, 0)} Pa`} />
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-red-600">{ductError}</p>
          )}
          <p className="mt-2 text-[11px] text-slate-600">{copy.duct.note}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.ach.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={copy.ach.volume}
              value={inputs.achVolume}
              onChange={(value) => setInputs((prev) => ({ ...prev, achVolume: value }))}
              error={achErrors.volume}
            />
            <Field
              label={copy.ach.rate}
              value={inputs.achRate}
              onChange={(value) => setInputs((prev) => ({ ...prev, achRate: value }))}
              error={achErrors.ach}
            />
          </div>
          {achResults ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <ResultRow label={copy.ach.resultFlow} value={`${formatNumber(achResults.Q_m3h, 0)} m³/h`} />
              <ResultRow label={copy.ach.resultFlowPerSecond} value={`${formatNumber(achResults.Q_m3s, 3)} m³/s`} />
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-red-600">{achError}</p>
          )}
          <p className="mt-2 text-[11px] text-slate-600">{copy.ach.note}</p>
        </section>

        {combinedOutputs ? (
          <ToolDataActions
            toolSlug={TOOL_ID}
            toolTitle={copy.header.title}
            inputs={inputs}
            outputs={combinedOutputs}
            reportUrl={reportUrl}
          />
        ) : null}

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

function Field({
  label,
  value,
  onChange,
  helper,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  error?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
      />
      {helper ? <span className="text-[10px] text-slate-500">{helper}</span> : null}
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
