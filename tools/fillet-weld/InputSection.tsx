"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolInputProps } from "@/tools/_shared/types";
import type { FilletWeldInput } from "./types";

const COPY = {
  tr: {
    title: "Köşe kaynak boyutlandırma",
    description: "Toplam yük, kaynak boyu ve izin verilen gerilme ile gereken a boyutunu bul.",
    loadLabel: "Yük (N)",
    lengthLabel: "Kaynak boyu (mm)",
    allowableLabel: "İzin verilen gerilme (MPa)",
    filletLabel: "Mevcut a boyutu (mm)",
    filletPlaceholder: "0 = gereken hesabı",
  },
  en: {
    title: "Fillet Weld Sizing",
    description: "Calculate required leg size (a) based on applied load, weld length, and allowable stress.",
    loadLabel: "Load (N)",
    lengthLabel: "Weld length (mm)",
    allowableLabel: "Allowable stress (MPa)",
    filletLabel: "Existing leg size a (mm)",
    filletPlaceholder: "0 = calculate required size",
  },
};

export default function InputSection({ input, onChange, errors }: ToolInputProps<FilletWeldInput>) {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const handleChange = <K extends keyof FilletWeldInput>(key: K, value: FilletWeldInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.loadLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.load}
            onChange={(event) => handleChange("load", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.load ? <p className="text-[10px] text-red-600">{errors.load}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.lengthLabel}</label>
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.allowableLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.allowable}
            onChange={(event) => handleChange("allowable", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.allowable ? <p className="text-[10px] text-red-600">{errors.allowable}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.filletLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.fillet}
            onChange={(event) => handleChange("fillet", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.filletPlaceholder}
          />
          {errors?.fillet ? <p className="text-[10px] text-red-600">{errors.fillet}</p> : null}
        </div>
      </div>
    </div>
  );
}
