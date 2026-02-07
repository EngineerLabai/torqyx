import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { ShaftTorsionInput, ShaftTorsionResult } from "./types";

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

export default function VisualizationSection({ input }: ToolVisualizationProps<ShaftTorsionInput, ShaftTorsionResult>) {
  const diameter = toNumber(input.diameter);
  const polarMoment = Number.isFinite(diameter) && diameter > 0
    ? (Math.PI * Math.pow(diameter, 4)) / 32
    : null;

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">Mil rijitliği özeti</h3>
        <p className="text-xs text-slate-500">J kutupsal atalet momenti, burulma rijitliğini belirler.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">J (mm4)</span>
          <span className="font-mono text-[12px] font-semibold text-slate-900">
            {polarMoment ? polarMoment.toFixed(0) : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
