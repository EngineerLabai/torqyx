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
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Sonuçlar</h2>
        <p className="text-xs text-slate-500">İleri ve geri kuvvet/hız değerleri.</p>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">İleri kuvvet</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.forceExtend, 1, locale)} kN</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Geri kuvvet</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.forceRetract, 1, locale)} kN</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">İleri hız</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.speedExtend, 1, locale)} mm/s</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Geri hız</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.speedRetract, 1, locale)} mm/s</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Hidrolik güç</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.hydraulicPower, 2, locale)} kW</p>
        </div>
      </div>

      <ExplanationPanel
        title="Formül ve değişkenler"
        formulas={["F = p * A", "v = Q / A", "P = p * Q"]}
        variables={[
          { symbol: "p", description: "Basınç (Pa)." },
          { symbol: "A", description: "Alan (m2)." },
          { symbol: "Q", description: "Debi (m3/s)." },
        ]}
        notes={["Geri hareket annulus alanı ile hesaplanır.", "Hidrolik güç verim kayıpları dahil değildir."]}
      />
    </div>
  );
}
