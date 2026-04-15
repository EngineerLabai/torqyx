import type { BoltInput, BoltResult, BoltPreset, GradeKey, FrictionKey } from "./types";
import type { CalculationStep, CalculationStepStatus } from "@/tools/_shared/types";

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

export function getYieldStrength(grade: GradeKey): number {
  return GRADE_DATA[grade].Re;
}

export const DEFAULT_INPUT: BoltInput = {
  presetId: "M8",
  d: "8",
  P: "1.25",
  grade: "8.8",
  preloadPercent: "70",
  friction: "dry",
};

function getStepStatusForSafety(safety: number | null): "pass" | "warning" | "fail" | "info" {
  if (safety === null) return "info";
  if (safety >= 1.2) return "pass";
  if (safety >= 1.0) return "warning";
  return "fail";
}

function buildBoltAuditTrail(
  input: BoltInput,
  As: number,
  Fv_N: number,
  T_Nm: number,
  sigma: number,
  safety: number,
  Re: number,
): CalculationStep[] {
  return [
    {
      id: "as",
      name: "Etkin Kesit Alanı As",
      formula: "A_s = \frac{\pi}{4} \times (d - 0.9382 \times P)^2",
      variables: [
        { key: "d", label: "Nominal çap d", value: input.d, unit: "mm" },
        { key: "P", label: "Diş adımı P", value: input.P, unit: "mm" },
      ],
      result: As.toFixed(2),
      unit: "mm²",
      standard: "ISO 898-1",
      status: "pass" as CalculationStepStatus,
    },
    {
      id: "fv",
      name: "Ön Yük Kuvveti F_v",
      formula: "F_v = \frac{\mathrm{preload}}{100} \times R_e \times A_s",
      variables: [
        { key: "preloadPercent", label: "Ön yük %Re", value: input.preloadPercent, unit: "%" },
        { key: "Re", label: "Akma dayanımı R_e", value: Re, unit: "MPa" },
        { key: "A_s", label: "Kesit alanı A_s", value: As.toFixed(2), unit: "mm²" },
      ],
      result: (Fv_N / 1000).toFixed(2),
      unit: "kN",
      standard: "ISO 898-1",
      status: "pass" as CalculationStepStatus,
    },
    {
      id: "sigma",
      name: "Gerilme σ",
      formula: "\sigma = \frac{F_v}{A_s}",
      variables: [
        { key: "Fv", label: "Ön yük F_v", value: (Fv_N / 1000).toFixed(2), unit: "kN" },
        { key: "As", label: "Kesit alanı A_s", value: As.toFixed(2), unit: "mm²" },
      ],
      result: sigma.toFixed(1),
      unit: "MPa",
      standard: "ISO 898-1",
      status: getStepStatusForSafety(safety) as CalculationStepStatus,
    },
    {
      id: "safety",
      name: "Güvenlik Katsayısı S",
      formula: "S = \frac{R_e}{\sigma}",
      variables: [
        { key: "Re", label: "Akma dayanımı R_e", value: Re, unit: "MPa" },
        { key: "sigma", label: "Gerilme σ", value: sigma.toFixed(1), unit: "MPa" },
      ],
      result: safety.toFixed(2),
      unit: "-",
      standard: "VDI 2230",
      status: getStepStatusForSafety(safety) as CalculationStepStatus,
    },
  ];
}

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
      error: "d ve P değerlerini pozitif sayı olarak girin.",
    };
  }

  if (!preload || preload <= 0 || preload > 90) {
    return {
      As: null,
      Fv: null,
      torque: null,
      sigma: null,
      safety: null,
      error: "Ön yük yüzdesi 1-90 aralığında olmalı.",
    };
  }

  const Re = getYieldStrength(input.grade);
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
    auditTrail: () => buildBoltAuditTrail(input, As, Fv_N, T_Nm, sigma, safety, Re),
  };
}
