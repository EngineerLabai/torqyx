"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type Inputs = {
  bore: string;
  stroke: string;
  cylinders: string;
  rpm: string;
  volumetricEff: string; // %
  acting: "single" | "double";
};

const INITIAL: Inputs = {
  bore: "60",
  stroke: "45",
  cylinders: "2",
  rpm: "1400",
  volumetricEff: "80",
  acting: "single",
};

const COPY = {
  tr: {
    badges: {
      primary: "Kompresör",
      secondary: "Hacimsel",
    },
    title: "Kompresör CC / Debi Hesaplayıcı (Pistonlu)",
    description:
      "Piston çapı, strok, silindir sayısı ve devir ile teorik hacimsel kapasiteyi hesaplar. Tek/çift etkili seçimi ve volumetrik verim ile yaklaşık gerçek debiyi verir. Sonuçlar serbest hava debisi (FAD) değildir; tahmini iç hacim deplasmanıdır.",
    sections: {
      inputs: "Girişler",
      results: "Sonuçlar",
    },
    fields: {
      bore: "Piston çapı [mm]",
      stroke: "Strok [mm]",
      cylinders: "Silindir adedi",
      rpm: "RPM",
      volumetricEff: "Volumetrik verim [%]",
      acting: "Etki tipi",
      actingOptions: {
        single: "Tek etkili",
        double: "Çift etkili",
      },
    },
    helpers: {
      volumetricEff: "Tipik 70-90%",
    },
    results: {
      sweptCc: "Süpürülen hacim (cc/dev)",
      sweptL: "Süpürülen hacim (L/dev)",
      theoreticalFlow: "Teorik debi",
      actualFlow: "Tahmini gerçek debi",
      assumptions:
        "Varsayımlar: Basit pistonlu, kayıpsız hacim = π/4·D²·S·(silindir·etki). Debi = hacim/dev × rpm × volumetrik verim. FAD için test/standart yöntem gerekir.",
    },
    units: {
      cc: "cc",
      lPerRev: "L/dev",
      lPerMin: "L/dk",
    },
    errors: {
      invalid: "Lütfen pozitif ve makul sayılar girin (verim ≤ 120%).",
    },
  },
  en: {
    badges: {
      primary: "Compressor",
      secondary: "Volumetric",
    },
    title: "Piston Compressor Displacement & Flow Calculator",
    description:
      "Calculates theoretical swept volume from bore, stroke, cylinder count, and rpm. Applies single/double-acting selection and volumetric efficiency to estimate actual flow. Results are not FAD; they represent internal displacement estimates.",
    sections: {
      inputs: "Inputs",
      results: "Results",
    },
    fields: {
      bore: "Bore [mm]",
      stroke: "Stroke [mm]",
      cylinders: "Number of cylinders",
      rpm: "RPM",
      volumetricEff: "Volumetric efficiency [%]",
      acting: "Acting type",
      actingOptions: {
        single: "Single-acting",
        double: "Double-acting",
      },
    },
    helpers: {
      volumetricEff: "Typical 70–90%",
    },
    results: {
      sweptCc: "Swept volume (cc/rev)",
      sweptL: "Swept volume (L/rev)",
      theoreticalFlow: "Theoretical flow",
      actualFlow: "Estimated actual flow",
      assumptions:
        "Assumptions: Ideal piston displacement = π/4·D²·S·(cylinders·acting factor). Flow = volume/rev × rpm × volumetric efficiency. Use test data or standards to determine FAD.",
    },
    units: {
      cc: "cc",
      lPerRev: "L/rev",
      lPerMin: "L/min",
    },
    errors: {
      invalid: "Enter positive, reasonable values (efficiency ≤ 120%).",
    },
  },
} as const;

type CompressorCcClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function CompressorCcPage({ initialDocs }: CompressorCcClientProps) {
  const { locale } = useLocale();
  const copy = COPY[locale];
  const [inputs, setInputs] = useState<Inputs>(INITIAL);

  const results = useMemo(() => {
    const bore = parseNumber(inputs.bore);
    const stroke = parseNumber(inputs.stroke);
    const cylinders = parseNumber(inputs.cylinders);
    const rpm = parseNumber(inputs.rpm);
    const ve = parseNumber(inputs.volumetricEff);
    const actingFactor = inputs.acting === "double" ? 2 : 1;

    const valid =
      bore !== null &&
      stroke !== null &&
      cylinders !== null &&
      rpm !== null &&
      ve !== null &&
      bore > 0 &&
      stroke > 0 &&
      cylinders > 0 &&
      rpm > 0 &&
      ve > 0 &&
      ve <= 120;
    if (!valid) {
      return null;
    }

    // mm^3 per rev
    const sweptPerRev_mm3 =
      (Math.PI / 4) * bore * bore * stroke * cylinders * actingFactor;
    const sweptPerRev_cc = sweptPerRev_mm3 / 1000;
    const sweptPerRev_L = sweptPerRev_cc / 1000;
    const theoFlow_L_min = sweptPerRev_L * rpm;
    const actualFlow_L_min = theoFlow_L_min * (ve / 100);

    return {
      sweptPerRev_cc,
      sweptPerRev_L,
      theoFlow_L_min,
      actualFlow_L_min,
    };
  }, [inputs]);

  function handleChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <PageShell>
      <ToolDocTabs slug="compressor-cc" initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {copy.badges.primary}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
              {copy.badges.secondary}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">
            {copy.title}
          </h1>
          <p className="mt-2 text-xs text-slate-600">
            {copy.description}
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.inputs}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label={copy.fields.bore}
                value={inputs.bore}
                onChange={(v) => handleChange("bore", v)}
                min={1}
                step={1}
                inputMode="numeric"
              />
              <Field
                label={copy.fields.stroke}
                value={inputs.stroke}
                onChange={(v) => handleChange("stroke", v)}
                min={1}
                step={1}
                inputMode="numeric"
              />
              <Field
                label={copy.fields.cylinders}
                value={inputs.cylinders}
                onChange={(v) => handleChange("cylinders", v)}
                min={1}
                step={1}
                inputMode="numeric"
              />
              <Field
                label={copy.fields.rpm}
                value={inputs.rpm}
                onChange={(v) => handleChange("rpm", v)}
                min={1}
                step={1}
                inputMode="numeric"
              />
              <Field
                label={copy.fields.volumetricEff}
                value={inputs.volumetricEff}
                onChange={(v) => handleChange("volumetricEff", v)}
                helper={copy.helpers.volumetricEff}
                min={1}
                max={120}
                step={0.1}
                inputMode="decimal"
              />
              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">
                  {copy.fields.acting}
                </span>
                <select
                  value={inputs.acting}
                  onChange={(e) => handleChange("acting", e.target.value as Inputs["acting"])}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  <option value="single">{copy.fields.actingOptions.single}</option>
                  <option value="double">{copy.fields.actingOptions.double}</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.results}</h3>
            {results ? (
              <div className="space-y-2">
                <ResultRow
                  label={copy.results.sweptCc}
                  value={`${results.sweptPerRev_cc.toFixed(1)} ${copy.units.cc}`}
                />
                <ResultRow
                  label={copy.results.sweptL}
                  value={`${results.sweptPerRev_L.toFixed(3)} ${copy.units.lPerRev}`}
                />
                <ResultRow
                  label={copy.results.theoreticalFlow}
                  value={`${results.theoFlow_L_min.toFixed(1)} ${copy.units.lPerMin}`}
                />
                <ResultRow
                  label={copy.results.actualFlow}
                  value={`${results.actualFlow_L_min.toFixed(1)} ${copy.units.lPerMin}`}
                />
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                  {copy.results.assumptions}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-red-600">
                {copy.errors.invalid}
              </p>
            )}
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
  helper,
  min,
  max,
  step,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
      />
      {helper && <span className="text-[10px] text-slate-500">{helper}</span>}
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

function parseNumber(value: string) {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}
