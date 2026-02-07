import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { HydraulicCylinderInput, HydraulicCylinderResult } from "./types";

export default function VisualizationSection({ result }: ToolVisualizationProps<HydraulicCylinderInput, HydraulicCylinderResult>) {
  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">Alan özeti</h3>
        <p className="text-xs text-slate-500">Silindir ve annulus alanları kuvvetleri belirler.</p>
      </div>
      <div className="grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] text-slate-500">Bore alanı (m2)</p>
          <p className="mt-1 font-mono text-[12px] font-semibold text-slate-900">
            {result.areaBore ? result.areaBore.toExponential(3) : "-"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] text-slate-500">Annulus alanı (m2)</p>
          <p className="mt-1 font-mono text-[12px] font-semibold text-slate-900">
            {result.areaAnnulus ? result.areaAnnulus.toExponential(3) : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
