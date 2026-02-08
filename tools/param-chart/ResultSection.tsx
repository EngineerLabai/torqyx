"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { ChartResult } from "./types";

const formatNumber = (value: number | null, digits = 3, locale: "tr" | "en") =>
  formatNumberFixed(value, locale, digits);

export default function ResultSection({ result }: ToolResultProps<ChartResult>) {
  const { locale } = useLocale();
  const preview = result.points.slice(0, 6);

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
            Yay sabiti ve maksimum yer değiştirmeye göre F-x noktalarını oluşturduk.
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
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatNumber(result.maxForce, 3, locale)} N</p>
          <p className="text-[11px] text-slate-500">
            Bu, seçilen maksimum yer değiştirmedeki kuvvettir.
          </p>
        </div>

        <ExplanationPanel
          formulas={["F = k * x"]}
          variables={[
            { symbol: "F", description: "Kuvvet (N)." },
            { symbol: "k", description: "Yay sabiti (N/m)." },
            { symbol: "x", description: "Yer değiştirme (m). Grafikte mm kullanılır ve m'ye çevrilir." },
          ]}
          notes={[
            "Hooke yasası lineer bölge için geçerlidir.",
            "Gerçek sistemlerde plastik bölgeye geçişte doğrusal olmayan davranış görülebilir.",
            "Grafik, hızlı ön boyutlama için kullanılabilir.",
          ]}
        />
      </div>

      {preview.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
          <p className="text-[11px] font-medium text-slate-500">Örnek Noktalar</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2">x [mm]</th>
                  <th className="pb-2">F [N]</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((point) => (
                  <tr key={`${point.x}-${point.y}`} className="border-t border-slate-100">
                    <td className="py-1 font-mono text-slate-700">{formatNumber(point.x, 2, locale)}</td>
                    <td className="py-1 font-mono text-slate-700">{formatNumber(point.y, 2, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
