import type { ToolInputProps } from "@/tools/_shared/types";
import type { HydraulicCylinderInput } from "./types";

export default function InputSection({ input, onChange, errors }: ToolInputProps<HydraulicCylinderInput>) {
  const handleChange = <K extends keyof HydraulicCylinderInput>(key: K, value: HydraulicCylinderInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Hidrolik silindir hesapları</h2>
        <p className="text-xs text-slate-500">Basınç, çap ve debi ile kuvvet ve hızları hesapla.</p>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Basınç (bar)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.pressure}
            onChange={(event) => handleChange("pressure", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.pressure ? <p className="text-[10px] text-red-600">{errors.pressure}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Silindir çapı (mm)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.bore}
            onChange={(event) => handleChange("bore", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.bore ? <p className="text-[10px] text-red-600">{errors.bore}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Mil çapı (mm)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.rod}
            onChange={(event) => handleChange("rod", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.rod ? <p className="text-[10px] text-red-600">{errors.rod}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Debi (L/dk)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.flow}
            onChange={(event) => handleChange("flow", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.flow ? <p className="text-[10px] text-red-600">{errors.flow}</p> : null}
        </div>
      </div>
    </div>
  );
}
