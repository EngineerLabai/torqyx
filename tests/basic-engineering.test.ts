import { describe, expect, it } from "vitest";
import { calculateHeat, DEFAULT_INPUT } from "@/tools/basic-engineering/logic";

describe("basic engineering heat flow calculator", () => {
  it("calculates thermal resistance and heat flow accurately using Fourier's Law", () => {
    // k = 45 W/mK, area = 0.02 m^2, deltaT = 30 K, thickness = 0.01 m
    const result = calculateHeat(DEFAULT_INPUT);

    expect(result.error).toBeUndefined();

    // R = L / (k * A) = 0.01 / (45 * 0.02) = 0.01 / 0.9 ≈ 0.01111 K/W
    expect(result.resistance).toBeCloseTo(0.01111, 4);

    // Q = deltaT / R = 30 / (0.01 / 0.9) = 2700 W
    expect(result.heatFlow).toBeCloseTo(2700, 2);
  });

  it("supports comma decimal separators for Turkish input", () => {
    const result = calculateHeat({
      conductivity: "45,5",
      area: "0,02",
      deltaT: "30,5",
      thickness: "0,015",
    });

    expect(result.error).toBeUndefined();
    expect(result.heatFlow).toBeGreaterThan(0);
    expect(result.resistance).toBeGreaterThan(0);
  });

  it.each([
    { conductivity: "0", area: "0.02", deltaT: "30", thickness: "0.01" },
    { conductivity: "-45", area: "0.02", deltaT: "30", thickness: "0.01" },
    { conductivity: "45", area: "0", deltaT: "30", thickness: "0.01" },
    { conductivity: "45", area: "0.02", deltaT: "30", thickness: "0" },
    { conductivity: "45", area: "0.02", deltaT: "30", thickness: "-0.01" },
    { conductivity: "text", area: "0.02", deltaT: "30", thickness: "0.01" },
  ])("rejects invalid input %#", (input) => {
    const result = calculateHeat(input);
    expect(result.error).toBeTruthy();
    expect(result.heatFlow).toBeNull();
  });

  it("handles locale thousands grouping when locale is provided", () => {
    // TR: '.' is thousands, ',' is decimal
    const trRes = calculateHeat({
      conductivity: "45",
      area: "2.000",
      deltaT: "30",
      thickness: "1.000",
      locale: "tr",
    });
    expect(trRes.error).toBeUndefined();
    expect(trRes.heatFlow).toBe(2700);

    // EN: ',' is thousands, '.' is decimal
    const enRes = calculateHeat({
      conductivity: "45",
      area: "2,000",
      deltaT: "30",
      thickness: "1,000",
      locale: "en",
    });
    expect(enRes.error).toBeUndefined();
    expect(enRes.heatFlow).toBe(2700);

    // Cross-locale grouping is rejected (English thousands+decimal 2,000.50 in Turkish locale)
    const trMismatch = calculateHeat({
      conductivity: "45",
      area: "2,000.50",
      deltaT: "30",
      thickness: "1,000.50",
      locale: "tr",
    });
    expect(trMismatch.error).toBeTruthy();
  });
});
