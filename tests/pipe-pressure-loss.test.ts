import { describe, expect, it } from "vitest";
import { calculatePipePressureLoss } from "@/tools/pipe-pressure-loss/logic";

const base = {
  rho: "998",
  mu: "0.001",
  flow: "0.01",
  diameter: "50",
  length: "30",
  roughness: "0.045",
};

describe("Darcy-Weisbach pipe pressure loss", () => {
  it("matches the documented turbulent example", () => {
    const result = calculatePipePressureLoss(base);
    expect(result.error).toBeUndefined();
    expect(result.area).toBeCloseTo(0.0019635, 7);
    expect(result.velocity).toBeCloseTo(5.09296, 5);
    expect(result.reynolds).toBeCloseTo(254138.6, 1);
    expect(result.relativeRoughness).toBeCloseTo(0.0009, 8);
    expect(result.regime).toBe("turbulent");
    expect(result.frictionMethod).toBe("Swamee-Jain");
    expect(result.deltaP).toBeCloseTo(159158.53, 1);
    expect(result.headLoss).toBeCloseTo((result.deltaP ?? 0) / (998 * 9.80665), 8);
  });

  it("uses f=64/Re for laminar flow", () => {
    const flowForRe1000 = (1000 * Math.PI * 0.001 * 0.05) / (4 * 1000);
    const result = calculatePipePressureLoss({ ...base, rho: "1000", flow: String(flowForRe1000) });
    expect(result.reynolds).toBeCloseTo(1000, 8);
    expect(result.regime).toBe("laminar");
    expect(result.frictionMethod).toBe("64/Re");
    expect(result.frictionFactor).toBeCloseTo(0.064, 10);
  });

  it("flags the transition range", () => {
    const flowForRe3000 = (3000 * Math.PI * 0.001 * 0.05) / (4 * 1000);
    const result = calculatePipePressureLoss({ ...base, rho: "1000", flow: String(flowForRe3000) });
    expect(result.reynolds).toBeCloseTo(3000, 8);
    expect(result.regime).toBe("transition");
    expect(result.frictionMethod).toBe("Swamee-Jain");
  });

  it.each([
    { ...base, rho: "0" },
    { ...base, mu: "-1" },
    { ...base, flow: "0" },
    { ...base, diameter: "text" },
    { ...base, length: "-2" },
    { ...base, roughness: "-0.1" },
  ])("rejects invalid input %#", (input) => {
    const result = calculatePipePressureLoss(input);
    expect(result.error).toBeTruthy();
    expect(result.deltaP).toBeNull();
  });

  it("supports comma decimals, smooth pipe, and finite scale extremes", () => {
    const comma = calculatePipePressureLoss({ ...base, flow: "0,005", roughness: "0" });
    const tiny = calculatePipePressureLoss({ ...base, flow: "0.000001", diameter: "5", length: "0.1" });
    const large = calculatePipePressureLoss({ ...base, flow: "1000", diameter: "10000", length: "100000" });
    for (const result of [comma, tiny, large]) {
      expect(result.error).toBeUndefined();
      expect(Number.isFinite(result.deltaP)).toBe(true);
    }
  });
});
