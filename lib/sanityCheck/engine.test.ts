import { describe, it, expect } from "vitest";
import { evaluateFormula, runSweep, runMonteCarlo } from "@/lib/sanityCheck/engine";
import type { LabSession } from "@/lib/sanityCheck/types";

const baseSession: LabSession = {
  title: "",
  variables: [],
  formula: "",
  expectedUnit: "",
  sweep: { points: 50 },
  monteCarlo: { iterations: 1000 },
};

describe("sanity check engine", () => {
  it("evaluates a simple formula with units", () => {
    const session: LabSession = {
      ...baseSession,
      variables: [
        { id: "t", symbol: "T", name: "Torque", value: 10, unit: "N m", min: 8, max: 12 },
        { id: "w", symbol: "w", name: "Omega", value: 2, unit: "rad/s", min: 1, max: 3 },
      ],
      formula: "T * w",
    };

    const result = evaluateFormula(session);
    expect(result.error).toBeUndefined();
    expect(result.value).toBeCloseTo(20, 6);
    expect(result.unit).toContain("N");
  });

  it("detects unit mismatch when expected unit differs", () => {
    const session: LabSession = {
      ...baseSession,
      variables: [{ id: "p", symbol: "P", name: "Pressure", value: 2, unit: "Pa", min: 1, max: 3 }],
      formula: "P",
      expectedUnit: "N",
    };

    const result = evaluateFormula(session);
    expect(result.warnings.some((warning) => warning.type === "unit-mismatch")).toBe(true);
  });

  it("returns sweep points using variable min/max", () => {
    const session: LabSession = {
      ...baseSession,
      variables: [{ id: "x", symbol: "x", name: "X", value: 5, unit: "", min: 0, max: 10 }],
      formula: "x * 2",
      sweep: { points: 5, variableId: "x" },
    };

    const sweep = runSweep(session, "x");
    expect(sweep.points.length).toBe(5);
    expect(sweep.points[0].y).toBeCloseTo(0, 6);
    expect(sweep.points[4].y).toBeCloseTo(20, 6);
  });

  it("computes Monte Carlo stats for constant input", () => {
    const session: LabSession = {
      ...baseSession,
      variables: [{ id: "x", symbol: "x", name: "X", value: 5, unit: "", min: 5, max: 5 }],
      formula: "x * 2",
      monteCarlo: { iterations: 200 },
    };

    const mc = runMonteCarlo(session);
    expect(mc.stats.mean).toBeCloseTo(10, 6);
    expect(mc.stats.stdev).toBeCloseTo(0, 6);
  });

  it("returns error when formula is empty", () => {
    const session: LabSession = {
      ...baseSession,
      variables: [{ id: "x", symbol: "x", name: "X", value: 1, unit: "" }],
      formula: "",
    };

    const result = evaluateFormula(session);
    expect(result.error).toBeTruthy();
  });

  it("flags mismatch when expected unit is set for dimensionless output", () => {
    const session: LabSession = {
      ...baseSession,
      variables: [{ id: "x", symbol: "x", name: "X", value: 1, unit: "" }],
      formula: "x + 1",
      expectedUnit: "m",
    };

    const result = evaluateFormula(session);
    expect(result.warnings.some((warning) => warning.type === "unit-mismatch")).toBe(true);
  });
});
