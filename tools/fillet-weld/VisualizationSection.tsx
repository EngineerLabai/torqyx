import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { FilletWeldInput, FilletWeldResult } from "./types";

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

export default function VisualizationSection({ input, result }: ToolVisualizationProps<FilletWeldInput, FilletWeldResult>) {
  const fillet = toNumber(input.fillet);
  const hasFillet = Number.isFinite(fillet) && fillet > 0;

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">Hızlı yorum</h3>
        <p className="text-xs text-slate-500">Mevcut a değeri girildiyse gerilme kontrolü yapılır.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Mevcut a</span>
          <span className="font-mono text-[12px] font-semibold text-slate-900">
            {hasFillet ? `${fillet.toFixed(2)} mm` : "-"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-slate-500">Kontrol sonucu</span>
          <span className="font-semibold text-slate-900">
            {result.isSafe === null ? "-" : result.isSafe ? "Uygun" : "Yetersiz"}
          </span>
        </div>
      </div>
    </div>
  );
}
