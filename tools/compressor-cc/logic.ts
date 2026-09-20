export type CompressorActing = "single" | "double";

export type CompressorCcInput = {
  bore: string;
  stroke: string;
  cylinders: string;
  rpm: string;
  volumetricEff: string;
  acting: CompressorActing;
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

export const MAX_VOLUMETRIC_EFFICIENCY_PERCENT = 120;

const DECIMAL_NUMBER = /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?$/;

/**
 * Parses a strict finite decimal value and accepts either a decimal point or
 * decimal comma. Thousands separators and partially numeric strings are
 * intentionally rejected.
 */
export const parseCompressorNumber = (value: string): number | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || !DECIMAL_NUMBER.test(trimmed)) return null;

  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

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

  const bore = parseCompressorNumber(input.bore);
  const stroke = parseCompressorNumber(input.stroke);
  const cylinders = parseCompressorNumber(input.cylinders);
  const rpm = parseCompressorNumber(input.rpm);
  const volumetricEfficiency = parseCompressorNumber(input.volumetricEff);

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
