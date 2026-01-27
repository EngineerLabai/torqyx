"use client";

import type { ToolInputProps } from "@/tools/_shared/types";
import type { BoltInput, BoltPresetId, GradeKey, FrictionKey } from "./types";
import { BOLT_PRESETS } from "./logic";

const GRADE_OPTIONS: { value: GradeKey; label: string }[] = [
  { value: "8.8", label: "8.8" },
  { value: "10.9", label: "10.9" },
  { value: "12.9", label: "12.9" },
];

const FRICTION_OPTIONS: { value: FrictionKey; label: string }[] = [
  { value: "dry", label: "Kuru" },
  { value: "oiled", label: "Hafif yagli" },
  { value: "coated", label: "Kaplamali" },
];

export default function InputSection({ input, onChange }: ToolInputProps<BoltInput>) {
  const handleFieldChange = <K extends keyof BoltInput>(key: K, value: BoltInput[K]) => {
    const next: BoltInput = { ...input, [key]: value };

    if (key === "d" || key === "P") {
      next.presetId = "custom";
    }

    onChange(next);
  };

  const handlePresetChange = (value: BoltPresetId) => {
    if (value === "custom") {
      onChange({ ...input, presetId: "custom" });
      return;
    }

    const preset = BOLT_PRESETS.find((item) => item.id === value);
    if (!preset) return;

    onChange({
      ...input,
      presetId: preset.id,
      d: preset.d.toString(),
      P: preset.P.toString(),
    });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Giris Parametreleri</h2>
        <p className="text-xs text-slate-500">
          Boyut, malzeme sinifi ve surtunme varsayimina gore temel civata degerlerini hesapla.
          Degerleri guncelledikce sonuc otomatik hesaplanir.
        </p>
      </div>

      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Standart civata sec (opsiyonel)
          </label>
          <select
            value={input.presetId}
            onChange={(event) => handlePresetChange(event.target.value as BoltPresetId)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          >
            <option value="custom">Manuel giris</option>
            <optgroup label="Metrik (ISO)">
              {BOLT_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </optgroup>
          </select>
          <p className="text-[11px] text-slate-500">
            Preset secersen d ve P alanlari otomatik dolar; istersen elle guncelleyebilirsin.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Nominal cap d [mm]</label>
            <input
              type="number"
              inputMode="decimal"
              value={input.d}
              onChange={(event) => handleFieldChange("d", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              placeholder="Orn. 8"
              step="0.1"
              min="0"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Dis adimi P [mm]</label>
            <input
              type="number"
              inputMode="decimal"
              value={input.P}
              onChange={(event) => handleFieldChange("P", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              placeholder="Orn. 1.25"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Kalite sinifi</label>
            <select
              value={input.grade}
              onChange={(event) => handleFieldChange("grade", event.target.value as GradeKey)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              {GRADE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Surtunme durumu</label>
            <select
              value={input.friction}
              onChange={(event) => handleFieldChange("friction", event.target.value as FrictionKey)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              {FRICTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">On yuk seviyesi [%Re]</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.preloadPercent}
            onChange={(event) => handleFieldChange("preloadPercent", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            min={1}
            max={90}
          />
        </div>
      </div>
    </div>
  );
}
