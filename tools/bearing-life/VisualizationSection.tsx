import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { BearingLifeInput, BearingLifeResult } from "./types";

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

export default function VisualizationSection({ input }: ToolVisualizationProps<BearingLifeInput, BearingLifeResult>) {
  const C = toNumber(input.C);
  const P = toNumber(input.P);
  const ratio = Number.isFinite(C) && Number.isFinite(P) && P > 0 ? C / P : null;

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">Hızlı yorum</h3>
        <p className="text-xs text-slate-500">C/P oranı yüksekse ömür hızla artar.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">C/P oranı</span>
          <span className="font-mono text-[12px] font-semibold text-slate-900">
            {ratio ? ratio.toFixed(2) : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
