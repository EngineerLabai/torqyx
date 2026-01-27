import ExplanationPanel from "@/components/tools/ExplanationPanel";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { HeatResult } from "./types";

const formatNumber = (value: number | null, digits = 4) => {
  if (value === null || Number.isNaN(value)) return "-";
  return value.toFixed(digits);
};

export default function ResultSection({ result }: ToolResultProps<HeatResult>) {
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Sonuc Akisi</h2>
        <p className="text-xs text-slate-500">
          Sonucu, ne yaptik / nasil hesapladik / ne anlama geliyor seklinde asama asama gorursun.
        </p>
      </div>

      {result.error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      )}

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">1. Ne yaptik?</p>
          <p className="mt-1 text-xs text-slate-600">
            Isil direnci hesapladik ve bu direncten gecen isi akis degerini cikardik.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">2. Nasil hesapladik?</p>
          <p className="mt-2 text-[11px] font-medium text-slate-500">Formul</p>
          <p className="mt-1 font-mono text-[12px] text-slate-900">{result.formula}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] text-slate-600">
            {result.steps.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            3. Sonuc ne anlama geliyor?
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] font-medium text-slate-500">Isi Akisi (Q)</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.heatFlow)} W</p>
              <p className="text-[11px] text-slate-500">Bu, verilen sartlarda aktarilan isi miktaridir.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] font-medium text-slate-500">Isil Direnc (R)</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.resistance)} K/W</p>
              <p className="text-[11px] text-slate-500">Bu deger arttikca isi transferi azalir.</p>
            </div>
          </div>
        </div>

        <ExplanationPanel
          formulas={["Q = k * A * dT / L", "R = L / (k * A)"]}
          variables={[
            { symbol: "k", description: "Isil iletkenlik (W/mK)." },
            { symbol: "A", description: "Isi gecen alan (m2)." },
            { symbol: "dT", description: "Sicaklik farki (C)." },
            { symbol: "L", description: "Kalinlik (m)." },
            { symbol: "Q", description: "Isi akisi (W)." },
            { symbol: "R", description: "Isil direnc (K/W)." },
          ]}
          notes={[
            "Tek katmanli, kararlı durum iletim modeli icindir.",
            "Konveksiyon veya radyasyon etkileri dahil degildir.",
            "Malzeme homojen varsayilir; kritik tasarimlarda detayli analiz gerekir.",
          ]}
        />
      </div>
    </div>
  );
}
