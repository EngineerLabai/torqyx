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
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Sonuçlar</h2>
        <p className="text-xs text-slate-500">Re, sürtünme katsayısı ve basınç kaybı.</p>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Re</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.reynolds, 0, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">f</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.frictionFactor, 4, locale)}</p>
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
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Pompa gücü (kW)</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.pumpPower, 2, locale)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Hız (m/s)</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.velocity, 2, locale)}</p>
        </div>
      </div>

      <ExplanationPanel
        title="Formül ve değişkenler"
        formulas={["Re = rho * v * D / mu", "f = 0.25 / [log10(eps/3.7D + 5.74/Re^0.9)]^2", "DeltaP = f * (L/D) * (rho v^2 / 2)"]}
        variables={[
          { symbol: "rho", description: "Yoğunluk (kg/m3)." },
          { symbol: "mu", description: "Viskozite (Pa·s)." },
          { symbol: "Q", description: "Debi (m3/s)." },
          { symbol: "D", description: "İç çap (m)." },
          { symbol: "L", description: "Hat uzunluğu (m)." },
        ]}
        notes={["Re < 2000 ise laminer kabul edilir.", "Pompa gücü %70 verim varsayılır."]}
      />
    </div>
  );
}
