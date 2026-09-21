import { describe, expect, it } from "vitest";
import {
  calculateToleranceStack,
  convertLength,
  formatToleranceEquation,
  ToleranceInputError,
  type ToleranceDimension,
} from "@/lib/engineering/tolerance/stack";

const dimension = (overrides: Partial<ToleranceDimension> = {}): ToleranceDimension => ({
  id: "a",
  label: "A",
  nominal: 20,
  upperDeviation: 0.1,
  lowerDeviation: -0.1,
  direction: 1,
  ...overrides,
});

describe("Tolerance Lab stack engine", () => {
  it("calculates worst-case symmetric stacks", () => {
    const result = calculateToleranceStack([
      dimension(),
      dimension({ id: "b", label: "B", nominal: 10, upperDeviation: 0.05, lowerDeviation: -0.05 }),
    ]);

    expect(result.nominalResult).toBe(30);
    expect(result.worstCaseMin).toBeCloseTo(29.85, 10);
    expect(result.worstCaseMax).toBeCloseTo(30.15, 10);
    expect(result.worstCaseTolerance).toBeCloseTo(0.3, 10);
  });

  it("flips nominal and deviations for a subtractive dimension", () => {
    const result = calculateToleranceStack([
      dimension(),
      dimension({ id: "b", label: "B", nominal: 5, direction: -1 }),
    ]);

    expect(result.nominalResult).toBe(15);
    expect(result.worstCaseMin).toBeCloseTo(14.8, 10);
    expect(result.worstCaseMax).toBeCloseTo(15.2, 10);
  });

  it("preserves asymmetric tolerance center and range", () => {
    const result = calculateToleranceStack([
      dimension({ upperDeviation: 0.05, lowerDeviation: -0.02 }),
    ]);

    expect(result.worstCaseMin).toBeCloseTo(19.98, 10);
    expect(result.worstCaseMax).toBeCloseTo(20.05, 10);
    expect(result.rssNominal).toBeCloseTo(20.015, 10);
    expect(result.rssHalfRange).toBeCloseTo(0.035, 10);
  });

  it("reports RSS contribution percentages", () => {
    const result = calculateToleranceStack([
      dimension({ upperDeviation: 0.1, lowerDeviation: -0.1 }),
      dimension({ id: "b", label: "B", nominal: 10, upperDeviation: 0.05, lowerDeviation: -0.05 }),
    ]);

    expect(result.rssMin).toBeCloseTo(29.8881966011, 8);
    expect(result.rssMax).toBeCloseTo(30.1118033989, 8);
    expect(result.sensitivity[0].contributionPercent).toBeCloseTo(80, 8);
    expect(result.sensitivity[1].contributionPercent).toBeCloseTo(20, 8);
  });

  it("rejects invalid ranges and converts length units", () => {
    expect(() =>
      calculateToleranceStack([dimension({ upperDeviation: -0.2, lowerDeviation: -0.1 })]),
    ).toThrow(ToleranceInputError);
    expect(convertLength(25.4, "mm", "in")).toBeCloseTo(1, 10);
    expect(convertLength(1, "in", "mm")).toBeCloseTo(25.4, 10);
    expect(formatToleranceEquation([dimension(), dimension({ id: "b", label: "B", direction: -1 })])).toBe(
      "X = A − B",
    );
  });
});
