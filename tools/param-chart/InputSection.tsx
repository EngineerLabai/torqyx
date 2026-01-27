import type { ToolInputProps } from "@/tools/_shared/types";
import type { ChartInput } from "./types";

export default function InputSection({ input, onChange }: ToolInputProps<ChartInput>) {
  const handleFieldChange = <K extends keyof ChartInput>(key: K, value: ChartInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Hangi senaryoyu gorsellestirmek istiyorsun?</h2>
        <p className="text-xs text-slate-500">
          Yay sabiti ve maksimum yer degistirmeyi gir. Grafik otomatik olusur.
        </p>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Yay sabiti (k) nedir?</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.stiffness}
            onChange={(event) => handleFieldChange("stiffness", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Orn. 500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Maksimum yer degistirme kac mm?
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={input.maxDisplacement}
            onChange={(event) => handleFieldChange("maxDisplacement", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Orn. 20"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Kac adimda ornekleyelim?</label>
          <input
            type="number"
            inputMode="numeric"
            min={2}
            max={20}
            value={input.steps}
            onChange={(event) => handleFieldChange("steps", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Orn. 6"
          />
        </div>
      </div>
    </div>
  );
}
