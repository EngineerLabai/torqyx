import type { ToolInputProps } from "@/tools/_shared/types";
import type { PipePressureLossInput } from "./types";

export default function InputSection({ input, onChange, errors }: ToolInputProps<PipePressureLossInput>) {
  const handleChange = <K extends keyof PipePressureLossInput>(key: K, value: PipePressureLossInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Darcy–Weisbach hesaplaması</h2>
        <p className="text-xs text-slate-500">
          Akışkan özellikleri, debi ve boru verilerini girerek basınç kaybını gör.
        </p>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Yoğunluk ρ (kg/m3)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.rho}
            onChange={(event) => handleChange("rho", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.rho ? <p className="text-[10px] text-red-600">{errors.rho}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Viskozite mu (Pa·s)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.mu}
            onChange={(event) => handleChange("mu", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.mu ? <p className="text-[10px] text-red-600">{errors.mu}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Debi Q (m3/s)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.flow}
            onChange={(event) => handleChange("flow", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.flow ? <p className="text-[10px] text-red-600">{errors.flow}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">İç çap D (mm)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.diameter}
            onChange={(event) => handleChange("diameter", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.diameter ? <p className="text-[10px] text-red-600">{errors.diameter}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Hat uzunluğu L (m)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.length}
            onChange={(event) => handleChange("length", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.length ? <p className="text-[10px] text-red-600">{errors.length}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Pürüzlülük ε (mm)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.roughness}
            onChange={(event) => handleChange("roughness", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.roughness ? <p className="text-[10px] text-red-600">{errors.roughness}</p> : null}
        </div>
      </div>
    </div>
  );
}
