import type { ToolInputProps } from "@/tools/_shared/types";
import type { UnitCategory, UnitInput } from "./types";
import { CATEGORY_MAP } from "./logic";

const CATEGORY_OPTIONS: { value: UnitCategory; label: string }[] = [
  { value: "length", label: "Uzunluk" },
  { value: "force", label: "Kuvvet" },
  { value: "pressure", label: "Basinc" },
  { value: "energy", label: "Enerji" },
];

export default function InputSection({ input, onChange }: ToolInputProps<UnitInput>) {
  const units = CATEGORY_MAP[input.category].units;

  const handleCategoryChange = (category: UnitCategory) => {
    const categoryUnits = CATEGORY_MAP[category].units;
    const fromUnit = categoryUnits[0]?.id ?? "";
    const toUnit = categoryUnits[1]?.id ?? fromUnit;

    onChange({
      ...input,
      category,
      fromUnit,
      toUnit,
    });
  };

  const handleFieldChange = <K extends keyof UnitInput>(key: K, value: UnitInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  const swapUnits = () => {
    onChange({
      ...input,
      fromUnit: input.toUnit,
      toUnit: input.fromUnit,
    });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Hangi donusumu yapmak istiyorsun?</h2>
        <p className="text-xs text-slate-500">
          Once kategoriyi sec, sonra kaynak ve hedef birimi belirle. Degeri girdiginde
          sonuc otomatik guncellenir.
        </p>
      </div>

      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Hangi kategori uzerinde calisiyorsun?</label>
          <select
            value={input.category}
            onChange={(event) => handleCategoryChange(event.target.value as UnitCategory)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Hangi birimden basliyorsun?</label>
            <select
              value={input.fromUnit}
              onChange={(event) => handleFieldChange("fromUnit", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={swapUnits}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 hover:border-slate-400"
          >
            Degistir
          </button>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Hangi birime donusecek?</label>
            <select
              value={input.toUnit}
              onChange={(event) => handleFieldChange("toUnit", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Kac birim?</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.value}
            onChange={(event) => handleFieldChange("value", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder="Orn. 100"
          />
        </div>
      </div>
    </div>
  );
}
