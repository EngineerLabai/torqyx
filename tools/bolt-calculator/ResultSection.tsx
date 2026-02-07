import ExplanationPanel from "@/components/tools/ExplanationPanel";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { BoltResult } from "./types";

const formatValue = (value: number | null, decimals: number, unit?: string) => {
  if (value === null || Number.isNaN(value)) {
    return "-";
  }

  const formatted = value.toFixed(decimals);
  return unit ? `${formatted} ${unit}` : formatted;
};

export default function ResultSection({ result }: ToolResultProps<BoltResult>) {
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Hesap Sonuclari</h2>
        <p className="text-xs text-slate-500">
          Sonuclar yaklasik formullerle hesaplanir. Kritik uygulamalarda standard tablolarla
          kontrol edilmelidir.
        </p>
      </div>

      {result.error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      )}

      <div className="space-y-2 text-xs">
        <ResultRow label="Gerilme alanı As" value={formatValue(result.As, 1, "mm^2")} />
        <ResultRow label="Ön yük Fv" value={formatValue(result.Fv, 2, "kN")} />
        <ResultRow label="Önerilen tork T" value={formatValue(result.torque, 1, "Nm")} />
        <ResultRow label="Çekme gerilmesi sigma" value={formatValue(result.sigma, 0, "MPa")} />
        <ResultRow label="Güvenlik katsayısı S" value={formatValue(result.safety, 2)} />
      </div>

      <p className="text-[11px] text-slate-500">
        Metrik dişler için gerilme alanı yaklaşık olarak hesaplanır. ISO 898-1 gibi
        standartlar ve OEM tablolar ile dogrulama onerilir.
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
          { symbol: "K", description: "Sürtünme katsayısı (tork faktörü)." },
          { symbol: "T", description: "Tork (Nm). d metreye çevrilerek kullanılır." },
          { symbol: "sigma", description: "Çekme gerilmesi (MPa)." },
          { symbol: "S", description: "Güvenlik katsayısı." },
        ]}
        notes={[
          "Metrik dişler için yaklaşık gerilme alanı formülü kullanılır.",
          "Sürtünme katsayısı, yağlama ve kaplamaya göre değişir.",
          "Kritik uygulamalarda standart tabloları referans alın.",
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
