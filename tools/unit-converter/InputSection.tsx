"use client";

import type { ToolInputProps } from "@/tools/_shared/types";
import type { UnitCategory, UnitInput } from "./types";
import { CATEGORY_MAP } from "./logic";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

export default function InputSection({ input, onChange }: ToolInputProps<UnitInput>) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.unitConverter;
  const units = CATEGORY_MAP[input.category].units;

  const categoryOptions = (Object.entries(copy.input.categories) as [UnitCategory, string][]).map(([value, label]) => ({
    value,
    label,
  }));

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
        <h2 className="text-sm font-semibold text-slate-900">{copy.input.title}</h2>
        <p className="text-xs text-slate-500">{copy.input.description}</p>
      </div>

      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.input.categoryLabel}</label>
          <select
            value={input.category}
            onChange={(event) => handleCategoryChange(event.target.value as UnitCategory)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">{copy.input.fromLabel}</label>
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
            {copy.input.swapLabel}
          </button>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">{copy.input.toLabel}</label>
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.input.valueLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.value}
            onChange={(event) => handleFieldChange("value", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.input.valuePlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
