import { describe, expect, it } from "vitest";
import {
  calculateBolt,
  calculateTorqueFromNutFactor,
  getTorqueFactor,
} from "@/tools/bolt-calculator/logic";

describe("bolt preload and tightening torque", () => {
  it("verifies the stated T = K F d example", () => {
    expect(calculateTorqueFromNutFactor({ nutFactor: 0.14, preloadN: 25_000, nominalDiameterM: 0.01 })).toBeCloseTo(35, 12);
  });

  it("keeps K distinct from a coefficient of friction", () => {
    expect(getTorqueFactor("dry")).toBe(0.25);
    const result = calculateBolt({ presetId: "M8", d: "8", P: "1.25", grade: "8.8", preloadPercent: "70", friction: "dry" });
    expect(result.error).toBeUndefined();
    expect(result.As).toBeCloseTo(36.60846, 5);
    expect(result.Fv).toBeCloseTo(16.401, 3);
    expect(result.torqueFactor).toBe(0.25);
    expect(result.torque).toBeCloseTo(32.80118, 5);
    expect(result.yieldStrength).toBe(640);
    expect(result.proofStrength).toBeNull();
  });

  it.each([
    { presetId: "custom" as const, d: "0", P: "1", grade: "8.8" as const, preloadPercent: "70", friction: "dry" as const },
    { presetId: "custom" as const, d: "8", P: "-1", grade: "8.8" as const, preloadPercent: "70", friction: "dry" as const },
    { presetId: "custom" as const, d: "8", P: "1.25", grade: "8.8" as const, preloadPercent: "0", friction: "dry" as const },
    { presetId: "custom" as const, d: "8", P: "1.25", grade: "8.8" as const, preloadPercent: "91", friction: "dry" as const },
    { presetId: "custom" as const, d: "text", P: "1.25", grade: "8.8" as const, preloadPercent: "70", friction: "dry" as const },
  ])("rejects invalid input %#", (input) => {
    const result = calculateBolt(input);
    expect(result.error).toBeTruthy();
    expect(result.torque).toBeNull();
  });

  it("handles decimal and small values without producing infinity", () => {
    const decimal = calculateBolt({ presetId: "custom", d: "10.5", P: "1.25", grade: "10.9", preloadPercent: "65.5", friction: "coated" });
    const small = calculateBolt({ presetId: "custom", d: "0.01", P: "0.001", grade: "8.8", preloadPercent: "1", friction: "oiled" });
    expect(Number.isFinite(decimal.torque)).toBe(true);
    expect(Number.isFinite(small.torque)).toBe(true);
  });

  it("rejects invalid direct nut-factor inputs", () => {
    expect(calculateTorqueFromNutFactor({ nutFactor: 0, preloadN: 25_000, nominalDiameterM: 0.01 })).toBeNull();
    expect(calculateTorqueFromNutFactor({ nutFactor: 0.14, preloadN: -1, nominalDiameterM: 0.01 })).toBeNull();
  });
});
