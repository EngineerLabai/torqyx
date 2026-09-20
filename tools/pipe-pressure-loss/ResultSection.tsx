"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { PipePressureLossResult } from "./types";

const formatNumber = (value: number | null, digits = 2, locale: "tr" | "en") =>
  formatNumberFixed(value, locale, digits);

export default function ResultSection({ result }: ToolResultProps<PipePressureLossResult>) {
  const { locale } = useLocale();
  const isTr = locale === "tr";
  const regimeLabel = result.regime === "laminar"
    ? isTr ? "Laminer" : "Laminar"
    : result.regime === "transition"
      ? isTr ? "Geçiş" : "Transition"
      : result.regime === "turbulent"
        ? isTr ? "Türbülanslı" : "Turbulent"
        : "-";
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{isTr ? "Sonuçlar" : "Results"}</h2>
        <p className="text-xs text-slate-500">
          {isTr ? "Akış rejimi, sürtünme faktörü ve düz boru basınç kaybı." : "Flow regime, friction factor, and straight-pipe pressure loss."}
        </p>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      ) : null}

      {result.regime === "transition" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800" role="status">
          {isTr
            ? "Re 2300-4000 geçiş bölgesindedir. Gösterilen Swamee-Jain değeri yalnız ön tahmindir; çalışma noktası ve ölçümle doğrulayın."
            : "Re is in the 2300-4000 transition range. The displayed Swamee-Jain value is a screening estimate; verify the operating point and measurements."}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{isTr ? "Kesit alanı A (m²)" : "Area A (m²)"}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.area, 6, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Re</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.reynolds, 0, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">f</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.frictionFactor, 4, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{isTr ? "Bağıl pürüzlülük ε/D" : "Relative roughness ε/D"}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.relativeRoughness, 6, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{isTr ? "Akış rejimi" : "Flow regime"}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{regimeLabel}</p>
          <p className="mt-1 text-[10px] text-slate-500">{result.frictionMethod ?? "-"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">DeltaP (kPa)</p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {formatNumber(result.deltaP ? result.deltaP / 1000 : null, 1, locale)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">DeltaP (bar)</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.deltaPBar, 3, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{isTr ? "Pompa gücü, η=%70 (kW)" : "Pump power, η=70% (kW)"}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.pumpPower, 2, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{isTr ? "Yük kaybı (m)" : "Head loss (m)"}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.headLoss, 3, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Hız (m/s)</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.velocity, 2, locale)}</p>
        </div>
      </div>

      <ExplanationPanel
        title={isTr ? "Formül ve değişkenler" : "Formula and variables"}
        formulas={["A = pi * D^2 / 4", "v = Q / A", "Re = rho * v * D / mu", "f = 64 / Re (laminar)", "f = 0.25 / [log10(eps/3.7D + 5.74/Re^0.9)]^2 (Swamee-Jain)", "DeltaP = f * (L/D) * (rho v^2 / 2)"]}
        variables={[
          { symbol: "rho", description: "Yoğunluk (kg/m3)." },
          { symbol: "mu", description: "Viskozite (Pa·s)." },
          { symbol: "Q", description: "Debi (m3/s)." },
          { symbol: "D", description: "İç çap (m)." },
          { symbol: "L", description: "Hat uzunluğu (m)." },
        ]}
        notes={isTr
          ? ["Re < 2300 laminer; Re 2300-4000 geçiş; Re > 4000 türbülanslı kabul edilir.", "Yerel kayıplar dahil değildir: ΔPminor = Ktoplam·ρ·v²/2 ayrıca eklenmelidir.", "Pompa gücü %70 verim varsayılır."]
          : ["Re < 2300 is laminar; 2300-4000 is transition; Re > 4000 is turbulent.", "Minor losses are excluded; add ΔPminor = Ktotal·ρ·v²/2 separately.", "Pump power assumes 70% efficiency."]}
      />
    </div>
  );
}
