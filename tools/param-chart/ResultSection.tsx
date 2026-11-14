"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { ChartResult } from "./types";

const formatNumber = (value: number | null, digits = 3, locale: "tr" | "en") =>
  formatNumberFixed(value, locale, digits);

const COPY = {
  tr: {
    title: "Sonuç Akışı",
    description: "Sonucu, ne yaptık / nasıl hesapladık / ne anlama geliyor şeklinde aşama aşama görürsün.",
    step1Title: "1. Ne yaptık?",
    step1Desc: "Yay sabiti ve maksimum yer değiştirmeye göre F-x noktalarını oluşturduk.",
    step2Title: "2. Nasıl hesapladık?",
    step2Formula: "Formül",
    step3Title: "3. Sonuç ne anlama geliyor?",
    step3Desc: "Bu, seçilen maksimum yer değiştirmedeki kuvvettir.",
    previewTitle: "Örnek Noktalar",
    variables: [
      { symbol: "F", description: "Kuvvet (N)." },
      { symbol: "k", description: "Yay sabiti (N/m)." },
      { symbol: "x", description: "Yer değiştirme (m). Grafikte mm kullanılır ve m'ye çevrilir." },
    ],
    notes: [
      "Hooke yasası lineer bölge için geçerlidir.",
      "Gerçek sistemlerde plastik bölgeye geçişte doğrusal olmayan davranış görülebilir.",
      "Grafik, hızlı ön boyutlama için kullanılabilir.",
    ],
  },
  en: {
    title: "Calculation Flow",
    description: "Review step-by-step what was done, how it was calculated, and what the result means.",
    step1Title: "1. What was done?",
    step1Desc: "Generated discrete F-x evaluation points based on spring stiffness and maximum displacement.",
    step2Title: "2. How was it calculated?",
    step2Formula: "Formula",
    step3Title: "3. What does the result mean?",
    step3Desc: "This represents the maximum reaction force at the specified peak displacement.",
    previewTitle: "Sample Evaluation Points",
    variables: [
      { symbol: "F", description: "Reaction force (N)." },
      { symbol: "k", description: "Spring stiffness (N/m)." },
      { symbol: "x", description: "Displacement (m). Input is in mm and converted to metres." },
    ],
    notes: [
      "Hooke's Law applies strictly within the linear elastic deflection range.",
      "Non-linear stiffness behavior may occur near solid height or coil contact.",
      "This chart is designed for rapid preliminary spring sizing.",
    ],
  },
};

export default function ResultSection({ result }: ToolResultProps<ChartResult>) {
  const { locale } = useLocale();
  const copy = COPY[locale];
  const preview = result.points.slice(0, 6);

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      {result.error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      )}

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.step1Title}</p>
          <p className="mt-1 text-xs text-slate-600">{copy.step1Desc}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{copy.step2Title}</p>
          <p className="mt-2 text-[11px] font-medium text-slate-500">{copy.step2Formula}</p>
          <p className="mt-1 font-mono text-[12px] text-slate-900">{result.formula}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] text-slate-600">
            {result.steps.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {copy.step3Title}
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatNumber(result.maxForce, 3, locale)} N</p>
          <p className="text-[11px] text-slate-500">{copy.step3Desc}</p>
        </div>

        <ExplanationPanel
          title={locale === "tr" ? "Formül ve değişkenler" : "Formula and variables"}
          formulas={["F = k * x"]}
          variables={copy.variables}
          notes={copy.notes}
        />
      </div>

      {preview.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
          <p className="text-[11px] font-medium text-slate-500">{copy.previewTitle}</p>
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
