"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { HydraulicCylinderResult } from "./types";

const formatNumber = (value: number | null, digits = 2, locale: "tr" | "en") =>
  formatNumberFixed(value, locale, digits);

export default function ResultSection({ result }: ToolResultProps<HydraulicCylinderResult>) {
  const { locale } = useLocale();
  const copy = locale === "tr"
    ? {
        title: "Sonuçlar",
        description: "İleri ve geri kuvvet/hız değerleri.",
        forceExtend: "İleri kuvvet",
        forceRetract: "Geri kuvvet",
        speedExtend: "İleri hız",
        speedRetract: "Geri hız",
        power: "Hidrolik güç",
        formulaTitle: "Formül ve değişkenler",
        pressure: "Basınç (Pa).",
        area: "Alan (m²).",
        flow: "Debi (m³/s).",
        annulus: "Geri hareket halka alanı ile hesaplanır.",
        losses: "Hidrolik güç verim kayıpları dahil değildir.",
        errors: { invalid: "Pozitif ve sonlu değerler girin; verim %0 ile %100 arasında olmalıdır.", rod: "Mil çapı silindir çapından küçük olmalıdır.", range: "Girdiler hesaplama aralığının dışında." },
      }
    : {
        title: "Results",
        description: "Extend and retract force/speed values.",
        forceExtend: "Extend force",
        forceRetract: "Retract force",
        speedExtend: "Extend speed",
        speedRetract: "Retract speed",
        power: "Hydraulic power",
        formulaTitle: "Formula and variables",
        pressure: "Pressure (Pa).",
        area: "Area (m²).",
        flow: "Flow rate (m³/s).",
        annulus: "Retract motion uses the annulus area.",
        losses: "Hydraulic power excludes efficiency losses.",
        errors: { invalid: "Enter positive, finite values; efficiency must be between 0% and 100%.", rod: "The rod diameter must be smaller than the bore diameter.", range: "Inputs are outside the calculation range." },
      };

  const error = result.error
    ? result.error.includes("Mil çapı")
      ? copy.errors.rod
      : result.error.includes("Girdiler")
        ? copy.errors.range
        : copy.errors.invalid
    : null;

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      {error ? <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">{error}</div> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.forceExtend}</p><p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.forceExtend, 1, locale)} kN</p></div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.forceRetract}</p><p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.forceRetract, 1, locale)} kN</p></div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.speedExtend}</p><p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.speedExtend, 1, locale)} mm/s</p></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.speedRetract}</p><p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.speedRetract, 1, locale)} mm/s</p></div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.power}</p><p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.hydraulicPower, 2, locale)} kW</p></div>
      </div>

      <ExplanationPanel
        title={copy.formulaTitle}
        formulas={["F = p * A", "v = Q / A", "P = p * Q"]}
        variables={[{ symbol: "p", description: copy.pressure }, { symbol: "A", description: copy.area }, { symbol: "Q", description: copy.flow }]}
        notes={[copy.annulus, copy.losses]}
      />
    </div>
  );
}
