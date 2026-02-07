import ExplanationPanel from "@/components/tools/ExplanationPanel";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { ShaftTorsionResult } from "./types";

const formatNumber = (value: number | null, digits = 2) => {
  if (value === null || !Number.isFinite(value)) return "-";
  return value.toFixed(digits);
};

export default function ResultSection({ result }: ToolResultProps<ShaftTorsionResult>) {
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Sonuçlar</h2>
        <p className="text-xs text-slate-500">Burulma gerilmesi, dönme açısı ve güvenlik katsayısı.</p>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Kayma gerilmesi</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.tau)} MPa</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Dönme açısı</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.thetaDeg, 3)} deg</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Güvenlik</p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {result.safety === null ? "-" : formatNumber(result.safety, 2)}
          </p>
        </div>
      </div>

      <ExplanationPanel
        title="Formül ve değişkenler"
        formulas={["tau = 16T / (pi * d^3)", "theta = T * L / (J * G)", "J = pi * d^4 / 32"]}
        variables={[
          { symbol: "T", description: "Tork (N·m)." },
          { symbol: "d", description: "Mil çapı (mm)." },
          { symbol: "L", description: "Mil uzunluğu (mm)." },
          { symbol: "G", description: "Kayma modülü (GPa)." },
        ]}
        notes={["Theta dereceye çevrilmiş değerdir.", "Opsiyonel τ limiti ile güvenlik hesaplanır."]}
      />
    </div>
  );
}
