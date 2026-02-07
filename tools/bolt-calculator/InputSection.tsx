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
  { value: "oiled", label: "Hafif yağlı" },
  { value: "coated", label: "Kaplamalı" },
];

export default function InputSection({ input, onChange, errors }: ToolInputProps<BoltInput>) {
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
        <h2 className="text-sm font-semibold text-slate-900">Giriş Parametreleri</h2>
        <p className="text-xs text-slate-500">
          Boyut, malzeme sınıfı ve sürtünme varsayımına göre temel civata değerlerini hesapla.
          Değerleri güncelledikçe sonuç otomatik hesaplanır.
        </p>
      </div>

      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Standart civata seç (opsiyonel)
          </label>
          <select
            value={input.presetId}
            onChange={(event) => handlePresetChange(event.target.value as BoltPresetId)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          >
            <option value="custom">Manuel giriş</option>
            <optgroup label="Metrik (ISO)">
              {BOLT_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </optgroup>
          </select>
          <p className="text-[11px] text-slate-500">
            Preset seçersen d ve P alanları otomatik dolar; istersen elle güncelleyebilirsin.
          </p>
          {errors?.presetId ? <p className="text-[10px] text-red-600">{errors.presetId}</p> : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Nominal çap d [mm]</label>
            <input
              type="number"
              inputMode="decimal"
              value={input.d}
              onChange={(event) => handleFieldChange("d", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              placeholder="Örn. 8"
              step="0.1"
              min="0"
            />
            {errors?.d ? <p className="text-[10px] text-red-600">{errors.d}</p> : null}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Diş adımı P [mm]</label>
            <input
              type="number"
              inputMode="decimal"
              value={input.P}
              onChange={(event) => handleFieldChange("P", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              placeholder="Örn. 1.25"
              step="0.01"
              min="0"
            />
            {errors?.P ? <p className="text-[10px] text-red-600">{errors.P}</p> : null}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Kalite sınıfı</label>
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
            {errors?.grade ? <p className="text-[10px] text-red-600">{errors.grade}</p> : null}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">Sürtünme durumu</label>
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
            {errors?.friction ? <p className="text-[10px] text-red-600">{errors.friction}</p> : null}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">Ön yük seviyesi [%Re]</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.preloadPercent}
            onChange={(event) => handleFieldChange("preloadPercent", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            min={1}
            max={90}
          />
          {errors?.preloadPercent ? <p className="text-[10px] text-red-600">{errors.preloadPercent}</p> : null}
        </div>
      </div>
    </div>
  );
}
