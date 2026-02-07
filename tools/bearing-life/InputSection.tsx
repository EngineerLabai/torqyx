import type { ToolInputProps } from "@/tools/_shared/types";
import type { BearingLifeInput } from "./types";

export default function InputSection({ input, onChange, errors }: ToolInputProps<BearingLifeInput>) {
  const handleChange = <K extends keyof BearingLifeInput>(key: K, value: BearingLifeInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Rulman ömrü için temel girdileri gir</h2>
        <p className="text-xs text-slate-500">
          Dinamik yük, eşdeğer yük ve devir bilgisini girerek L10 ve L10h ömrüne ulaşabilirsin.
        </p>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Dinamik yük C (kN)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.C}
            onChange={(event) => handleChange("C", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Örn. 25"
          />
          {errors?.C ? <p className="text-[10px] text-red-600">{errors.C}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Eşdeğer yük P (kN)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.P}
            onChange={(event) => handleChange("P", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Örn. 10"
          />
          {errors?.P ? <p className="text-[10px] text-red-600">{errors.P}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Rulman tipi</label>
          <select
            value={input.bearingType}
            onChange={(event) => handleChange("bearingType", event.target.value as BearingLifeInput["bearingType"])}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          >
            <option value="ball">Bilyalı</option>
            <option value="roller">Makaralı</option>
          </select>
          {errors?.bearingType ? <p className="text-[10px] text-red-600">{errors.bearingType}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Devir (rpm)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.rpm}
            onChange={(event) => handleChange("rpm", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Örn. 1500"
          />
          {errors?.rpm ? <p className="text-[10px] text-red-600">{errors.rpm}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Güvenilirlik faktörü a1 (opsiyonel)</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.a1}
            onChange={(event) => handleChange("a1", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Örn. 1"
          />
          {errors?.a1 ? <p className="text-[10px] text-red-600">{errors.a1}</p> : null}
        </div>
      </div>
    </div>
  );
}
