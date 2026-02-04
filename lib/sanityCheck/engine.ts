import { create, all, type MathJsStatic } from "mathjs";
import {
  LabSessionSchema,
  type LabSession,
  type VariableEntry,
  type EvaluateResult,
  type EngineWarning,
  type SweepResult,
  type MonteCarloResult,
  type MonteCarloStats,
  type HistogramBin,
} from "@/lib/sanityCheck/types";

const math = create(all, {}) as MathJsStatic;

const normalizeFormula = (formula: string) => {
  const trimmed = formula.trim();
  if (!trimmed) return "";
  const parts = trimmed.split("=");
  return parts[parts.length - 1].trim();
};

const parseNumber = (value: number) => (Number.isFinite(value) ? value : 0);

const buildScope = (variables: VariableEntry[], overrides?: Record<string, number>) => {
  const scope: Record<string, unknown> = {};
  variables.forEach((variable) => {
    const nextValue = overrides && variable.symbol in overrides ? overrides[variable.symbol] : variable.value;
    const numeric = parseNumber(nextValue);
    const unit = variable.unit?.trim();
    if (unit) {
      scope[variable.symbol] = math.unit(numeric, unit);
    } else {
      scope[variable.symbol] = numeric;
    }
  });
  return scope;
};

const extractUnit = (result: unknown) => {
  if (math.typeOf(result) === "Unit") {
    const unitResult = result as unknown as { formatUnits: () => string; toNumber: () => number };
    return {
      value: unitResult.toNumber(),
      unit: unitResult.formatUnits(),
      isUnit: true,
    };
  }

  if (typeof result === "number") {
    return { value: result, unit: "", isUnit: false };
  }

  try {
    const numeric = math.number(result as never);
    return { value: Number.isFinite(numeric) ? numeric : null, unit: "", isUnit: false };
  } catch {
    return { value: null, unit: "", isUnit: false };
  }
};

const buildUnitMismatchWarning = (expectedUnit: string, actualUnit: string): EngineWarning => ({
  type: "unit-mismatch",
  expected: expectedUnit,
  actual: actualUnit || "dimensionless",
});

export const evaluateFormula = (session: LabSession): EvaluateResult => {
  const parsed = LabSessionSchema.safeParse(session);
  if (!parsed.success) {
    return {
      value: null,
      unit: "",
      warnings: [{ type: "invalid-formula", message: "Invalid session data." }],
      error: "Invalid session data.",
    };
  }

  const formula = normalizeFormula(parsed.data.formula);
  if (!formula) {
    return { value: null, unit: "", warnings: [], error: "Formula is empty." };
  }

  const warnings: EngineWarning[] = [];
  const scope = buildScope(parsed.data.variables);

  try {
    const compiled = math.compile(formula);
    const result = compiled.evaluate(scope);
    const { value, unit, isUnit } = extractUnit(result);

    if (parsed.data.expectedUnit?.trim()) {
      const expected = parsed.data.expectedUnit.trim();
      if (!isUnit) {
        warnings.push(buildUnitMismatchWarning(expected, unit));
      } else {
        try {
          const expectedUnit = math.unit(1, expected);
          const resultUnit = result as unknown as { equalBase: (other: unknown) => boolean };
          if (!resultUnit.equalBase(expectedUnit)) {
            warnings.push(buildUnitMismatchWarning(expected, unit));
          }
        } catch {
          warnings.push({ type: "invalid-formula", message: "Invalid expected unit." });
        }
      }
    }

    return {
      value: value === null ? null : Number(value),
      unit,
      warnings,
    };
  } catch (error) {
    return {
      value: null,
      unit: "",
      warnings: [{ type: "invalid-formula", message: "Formula parse failed." }],
      error: error instanceof Error ? error.message : "Formula parse failed.",
    };
  }
};

export const runSweep = (session: LabSession, variableId?: string): SweepResult => {
  const parsed = LabSessionSchema.safeParse(session);
  if (!parsed.success) {
    return { points: [], xUnit: "", yUnit: "", warnings: [], error: "Invalid session data." };
  }

  const formula = normalizeFormula(parsed.data.formula);
  if (!formula) {
    return { points: [], xUnit: "", yUnit: "", warnings: [], error: "Formula is empty." };
  }

  const target = parsed.data.variables.find((variable) => variable.id === (variableId ?? parsed.data.sweep.variableId));
  if (!target) {
    return { points: [], xUnit: "", yUnit: "", warnings: [], error: "Missing sweep variable." };
  }

  const min = target.min ?? target.value;
  const max = target.max ?? target.value;
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { points: [], xUnit: target.unit ?? "", yUnit: "", warnings: [], error: "Sweep range is invalid." };
  }

  const steps = parsed.data.sweep.points ?? 50;
  const compiled = math.compile(formula);
  const points: { x: number; y: number }[] = [];
  let yUnit = "";

  for (let i = 0; i < steps; i += 1) {
    const ratio = steps === 1 ? 0 : i / (steps - 1);
    const value = min + (max - min) * ratio;
    const scope = buildScope(parsed.data.variables, { [target.symbol]: value });
    try {
      const result = compiled.evaluate(scope);
      const extracted = extractUnit(result);
      if (!yUnit) yUnit = extracted.unit;
      if (extracted.value !== null) {
        points.push({ x: value, y: Number(extracted.value) });
      }
    } catch {
      // skip invalid points
    }
  }

  return {
    points,
    xUnit: target.unit ?? "",
    yUnit,
    warnings: [],
  };
};

const clampNormal = (value: number) => (Number.isFinite(value) ? value : 0);

const sampleNormal = (mean: number, sigma: number) => {
  if (!sigma) return mean;
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + sigma * z;
};

const sampleVariable = (variable: VariableEntry) => {
  const min = variable.min ?? variable.value;
  const max = variable.max ?? variable.value;
  const distribution = variable.distribution ?? "uniform";

  if (distribution === "normal") {
    const sigma = (max - min) / 6 || 0;
    return sampleNormal(variable.value, sigma);
  }

  if (min === max) return min;
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return low + Math.random() * (high - low);
};

const computeStats = (values: number[]): MonteCarloStats => {
  if (values.length === 0) {
    return { mean: null, stdev: null, p05: null, p50: null, p95: null, unit: "" };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mean = sorted.reduce((acc, val) => acc + val, 0) / sorted.length;
  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length;
  const stdev = Math.sqrt(variance);

  const percentile = (p: number) => {
    const index = Math.max(0, Math.min(sorted.length - 1, Math.round(p * (sorted.length - 1))));
    return sorted[index];
  };

  return {
    mean: clampNormal(mean),
    stdev: clampNormal(stdev),
    p05: clampNormal(percentile(0.05)),
    p50: clampNormal(percentile(0.5)),
    p95: clampNormal(percentile(0.95)),
    unit: "",
  };
};

const buildHistogram = (values: number[], binCount = 18): HistogramBin[] => {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return [{ x0: min, x1: max, count: values.length }];
  }
  const step = (max - min) / binCount;
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, idx) => ({
    x0: min + idx * step,
    x1: min + (idx + 1) * step,
    count: 0,
  }));

  values.forEach((value) => {
    const idx = Math.min(binCount - 1, Math.floor((value - min) / step));
    bins[idx].count += 1;
  });

  return bins;
};

export const runMonteCarlo = (session: LabSession): MonteCarloResult => {
  const parsed = LabSessionSchema.safeParse(session);
  if (!parsed.success) {
    return { stats: { mean: null, stdev: null, p05: null, p50: null, p95: null, unit: "" }, histogram: [], warnings: [], error: "Invalid session data." };
  }

  const formula = normalizeFormula(parsed.data.formula);
  if (!formula) {
    return { stats: { mean: null, stdev: null, p05: null, p50: null, p95: null, unit: "" }, histogram: [], warnings: [], error: "Formula is empty." };
  }

  const iterations = parsed.data.monteCarlo.iterations ?? 1000;
  const compiled = math.compile(formula);
  const values: number[] = [];
  let yUnit = "";

  for (let i = 0; i < iterations; i += 1) {
    const overrideValues: Record<string, number> = {};
    parsed.data.variables.forEach((variable) => {
      overrideValues[variable.symbol] = sampleVariable(variable);
    });

    try {
      const scope = buildScope(parsed.data.variables, overrideValues);
      const result = compiled.evaluate(scope);
      const extracted = extractUnit(result);
      if (!yUnit) yUnit = extracted.unit;
      if (extracted.value !== null) {
        values.push(Number(extracted.value));
      }
    } catch {
      // ignore invalid iterations
    }
  }

  const stats = computeStats(values);
  stats.unit = yUnit;

  return {
    stats,
    histogram: buildHistogram(values),
    warnings: [],
  };
};
