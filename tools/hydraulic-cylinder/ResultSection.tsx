import ExplanationPanel from "@/components/tools/ExplanationPanel";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { HydraulicCylinderResult } from "./types";

const formatNumber = (value: number | null, digits = 2) => {
  if (value === null || !Number.isFinite(value)) return "-";
  return value.toFixed(digits);
};

export default function ResultSection({ result }: ToolResultProps<HydraulicCylinderResult>) {
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
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.forceExtend, 1)} kN</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Geri kuvvet</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.forceRetract, 1)} kN</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">İleri hız</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.speedExtend, 1)} mm/s</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Geri hız</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.speedRetract, 1)} mm/s</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Hidrolik güç</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.hydraulicPower, 2)} kW</p>
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
