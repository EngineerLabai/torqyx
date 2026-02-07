import type { ToolVisualizationProps } from "@/tools/_shared/types";
import type { PipePressureLossInput, PipePressureLossResult } from "./types";

export default function VisualizationSection({ result }: ToolVisualizationProps<PipePressureLossInput, PipePressureLossResult>) {
  const regime = result.reynolds
    ? result.reynolds < 2000
      ? "Laminer"
      : result.reynolds < 4000
        ? "Geçiş"
        : "Türbülans"
    : "-";

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">Akış rejimi</h3>
        <p className="text-xs text-slate-500">Re sayısı ile akışın tipi görünür.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Rejim</span>
          <span className="font-mono text-[12px] font-semibold text-slate-900">{regime}</span>
        </div>
      </div>
    </div>
  );
}
