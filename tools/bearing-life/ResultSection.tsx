import ExplanationPanel from "@/components/tools/ExplanationPanel";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { BearingLifeResult } from "./types";

const formatNumber = (value: number | null, digits = 2) => {
  if (value === null || !Number.isFinite(value)) return "-";
  return value.toFixed(digits);
};

export default function ResultSection({ result }: ToolResultProps<BearingLifeResult>) {
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Sonuçlar</h2>
        <p className="text-xs text-slate-500">L10 ömrü ve saate çevrilmiş L10h değerleri.</p>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">L10 (milyon devir)</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.L10)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">L10h (saat)</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.L10h)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Üs p</p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {result.exponent ? formatNumber(result.exponent, 3) : "-"}
          </p>
        </div>
      </div>

      <ExplanationPanel
        title="Hesap adımları"
        formulas={["L10 = a1 * (C / P)^p", "L10h = (L10 * 10^6) / (60 * n)"]}
        variables={[
          { symbol: "C", description: "Dinamik yük (kN)." },
          { symbol: "P", description: "Eşdeğer yük (kN)." },
          { symbol: "p", description: "Bilyalı için 3, makaralı için 10/3." },
          { symbol: "a1", description: "Güvenilirlik faktörü (1=90%)." },
          { symbol: "n", description: "Devir (rpm)." },
        ]}
        notes={["L10 ömrü %90 güvenilirlik tanımına göre hesaplanır.", "a1 faktörü ile güvenilirlik ayarlanır."]}
      />
    </div>
  );
}
