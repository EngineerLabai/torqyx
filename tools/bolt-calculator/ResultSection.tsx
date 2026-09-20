"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { BoltResult } from "./types";

const formatValue = (value: number | null, decimals: number, locale: "tr" | "en", unit?: string) => {
  if (value === null || Number.isNaN(value)) {
    return "-";
  }

  const formatted = formatNumberFixed(value, locale, decimals);
  return unit ? `${formatted} ${unit}` : formatted;
};

export default function ResultSection({ result }: ToolResultProps<BoltResult>) {
  const { locale } = useLocale();
  const copy = locale === "tr"
    ? {
        title: "Hesap Sonuçları",
        description: "Gerilme alanı, ön yük ve ampirik tork faktörü K ile hesaplanan sıkma torku.",
        area: "Gerilme alanı As",
        preload: "Ön yük Fv",
        factor: "Tork faktörü K",
        torque: "Hesaplanan sıkma torku T",
        yield: "Akma dayanımı Re",
        proof: "Proof strength",
        proofUnused: "Bu basit modelde kullanılmıyor",
        stress: "Çekme gerilmesi σ",
        safety: "Akma dayanımına göre güvenlik katsayısı S",
        modelNote: "T = K·F·d modelindeki K; diş, baş altı/somun yüzeyi, yağlama ve kaplama etkilerini birlikte temsil eden ampirik tork faktörüdür. Sürtünme katsayısı μ değildir.",
      }
    : {
        title: "Calculation Results",
        description: "Stress area, preload, and tightening torque calculated with empirical torque factor K.",
        area: "Stress area As",
        preload: "Preload Fv",
        factor: "Torque factor K",
        torque: "Calculated tightening torque T",
        yield: "Yield strength Re",
        proof: "Proof strength",
        proofUnused: "Not used by this simplified model",
        stress: "Tensile stress σ",
        safety: "Safety factor against yield S",
        modelNote: "In T = K·F·d, K is an empirical torque factor combining thread, bearing-surface, lubrication, and coating effects. It is not the coefficient of friction μ.",
      };
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

      <div className="space-y-2 text-xs">
        <ResultRow label={copy.area} value={formatValue(result.As, 1, locale, "mm²")} />
        <ResultRow label={copy.preload} value={formatValue(result.Fv, 2, locale, "kN")} />
        <ResultRow label={copy.factor} value={formatValue(result.torqueFactor, 2, locale)} />
        <ResultRow label={copy.torque} value={formatValue(result.torque, 1, locale, "N·m")} />
        <ResultRow label={copy.yield} value={formatValue(result.yieldStrength, 0, locale, "MPa")} />
        <ResultRow label={copy.proof} value={copy.proofUnused} />
        <ResultRow label={copy.stress} value={formatValue(result.sigma, 0, locale, "MPa")} />
        <ResultRow label={copy.safety} value={formatValue(result.safety, 2, locale)} />
      </div>

      <p className="text-[11px] text-slate-500">
        {copy.modelNote}
      </p>

      <ExplanationPanel
        formulas={[
          "As = (pi/4) * (d - 0.9382 * P)^2",
          "Fv = preload * Re * As",
          "T = K * Fv * d",
          "sigma = Fv / As",
          "S = Re / sigma",
        ]}
        variables={[
          { symbol: "d", description: "Nominal çap (mm)." },
          { symbol: "P", description: "Diş adımı (mm)." },
          { symbol: "As", description: "Gerilme alanı (mm^2)." },
          { symbol: "Re", description: "Akma dayanımı (MPa)." },
          { symbol: "Fv", description: "Ön yük (N)." },
          { symbol: "K", description: locale === "tr" ? "Ampirik tork (nut) faktörü; μ değildir." : "Empirical torque/nut factor; not μ." },
          { symbol: "T", description: "Tork (Nm). d metreye çevrilerek kullanılır." },
          { symbol: "sigma", description: "Çekme gerilmesi (MPa)." },
          { symbol: "S", description: "Güvenlik katsayısı." },
        ]}
        notes={[
          "Metrik dişler için yaklaşık gerilme alanı formülü kullanılır.",
          locale === "tr" ? "K değeri bağlantı geometrisi, yağlama ve kaplamaya göre deneysel olarak doğrulanmalıdır." : "K should be verified experimentally for the joint geometry, lubrication, and coating.",
          locale === "tr" ? "Kritik bağlantılarda VDI 2230 gibi ayrıntılı bir bağlantı modeli kullanın." : "Use a detailed joint model such as VDI 2230 for critical connections.",
        ]}
      />
    </div>
  );
}

type ResultRowProps = {
  label: string;
  value: string;
};

function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}
