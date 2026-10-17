import { describe, expect, it } from "vitest";
import { calculateHydraulicCylinder, DEFAULT_INPUT } from "@/tools/hydraulic-cylinder/logic";

describe("hydraulic cylinder calculator", () => {
  it("calculates extend/retract forces, speeds, and hydraulic power accurately", () => {
    // pressure = 160 bar, bore = 80 mm, rod = 45 mm, flow = 25 L/min, efficiency = 90%
    const result = calculateHydraulicCylinder(DEFAULT_INPUT);

    expect(result.error).toBeUndefined();

    // Area bore = pi * 0.08^2 / 4 ≈ 0.0050265 m^2 = 5026.55 mm^2
    expect(result.areaBore).toBeCloseTo(0.0050265, 6);

    // Force extend = (160 * 10^5 * 0.0050265) / 1000 ≈ 80.425 kN
    expect(result.forceExtend).toBeCloseTo(80.425, 2);

    // Actual force extend = 80.425 * 0.9 ≈ 72.382 kN
    expect(result.actualForceExtend).toBeCloseTo(72.382, 2);

    // Annulus area = areaBore - areaRod = 5026.55 - (pi * 0.045^2 / 4 * 10^6) = 5026.55 - 1590.43 = 3436.12 mm^2
    expect(result.areaAnnulus).toBeCloseTo(0.0034361, 6);

    // Force retract = (160 * 10^5 * 0.0034361) / 1000 ≈ 54.978 kN
    expect(result.forceRetract).toBeCloseTo(54.978, 2);
    expect(result.actualForceRetract).toBeCloseTo(54.978 * 0.9, 2);

    // Extend speed: flow = 25 L/min = 25/60000 m^3/s. speed = (flow / areaBore) * 1000 ≈ 82.89 mm/s
    expect(result.speedExtend).toBeCloseTo(82.89, 1);

    // Retract speed: (flow / areaAnnulus) * 1000 ≈ 121.26 mm/s
    expect(result.speedRetract).toBeCloseTo(121.26, 1);

    // Hydraulic power: (pressure * flow) / 1000 = (160 * 10^5 * (25 / 60000)) / 1000 ≈ 6.67 kW
    expect(result.hydraulicPower).toBeCloseTo(6.67, 2);
  });

  it("handles 100% ideal efficiency when efficiency is omitted", () => {
    const result = calculateHydraulicCylinder({
      pressure: "160",
      bore: "80",
      rod: "45",
      flow: "25",
    });
    expect(result.error).toBeUndefined();
    expect(result.actualForceExtend).toBeCloseTo(result.forceExtend ?? 0, 4);
    expect(result.actualForceRetract).toBeCloseTo(result.forceRetract ?? 0, 4);
  });

  it("rejects cylinder where rod diameter >= bore diameter", () => {
    const result = calculateHydraulicCylinder({
      ...DEFAULT_INPUT,
      bore: "50",
      rod: "50",
    });
    expect(result.error).toContain("Mil çapı silindir çapından küçük olmalıdır");
    expect(result.forceRetract).toBeNull();
  });

  it.each([
    { pressure: "0", bore: "80", rod: "45", flow: "25", efficiency: "90" },
    { pressure: "-10", bore: "80", rod: "45", flow: "25", efficiency: "90" },
    { pressure: "160", bore: "0", rod: "45", flow: "25", efficiency: "90" },
    { pressure: "160", bore: "80", rod: "-5", flow: "25", efficiency: "90" },
    { pressure: "160", bore: "80", rod: "45", flow: "0", efficiency: "90" },
    { pressure: "160", bore: "80", rod: "45", flow: "25", efficiency: "0" },
    { pressure: "160", bore: "80", rod: "45", flow: "25", efficiency: "110" },
    { pressure: "invalid", bore: "80", rod: "45", flow: "25", efficiency: "90" },
  ])("rejects invalid input %#", (input) => {
    const result = calculateHydraulicCylinder(input);
    expect(result.error).toBeTruthy();
    expect(result.forceExtend).toBeNull();
  });

  it("supports comma decimal separators", () => {
    const result = calculateHydraulicCylinder({
      pressure: "160,5",
      bore: "80,2",
      rod: "45,1",
      flow: "25,5",
      efficiency: "92,5",
    });
    expect(result.error).toBeUndefined();
    expect(result.forceExtend).toBeGreaterThan(0);
    expect(result.speedExtend).toBeGreaterThan(0);
  });

  it("handles locale thousands grouping when locale is provided", () => {
    // TR: '.' is thousands, ',' is decimal
    const trRes = calculateHydraulicCylinder({
      pressure: "160",
      bore: "1.000",
      rod: "500",
      flow: "25",
      efficiency: "90",
      locale: "tr",
    });
    expect(trRes.error).toBeUndefined();
    expect(trRes.forceExtend).toBeGreaterThan(0);

    // EN: ',' is thousands, '.' is decimal
    const enRes = calculateHydraulicCylinder({
      pressure: "160",
      bore: "1,000",
      rod: "500",
      flow: "25",
      efficiency: "90",
      locale: "en",
    });
    expect(enRes.error).toBeUndefined();
    expect(enRes.forceExtend).toBeGreaterThan(0);

    // Cross-locale grouping is rejected (English grouping 1,000.50 in Turkish locale)
    const trMismatch = calculateHydraulicCylinder({
      pressure: "160",
      bore: "1,000.50",
      rod: "500",
      flow: "25",
      efficiency: "90",
      locale: "tr",
    });
    expect(trMismatch.error).toBeTruthy();
  });
});
