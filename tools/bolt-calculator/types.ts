export type GradeKey = "8.8" | "10.9" | "12.9";
export type FrictionKey = "dry" | "oiled" | "coated";

export type BoltInput = {
  presetId: BoltPresetId;
  d: string;
  P: string;
  grade: GradeKey;
  preloadPercent: string;
  friction: FrictionKey;
};

import type { CalculationStep } from "@/tools/_shared/types";

export type BoltResult = {
  As: number | null;
  Fv: number | null;
  torque: number | null;
  sigma: number | null;
  safety: number | null;
  error?: string;
  auditTrail?: CalculationStep[] | (() => CalculationStep[] | null);
};

export type BoltPresetId = "custom" | "M3" | "M4" | "M5" | "M6" | "M8" | "M10";

export type BoltPreset = {
  id: BoltPresetId;
  label: string;
  d: number;
  P: number;
};
