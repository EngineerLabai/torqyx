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
        <h2 className="text-sm font-semibold text-slate-900">Sonuç Akışı</h2>
        <p className="text-xs text-slate-500">
          Sonucu, ne yaptık / nasıl hesapladık / ne anlama geliyor şeklinde aşama aşama görürsün.
        </p>
      </div>

      {result.error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      )}

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">1. Ne yaptık?</p>
          <p className="mt-1 text-xs text-slate-600">
            Girdiğin değeri önce temel birime çevirdik, sonra hedef birime dönüştürdük.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">2. Nasıl hesapladık?</p>
          <p className="mt-2 text-[11px] font-medium text-slate-500">Formül</p>
          <p className="mt-1 font-mono text-[12px] text-slate-900">{result.formula}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] text-slate-600">
            {result.steps.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            3. Sonuç ne anlama geliyor?
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatNumber(result.output)} {result.toLabel}
          </p>
          <p className="text-[11px] text-slate-500">
            Bu değer, girdiğin miktarın hedef birimdeki karşılığıdır. Temel birim:{" "}
            {formatNumber(result.baseValue)} {result.baseUnitLabel}
          </p>
        </div>

        <ExplanationPanel
          formulas={[result.formula]}
          variables={[
            { symbol: "V_in", description: "Girdiğin değer." },
            { symbol: "V_out", description: "Hedef birimdeki sonuç." },
            { symbol: "factor_from", description: "Kaynak birimin temel birime çevrim katsayısı." },
            { symbol: "factor_to", description: "Hedef birimin temel birime çevrim katsayısı." },
          ]}
          notes={[
            "Dönüşümler seçilen kategoriye ait temel birim üzerinden yapılır.",
            "Raporlama ve hızlı kontrol için kullanılabilir.",
            "Yuvarlama görünüm içindir; ham değerler hesaplamada kullanılır.",
          ]}
        />
      </div>
    </div>
  );
}
