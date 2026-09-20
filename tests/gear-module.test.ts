import { describe, expect, it } from "vitest";
import { calculateGearModule, STANDARD_MODULES } from "@/tools/gear-module/logic";

describe("gear module calculator", () => {
  it("calculates m=d/z, d=mz, and p=pi*m", () => {
    const result = calculateGearModule({ diameter: 200, teeth: 40 });
    expect(result).not.toBeNull();
    expect(result?.mRaw).toBe(5);
    expect(result?.suggestedDiameter).toBe(200);
    expect(result?.circularPitch).toBeCloseTo(Math.PI * 5, 12);
  });

  it("keeps the standard-module suggestion separate from the raw result", () => {
    const result = calculateGearModule({ diameter: "180", teeth: "44" });
    expect(result?.mRaw).toBeCloseTo(4.090909, 6);
    expect(result?.suggestedM).toBe(4);
    expect(result?.suggestedDiameter).toBe(176);
    expect(result?.diffPercent).toBeCloseTo(-2.2222, 4);
    expect(STANDARD_MODULES).toContain(result?.suggestedM ?? 0);
  });

  it("labels the 17-tooth rule as an approximate boundary", () => {
    expect(calculateGearModule({ diameter: 32, teeth: 16 })?.approximateUndercutRisk).toBe(true);
    expect(calculateGearModule({ diameter: 34, teeth: 17 })?.approximateUndercutRisk).toBe(false);
  });

  it.each([
    { diameter: 0, teeth: 20 },
    { diameter: -10, teeth: 20 },
    { diameter: 100, teeth: 0 },
    { diameter: 100, teeth: -2 },
    { diameter: 100, teeth: 20.5 },
    { diameter: "text", teeth: 20 },
  ])("rejects invalid geometry %#", (input) => {
    expect(calculateGearModule(input)).toBeNull();
  });

  it("accepts decimal diameter and finite small/large values", () => {
    expect(calculateGearModule({ diameter: "200,5", teeth: "40" })?.mRaw).toBeCloseTo(5.0125, 10);
    expect(Number.isFinite(calculateGearModule({ diameter: 1e12, teeth: 1_000_000 })?.mRaw)).toBe(true);
  });
});
