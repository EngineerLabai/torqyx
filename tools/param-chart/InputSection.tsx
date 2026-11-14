"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolInputProps } from "@/tools/_shared/types";
import type { ChartInput } from "./types";

const COPY = {
  tr: {
    title: "Hangi senaryoyu görselleştirmek istiyorsun?",
    description: "Yay sabiti ve maksimum yer değiştirmeyi gir. Grafik otomatik oluşur.",
    stiffnessLabel: "Yay sabiti (k) nedir? (N/m)",
    displacementLabel: "Maksimum yer değiştirme kaç mm?",
    stepsLabel: "Kaç adımda örnekleyelim?",
    stiffnessPlaceholder: "Örn. 500",
    displacementPlaceholder: "Örn. 20",
    stepsPlaceholder: "Örn. 6",
  },
  en: {
    title: "Force–Displacement Scenario",
    description: "Enter spring stiffness and maximum displacement. The curve is generated automatically.",
    stiffnessLabel: "Spring stiffness k (N/m)",
    displacementLabel: "Maximum displacement (mm)",
    stepsLabel: "Evaluation steps (points)",
    stiffnessPlaceholder: "e.g. 500",
    displacementPlaceholder: "e.g. 20",
    stepsPlaceholder: "e.g. 6",
  },
};

export default function InputSection({ input, onChange }: ToolInputProps<ChartInput>) {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const handleFieldChange = <K extends keyof ChartInput>(key: K, value: ChartInput[K]) => {
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.stiffnessLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.stiffness}
            onChange={(event) => handleFieldChange("stiffness", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.stiffnessPlaceholder}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.displacementLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.maxDisplacement}
            onChange={(event) => handleFieldChange("maxDisplacement", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.displacementPlaceholder}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.stepsLabel}</label>
          <input
            type="number"
            inputMode="numeric"
            min={2}
            max={20}
            value={input.steps}
            onChange={(event) => handleFieldChange("steps", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.stepsPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
