import type { ToolInputProps } from "@/tools/_shared/types";
import type { HeatInput } from "./types";

export default function InputSection({ input, onChange }: ToolInputProps<HeatInput>) {
  const handleFieldChange = <K extends keyof HeatInput>(key: K, value: HeatInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Hangi isi aktarimini hesaplamak istiyorsun?</h2>
        <p className="text-xs text-slate-500">
          Tek katmanli iletim icin k, A, dT ve L degerlerini gir. Sonucu adim adim goreceksin.
        </p>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Malzemenin isil iletkenligi (k) nedir?
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={input.conductivity}
            onChange={(event) => handleFieldChange("conductivity", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Orn. 45"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Isi gecen alan (A) ne kadar?</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.area}
            onChange={(event) => handleFieldChange("area", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Orn. 0.02"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Iki yuzey arasindaki sicaklik farki (dT) nedir?
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={input.deltaT}
            onChange={(event) => handleFieldChange("deltaT", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Orn. 30"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Malzeme kalinligi (L) kac metre?
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={input.thickness}
            onChange={(event) => handleFieldChange("thickness", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Orn. 0.01"
          />
        </div>
      </div>
    </div>
  );
}
