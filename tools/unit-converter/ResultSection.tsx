import ExplanationPanel from "@/components/tools/ExplanationPanel";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { UnitResult } from "./types";

const formatNumber = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return "-";
  const abs = Math.abs(value);
  if (abs >= 1000) return value.toFixed(2);
  if (abs >= 1) return value.toFixed(4);
  return value.toExponential(3);
};

export default function ResultSection({ result }: ToolResultProps<UnitResult>) {
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
            Girdigin degeri once temel birime cevirdik, sonra hedef birime donusturduk.
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
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatNumber(result.output)} {result.toLabel}
          </p>
          <p className="text-[11px] text-slate-500">
            Bu deger, girdigin miktarin hedef birimdeki karsiligidir. Temel birim:
            {" "}{formatNumber(result.baseValue)} {result.baseUnitLabel}
          </p>
        </div>

        <ExplanationPanel
          formulas={[result.formula]}
          variables={[
            { symbol: "V_in", description: "Girdigin deger." },
            { symbol: "V_out", description: "Hedef birimdeki sonuc." },
            { symbol: "factor_from", description: "Kaynak birimin temel birime cevrim katsayisi." },
            { symbol: "factor_to", description: "Hedef birimin temel birime cevrim katsayisi." },
          ]}
          notes={[
            "Donusumler secilen kategoriye ait temel birim uzerinden yapilir.",
            "Raporlama ve hizli kontrol icin kullanilabilir.",
            "Yuvarlama gorunum icindir; ham degerler hesaplamada kullanilir.",
          ]}
        />
      </div>
    </div>
  );
}
