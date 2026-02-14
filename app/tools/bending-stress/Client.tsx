"use client";

import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
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
import { trackEvent } from "@/utils/analytics";
import { getReportTool } from "@/tools/report-tools";

const TOOL_ID = "bending-stress";

type CrossSectionType = "rect" | "circle";

type Inputs = {
  beamLengthMm: string;
  forcekN: string;
  sectionType: CrossSectionType;
  widthMm: string;
  heightMm: string;
  youngModulus: string;
  yieldStrength: string;
};

type Results = {
  maxMoment: number | null;
  sectionModulus: number | null;
  inertia: number | null;
  sigma: number | null;
  deflection: number | null;
  safety: number | null;
  beamLengthMm: number | null;
};

const DEFAULT_INPUTS: Inputs = {
  beamLengthMm: "500",
  forcekN: "2",
  sectionType: "rect",
  widthMm: "40",
  heightMm: "8",
  youngModulus: "210000",
  yieldStrength: "355",
};

type BendingStressClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function BendingStressPage({ initialDocs }: BendingStressClientProps) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.pages.bendingStress;
  const validationCopy = messages.components.toolValidation;
  const actionsCopy = messages.components.toolActions;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [inputs, setInputs] = useState<Inputs>(() => buildInitialInputs(searchParams?.get("input") ?? null));

  const schema = useMemo(() => {
    const base = z.object({
      beamLengthMm: buildNumberSchema(copy.inputs.beamLength, validationCopy, { min: 1 }),
      forcekN: buildNumberSchema(copy.inputs.force, validationCopy, { min: 0.001 }),
      sectionType: z.enum(["rect", "circle"]),
      widthMm: buildNumberSchema(copy.inputs.width, validationCopy, { min: 0.1 }),
      heightMm: z.string(),
      youngModulus: buildNumberSchema(copy.inputs.youngModulus, validationCopy, { min: 1 }),
      yieldStrength: buildNumberSchema(copy.inputs.yieldStrength, validationCopy, { min: 1 }),
    });

    return base.superRefine((data, ctx) => {
      if (data.sectionType === "rect") {
        const h = Number(data.heightMm);
        if (!Number.isFinite(h)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["heightMm"],
            message: formatMessage(validationCopy.invalidNumber, { field: copy.inputs.height }),
          });
        } else if (h <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["heightMm"],
            message: formatMessage(validationCopy.min, { field: copy.inputs.height, min: 0.1 }),
          });
        }
      }
    });
  }, [copy.inputs, validationCopy]);

  const parsed = useMemo(() => schema.safeParse(inputs), [schema, inputs]);
  const errors = useMemo(() => mapErrors(parsed), [parsed]);

  const { results, calcError } = useMemo(() => {
    if (!parsed.success) {
      return { results: null as Results | null, calcError: validationCopy.resultFix };
    }

    try {
      const data = parsed.data;
      const L = data.beamLengthMm;
      const FkN = data.forcekN;
      const b = data.widthMm;
      const h = Number(data.heightMm);
      const E = data.youngModulus;
      const Re = data.yieldStrength;

      const F = FkN * 1000;
      const Mmax = (F * L) / 4;

      let I: number;
      let W: number;

      if (data.sectionType === "rect") {
        I = (b * Math.pow(h, 3)) / 12;
        W = (b * Math.pow(h, 2)) / 6;
      } else {
        I = (Math.PI * Math.pow(b, 4)) / 64;
        W = (Math.PI * Math.pow(b, 3)) / 32;
      }

      const sigma = Mmax / W;
      const deflection = (F * Math.pow(L, 3)) / (48 * E * I);
      const safety = Re / sigma;

      return {
        results: {
          maxMoment: Mmax,
          sectionModulus: W,
          inertia: I,
          sigma,
          deflection,
          safety,
          beamLengthMm: L,
        },
        calcError: "",
      };
    } catch {
      return { results: null as Results | null, calcError: validationCopy.calcFailed };
    }
  }, [parsed, validationCopy.calcFailed, validationCopy.resultFix]);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("calculate_click", { tool_id: TOOL_ID, tool_title: copy.header.title });
  };

  return (
    <PageShell>
      <ToolDocTabs slug={TOOL_ID} initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {copy.badges.primary}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
              {copy.badges.secondary}
            </span>
          </div>

          <h1 className="text-lg font-semibold text-slate-900">{copy.header.title}</h1>
          <p className="mt-2 text-xs text-slate-600">{copy.header.description}</p>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.1fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.inputs.title}</h2>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field
                  label={copy.inputs.beamLength}
                  value={inputs.beamLengthMm}
                  onChange={(value) => handleChange(setInputs, "beamLengthMm", value)}
                  error={errors.beamLengthMm}
                  min={1}
                />
                <Field
                  label={copy.inputs.force}
                  value={inputs.forcekN}
                  onChange={(value) => handleChange(setInputs, "forcekN", value)}
                  error={errors.forcekN}
                  min={0}
                  step={0.1}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">{copy.inputs.sectionType}</label>
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange(setInputs, "sectionType", "rect")}
                    className={`rounded-full border px-3 py-1 text-[11px] ${
                      inputs.sectionType === "rect"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {copy.inputs.sectionRect}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange(setInputs, "sectionType", "circle")}
                    className={`rounded-full border px-3 py-1 text-[11px] ${
                      inputs.sectionType === "circle"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {copy.inputs.sectionCircle}
                  </button>
                </div>
                {errors.sectionType ? <p className="text-[10px] text-red-600">{errors.sectionType}</p> : null}
              </div>

              {inputs.sectionType === "rect" ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field
                    label={copy.inputs.width}
                    value={inputs.widthMm}
                    onChange={(value) => handleChange(setInputs, "widthMm", value)}
                    error={errors.widthMm}
                    min={0}
                  />
                  <Field
                    label={copy.inputs.height}
                    value={inputs.heightMm}
                    onChange={(value) => handleChange(setInputs, "heightMm", value)}
                    error={errors.heightMm}
                    min={0}
                  />
                </div>
              ) : (
                <Field
                  label={copy.inputs.diameter}
                  value={inputs.widthMm}
                  onChange={(value) => handleChange(setInputs, "widthMm", value)}
                  error={errors.widthMm}
                  min={0}
                />
              )}

              <div className="grid gap-2 sm:grid-cols-2">
                <Field
                  label={copy.inputs.youngModulus}
                  value={inputs.youngModulus}
                  onChange={(value) => handleChange(setInputs, "youngModulus", value)}
                  error={errors.youngModulus}
                  min={0}
                />
                <Field
                  label={copy.inputs.yieldStrength}
                  value={inputs.yieldStrength}
                  onChange={(value) => handleChange(setInputs, "yieldStrength", value)}
                  error={errors.yieldStrength}
                  min={0}
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                {copy.inputs.calculate}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.results.title}</h2>

              {results ? (
                <div className="space-y-2">
                  <ResultRow
                    label={copy.results.maxMoment}
                    value={
                      results.maxMoment !== null
                        ? `${(results.maxMoment / 1e6).toFixed(3)} kN·m`
                        : "—"
                    }
                  />
                  <ResultRow
                    label={copy.results.inertia}
                    value={
                      results.inertia !== null
                        ? `${results.inertia.toExponential(3)} mm⁴`
                        : "—"
                    }
                  />
                  <ResultRow
                    label={copy.results.sectionModulus}
                    value={
                      results.sectionModulus !== null
                        ? `${results.sectionModulus.toExponential(3)} mm³`
                        : "—"
                    }
                  />
                  <ResultRow
                    label={copy.results.sigma}
                    value={results.sigma !== null ? `${results.sigma.toFixed(0)} MPa` : "—"}
                  />
                  <ResultRow
                    label={copy.results.deflection}
                    value={
                      results.deflection !== null
                        ? `${results.deflection.toFixed(2)} mm`
                        : "—"
                    }
                  />
                  <ResultRow
                    label={copy.results.safety}
                    value={results.safety !== null ? results.safety.toFixed(2) : "—"}
                  />
                </div>
              ) : (
                <p className="text-[11px] text-red-600">{calcError}</p>
              )}

              <p className="mt-3 text-[11px] text-slate-500">{copy.results.note}</p>
            </div>

            {results ? (
              <ToolDataActions
                toolSlug={TOOL_ID}
                toolTitle={copy.header.title}
                inputs={inputs}
                outputs={results}
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

            <DesignNotes results={results} copy={copy.notes} />

            <MomentDiagram results={results} copy={copy.diagram} />
          </div>
        </section>
      </ToolDocTabs>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-medium text-slate-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        min={min}
        step={step ?? "any"}
      />
      {error ? <p className="text-[10px] text-red-600">{error}</p> : null}
    </div>
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

function DesignNotes({
  results,
  copy,
}: {
  results: Results | null;
  copy: {
    title: string;
    empty: string;
    safety: {
      unsafe: string;
      veryLow: string;
      low: string;
      ok: string;
      comfortable: string;
      veryHigh: string;
    };
    deflectionMissing: string;
    deflectionBase: string;
    deflectionLow: string;
    deflectionMid: string;
    deflectionOk: string;
    deflectionHigh: string;
    stress: string;
    fatigue: string;
    local: string;
  };
}) {
  if (!results || results.safety === null || results.sigma === null) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-600 shadow-sm">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">{copy.title}</h3>
        <p>{copy.empty}</p>
      </div>
    );
  }

  const { safety, deflection, beamLengthMm, sigma } = results;

  let safetyLabel = "";
  let safetyColor = "bg-emerald-50 text-emerald-800 border-emerald-200";

  if (safety < 1) {
    safetyLabel = copy.safety.unsafe;
    safetyColor = "bg-red-50 text-red-800 border-red-200";
  } else if (safety < 1.3) {
    safetyLabel = copy.safety.veryLow;
    safetyColor = "bg-orange-50 text-orange-800 border-orange-200";
  } else if (safety < 1.5) {
    safetyLabel = copy.safety.low;
    safetyColor = "bg-amber-50 text-amber-800 border-amber-200";
  } else if (safety < 2) {
    safetyLabel = copy.safety.ok;
  } else if (safety < 3) {
    safetyLabel = copy.safety.comfortable;
  } else {
    safetyLabel = copy.safety.veryHigh;
    safetyColor = "bg-slate-50 text-slate-800 border-slate-200";
  }

  let deflectionText = copy.deflectionMissing;
  if (deflection !== null && beamLengthMm !== null && beamLengthMm > 0) {
    const ratio = deflection > 0 ? beamLengthMm / deflection : Infinity;
    deflectionText = formatMessage(copy.deflectionBase, { ratio: ratio.toFixed(0) });

    if (ratio < 150) {
      deflectionText += ` ${copy.deflectionLow}`;
    } else if (ratio < 250) {
      deflectionText += ` ${copy.deflectionMid}`;
    } else if (ratio < 400) {
      deflectionText += ` ${copy.deflectionOk}`;
    } else {
      deflectionText += ` ${copy.deflectionHigh}`;
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[11px] shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{copy.title}</h3>
      <div className={`mb-2 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold ${safetyColor}`}>
        <span className="mr-1">S ≈ {safety.toFixed(2)}</span>
        <span>— {safetyLabel}</span>
      </div>
      <ul className="list-disc space-y-1 pl-4 text-slate-700">
        <li>{formatMessage(copy.stress, { sigma: sigma.toFixed(0) })}</li>
        <li>{deflectionText}</li>
        <li>{copy.fatigue}</li>
        <li>{copy.local}</li>
      </ul>
    </div>
  );
}

function MomentDiagram({
  results,
  copy,
}: {
  results: Results | null;
  copy: {
    title: string;
    empty: string;
    description: string;
  };
}) {
  const maxMoment = results?.maxMoment ?? null;

  if (!maxMoment || maxMoment <= 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-600 shadow-sm">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">{copy.title}</h3>
        <p>{copy.empty}</p>
      </div>
    );
  }

  const width = 260;
  const height = 90;
  const paddingX = 20;
  const paddingY = 10;

  const points: { x: number; y: number }[] = [];
  const n = 40;
  for (let i = 0; i <= n; i += 1) {
    const t = i / n;
    const yNorm = t <= 0.5 ? 2 * t : 2 * (1 - t);
    points.push({ x: t, y: yNorm });
  }

  const pathD =
    points
      .map((p, idx) => {
        const x = paddingX + p.x * (width - 2 * paddingX);
        const y = height - paddingY - p.y * (height - 2 * paddingY);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ") + " ";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[11px] shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{copy.title}</h3>
      <svg width={width} height={height} className="mb-2">
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          className="stroke-slate-300"
          strokeWidth={1}
        />
        <path d={pathD} className="stroke-slate-900 fill-slate-100" strokeWidth={2} />
        <circle cx={paddingX} cy={height - paddingY} r={3} className="fill-slate-700" />
        <circle cx={width - paddingX} cy={height - paddingY} r={3} className="fill-slate-700" />
        <line x1={width / 2} y1={paddingY} x2={width / 2} y2={paddingY + 18} className="stroke-red-500" strokeWidth={2} />
        <polygon
          points={`${width / 2 - 4},${paddingY + 18} ${width / 2 + 4},${paddingY + 18} ${width / 2},${paddingY + 24}`}
          className="fill-red-500"
        />
      </svg>
      <p className="text-slate-600">
        {formatMessage(copy.description, { value: (maxMoment / 1e6).toFixed(3) })}
      </p>
    </div>
  );
}

function handleChange<K extends keyof Inputs>(setState: Dispatch<SetStateAction<Inputs>>, key: K, value: Inputs[K]) {
  setState((prev) => ({ ...prev, [key]: value }));
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
