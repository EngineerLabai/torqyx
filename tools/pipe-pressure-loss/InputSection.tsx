"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolInputProps } from "@/tools/_shared/types";
import type { PipePressureLossInput } from "./types";

const COPY = {
  tr: {
    title: "Darcy–Weisbach hesaplaması",
    description: "Akışkan özellikleri, debi ve boru verilerini girerek basınç kaybını gör.",
    rhoLabel: "Yoğunluk ρ (kg/m³)",
    muLabel: "Viskozite μ (Pa·s)",
    flowLabel: "Debi Q (m³/s)",
    diameterLabel: "İç çap D (mm)",
    lengthLabel: "Hat uzunluğu L (m)",
    roughnessLabel: "Pürüzlülük ε (mm)",
  },
  en: {
    title: "Darcy–Weisbach Calculation",
    description: "Enter fluid properties, flow rate, and pipe geometry to calculate frictional pressure drop.",
    rhoLabel: "Density ρ (kg/m³)",
    muLabel: "Viscosity μ (Pa·s)",
    flowLabel: "Flow rate Q (m³/s)",
    diameterLabel: "Inner diameter D (mm)",
    lengthLabel: "Pipe length L (m)",
    roughnessLabel: "Roughness ε (mm)",
  },
};

export default function InputSection({ input, onChange, errors }: ToolInputProps<PipePressureLossInput>) {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const handleChange = <K extends keyof PipePressureLossInput>(key: K, value: PipePressureLossInput[K]) => {
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.rhoLabel}</label>
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.muLabel}</label>
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.flowLabel}</label>
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.diameterLabel}</label>
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.roughnessLabel}</label>
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
