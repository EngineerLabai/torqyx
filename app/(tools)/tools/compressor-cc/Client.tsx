"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import {
  calculateCompressorCc,
  type CompressorCcInput,
} from "@/tools/compressor-cc/logic";

type Inputs = CompressorCcInput;

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
      "Piston çapı, strok, silindir sayısı ve devir ile ideal geometrik deplasmanı hesaplar. Tek/çift etkili seçimi ve volumetrik verim ile verim-düzeltilmiş deplasman debisini verir. Sonuçlar serbest hava debisi (FAD) değildir.",
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
      volumetricEff: "Tipik %70-90; ondalık virgül desteklenir",
    },
    results: {
      sweptCc: "Geometrik deplasman (cc/dev)",
      sweptL: "Geometrik deplasman (L/dev)",
      theoreticalFlow: "Geometrik deplasman debisi",
      actualFlow: "Verim-düzeltilmiş deplasman debisi",
      assumptions:
        "Model sınırı: Bu sonuç FAD değil, ideal geometrik piston deplasmanıdır. Çift etkili seçimde iki yüz de tam piston alanı kabul edilir; mil alanı, ölü hacim, valf ve kaçak kayıpları, basınç oranı ile FAD referans koşulları hesaba katılmaz.",
    },
    units: {
      cc: "cc",
      lPerRev: "L/dev",
      lPerMin: "L/dk",
    },
    errors: {
      "invalid-number": "Sonlu sayılar girin; ondalık ayırıcı olarak virgül veya nokta kullanabilirsiniz.",
      "non-positive": "Piston çapı, strok ve devir sıfırdan büyük olmalıdır.",
      "invalid-cylinder-count": "Silindir adedi pozitif bir tam sayı olmalıdır.",
      "invalid-efficiency": "Volumetrik verim %0'dan büyük ve en fazla %120 olmalıdır.",
      "invalid-acting": "Geçerli bir etki tipi seçin.",
      "result-out-of-range": "Girdiler hesaplanabilir aralığın dışında. Daha küçük, sonlu değerler girin.",
    },
  },
  en: {
    badges: {
      primary: "Compressor",
      secondary: "Volumetric",
    },
    title: "Piston Compressor Displacement & Flow Calculator",
    description:
      "Calculates ideal geometric displacement from bore, stroke, cylinder count, and rpm. Applies single/double-acting selection and volumetric efficiency to estimate efficiency-adjusted displacement flow. Results are not Free Air Delivery (FAD).",
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
      volumetricEff: "Typically 70–90%; decimal comma is supported",
    },
    results: {
      sweptCc: "Geometric displacement (cc/rev)",
      sweptL: "Geometric displacement (L/rev)",
      theoreticalFlow: "Geometric displacement flow",
      actualFlow: "Efficiency-adjusted displacement flow",
      assumptions:
        "Model boundary: This result is ideal geometric piston displacement, not FAD. Double-acting mode assumes full bore area on both faces; rod area, clearance volume, valve/leakage losses, pressure ratio, and FAD reference conditions are not modeled.",
    },
    units: {
      cc: "cc",
      lPerRev: "L/rev",
      lPerMin: "L/min",
    },
    errors: {
      "invalid-number": "Enter finite numbers; either a decimal point or decimal comma is accepted.",
      "non-positive": "Bore, stroke, and RPM must be greater than zero.",
      "invalid-cylinder-count": "Cylinder count must be a positive integer.",
      "invalid-efficiency": "Volumetric efficiency must be greater than 0% and no more than 120%.",
      "invalid-acting": "Select a valid acting type.",
      "result-out-of-range": "The inputs are outside the calculable range. Enter smaller finite values.",
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

  const calculation = useMemo(() => calculateCompressorCc(inputs), [inputs]);
  const results = calculation.ok ? calculation.result : null;
  const errorMessage = calculation.ok ? null : copy.errors[calculation.error];

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
                 aria-label="Select field">
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
                  value={`${results.geometricDisplacementCcPerRev.toFixed(1)} ${copy.units.cc}`}
                />
                <ResultRow
                  label={copy.results.sweptL}
                  value={`${results.geometricDisplacementLPerRev.toFixed(3)} ${copy.units.lPerRev}`}
                />
                <ResultRow
                  label={copy.results.theoreticalFlow}
                  value={`${results.geometricFlowLMin.toFixed(1)} ${copy.units.lPerMin}`}
                />
                <ResultRow
                  label={copy.results.actualFlow}
                  value={`${results.efficiencyAdjustedFlowLMin.toFixed(1)} ${copy.units.lPerMin}`}
                />
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                  {copy.results.assumptions}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-red-600">
                {errorMessage}
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
       aria-label="Number input"/>
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
