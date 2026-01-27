import type { BoltInput, BoltResult, BoltPreset, GradeKey, FrictionKey } from "./types";

export const BOLT_PRESETS: BoltPreset[] = [
  { id: "M3", label: "M3 x 0.50", d: 3, P: 0.5 },
  { id: "M4", label: "M4 x 0.70", d: 4, P: 0.7 },
  { id: "M5", label: "M5 x 0.80", d: 5, P: 0.8 },
  { id: "M6", label: "M6 x 1.00", d: 6, P: 1.0 },
  { id: "M8", label: "M8 x 1.25", d: 8, P: 1.25 },
  { id: "M10", label: "M10 x 1.50", d: 10, P: 1.5 },
];

const GRADE_DATA: Record<GradeKey, { Re: number }> = {
  "8.8": { Re: 640 },
  "10.9": { Re: 940 },
  "12.9": { Re: 1100 },
};

const FRICTION_K: Record<FrictionKey, { K: number }> = {
  dry: { K: 0.25 },
  oiled: { K: 0.2 },
  coated: { K: 0.18 },
};

export const DEFAULT_INPUT: BoltInput = {
  presetId: "M8",
  d: "8",
  P: "1.25",
  grade: "8.8",
  preloadPercent: "70",
  friction: "dry",
};

export function calculateBolt(input: BoltInput): BoltResult {
  const d = Number(input.d);
  const P = Number(input.P);
  const preload = Number(input.preloadPercent);

  if (!d || d <= 0 || !P || P <= 0) {
    return {
      As: null,
      Fv: null,
      torque: null,
      sigma: null,
      safety: null,
      error: "d ve P degerlerini pozitif sayi olarak girin.",
    };
  }

  if (!preload || preload <= 0 || preload > 90) {
    return {
      As: null,
      Fv: null,
      torque: null,
      sigma: null,
      safety: null,
      error: "On yuk yuzdesi 1-90 araliginda olmali.",
    };
  }

  const Re = GRADE_DATA[input.grade].Re;
  const K = FRICTION_K[input.friction].K;

  const As = (Math.PI / 4) * Math.pow(d - 0.9382 * P, 2);
  const preloadRatio = preload / 100;
  const Fv_N = preloadRatio * Re * As;
  const T_Nm = K * Fv_N * (d / 1000);
  const sigma = Fv_N / As;
  const safety = Re / sigma;

  return {
    As,
    Fv: Fv_N / 1000,
    torque: T_Nm,
    sigma,
    safety,
  };
}
