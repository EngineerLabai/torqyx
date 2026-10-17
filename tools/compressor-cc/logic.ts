export type CompressorActing = "single" | "double";

export type CompressorCcInput = {
  bore: string;
  stroke: string;
  cylinders: string;
  rpm: string;
  volumetricEff: string;
  acting: CompressorActing;
  locale?: "tr" | "en";
};

export type CompressorCcErrorCode =
  | "invalid-number"
  | "non-positive"
  | "invalid-cylinder-count"
  | "invalid-efficiency"
  | "invalid-acting"
  | "result-out-of-range";

export type CompressorCcResult = {
  geometricDisplacementCcPerRev: number;
  geometricDisplacementLPerRev: number;
  geometricFlowLMin: number;
  efficiencyAdjustedFlowLMin: number;
  actingFactor: 1 | 2;
  model: "ideal-geometric-displacement";
  isFad: false;
  rodAreaDeducted: false;
};

export type CompressorCcCalculation =
  | { ok: true; result: CompressorCcResult }
  | { ok: false; error: CompressorCcErrorCode };

import { parseEngineeringNumber } from "@/utils/number-parser";

export const MAX_VOLUMETRIC_EFFICIENCY_PERCENT = 120;

/**
 * Parses a strict finite decimal value and accepts either a decimal point or
 * decimal comma. Thousands separators and partially numeric strings are
 * intentionally rejected.
 */
export const parseCompressorNumber = (value: string, locale?: "tr" | "en"): number | null =>
  parseEngineeringNumber(value, { locale });

/**
 * Ideal geometric piston displacement model.
 *
 * This is not a Free Air Delivery (FAD) calculation. The double-acting mode
 * treats both piston faces as full-bore area; piston-rod area, clearance
 * volume, valve losses, leakage, pressure ratio, temperature/humidity and FAD
 * reference conditions are not modeled. Volumetric efficiency is applied as
 * a user-supplied estimate to the geometric flow.
 */
export const calculateCompressorCc = (input: CompressorCcInput): CompressorCcCalculation => {
  if (input.acting !== "single" && input.acting !== "double") {
    return { ok: false, error: "invalid-acting" };
  }

  const bore = parseCompressorNumber(input.bore, input.locale);
  const stroke = parseCompressorNumber(input.stroke, input.locale);
  const cylinders = parseCompressorNumber(input.cylinders, input.locale);
  const rpm = parseCompressorNumber(input.rpm, input.locale);
  const volumetricEfficiency = parseCompressorNumber(input.volumetricEff, input.locale);

  if (
    bore === null ||
    stroke === null ||
    cylinders === null ||
    rpm === null ||
    volumetricEfficiency === null
  ) {
    return { ok: false, error: "invalid-number" };
  }

  if (bore <= 0 || stroke <= 0 || rpm <= 0) {
    return { ok: false, error: "non-positive" };
  }

  if (!Number.isSafeInteger(cylinders) || cylinders <= 0) {
    return { ok: false, error: "invalid-cylinder-count" };
  }

  if (
    volumetricEfficiency <= 0 ||
    volumetricEfficiency > MAX_VOLUMETRIC_EFFICIENCY_PERCENT
  ) {
    return { ok: false, error: "invalid-efficiency" };
  }

  const actingFactor: 1 | 2 = input.acting === "double" ? 2 : 1;
  const geometricDisplacementMm3PerRev =
    (Math.PI / 4) * bore * bore * stroke * cylinders * actingFactor;
  const geometricDisplacementCcPerRev = geometricDisplacementMm3PerRev / 1_000;
  const geometricDisplacementLPerRev = geometricDisplacementCcPerRev / 1_000;
  const geometricFlowLMin = geometricDisplacementLPerRev * rpm;
  const efficiencyAdjustedFlowLMin = geometricFlowLMin * (volumetricEfficiency / 100);

  const outputs = [
    geometricDisplacementCcPerRev,
    geometricDisplacementLPerRev,
    geometricFlowLMin,
    efficiencyAdjustedFlowLMin,
  ];

  if (outputs.some((value) => !Number.isFinite(value) || value <= 0)) {
    return { ok: false, error: "result-out-of-range" };
  }

  return {
    ok: true,
    result: {
      geometricDisplacementCcPerRev,
      geometricDisplacementLPerRev,
      geometricFlowLMin,
      efficiencyAdjustedFlowLMin,
      actingFactor,
      model: "ideal-geometric-displacement",
      isFad: false,
      rodAreaDeducted: false,
    },
  };
};
