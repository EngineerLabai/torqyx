import { describe, expect, it } from "vitest";
import { calculateBearingLife } from "@/tools/bearing-life/logic";

describe("bearing life calculator", () => {
  it("keeps basic L10 separate from reliability-adjusted Lna", () => {
    const result = calculateBearingLife({ C: "35", P: "12", bearingType: "roller", rpm: "900", a1: "0.62" });
    expect(result.error).toBeUndefined();
    expect(result.exponent).toBeCloseTo(10 / 3, 12);
    expect(result.L10).toBeCloseTo(35.4505, 4);
    expect(result.L10h).toBeCloseTo(656.4912, 4);
    expect(result.Lna).toBeCloseTo(21.9793, 4);
    expect(result.Lnah).toBeCloseTo(407.0245, 4);
  });

  it("uses p=3 for ball bearings and converts revolutions to hours", () => {
    const result = calculateBearingLife({ C: "25", P: "10", bearingType: "ball", rpm: "1500", a1: "1" });
    expect(result.L10).toBeCloseTo(15.625, 6);
    expect(result.L10h).toBeCloseTo(173.611111, 6);
    expect(result.Lna).toBeCloseTo(result.L10 ?? 0, 12);
  });

  it.each([
    { C: "0", P: "10", bearingType: "ball" as const, rpm: "1500", a1: "1" },
    { C: "25", P: "-1", bearingType: "ball" as const, rpm: "1500", a1: "1" },
    { C: "25", P: "10", bearingType: "ball" as const, rpm: "0", a1: "1" },
    { C: "25", P: "10", bearingType: "ball" as const, rpm: "1500", a1: "0" },
    { C: "text", P: "10", bearingType: "ball" as const, rpm: "1500", a1: "1" },
  ])("rejects invalid input %#", (input) => {
    const result = calculateBearingLife(input);
    expect(result.error).toBeTruthy();
    expect(result.L10).toBeNull();
    expect(result.Lna).toBeNull();
  });

  it("accepts comma decimals and finite small/large ratios", () => {
    const decimal = calculateBearingLife({ C: "25,5", P: "10,2", bearingType: "ball", rpm: "1500,5", a1: "0,9" });
    const tiny = calculateBearingLife({ C: "0.001", P: "0.0005", bearingType: "ball", rpm: "1", a1: "1" });
    const large = calculateBearingLife({ C: "1e9", P: "5e8", bearingType: "roller", rpm: "1e6", a1: "1" });
    for (const result of [decimal, tiny, large]) {
      expect(result.error).toBeUndefined();
      expect(Number.isFinite(result.L10)).toBe(true);
    }
  });
});
