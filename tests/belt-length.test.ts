import { describe, expect, it } from "vitest";
import { calculateOpenBelt } from "@/tools/belt-length/logic";

describe("open-belt calculator", () => {
  it("uses physical pulley order, not input order", () => {
    const forward = calculateOpenBelt({ d1: 120, d2: 80, center: 400 });
    const reversed = calculateOpenBelt({ d1: 80, d2: 120, center: 400 });

    expect(forward.ok).toBe(true);
    expect(reversed.ok).toBe(true);
    if (!forward.ok || !reversed.ok) return;

    expect(forward.length).toBeCloseTo(1115.159, 3);
    expect(reversed.length).toBeCloseTo(forward.length, 10);
    expect(forward.betaSmallDeg).toBeLessThan(180);
    expect(forward.betaBigDeg).toBeGreaterThan(180);
    expect(reversed.betaSmallDeg).toBeCloseTo(forward.betaSmallDeg, 10);
    expect(reversed.betaBigDeg).toBeCloseTo(forward.betaBigDeg, 10);
    expect(forward.smallPulleySource).toBe("D2");
    expect(reversed.smallPulleySource).toBe("D1");
  });

  it("returns 180 degrees for equal pulleys", () => {
    const result = calculateOpenBelt({ d1: "150", d2: "150", center: "500" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.betaSmallDeg).toBeCloseTo(180, 10);
    expect(result.betaBigDeg).toBeCloseTo(180, 10);
  });

  it.each([
    [{ d1: "", d2: "80", center: "400" }, "invalid-input"],
    [{ d1: "text", d2: "80", center: "400" }, "invalid-input"],
    [{ d1: "-120", d2: "80", center: "400" }, "invalid-input"],
    [{ d1: "120", d2: "80", center: "0" }, "invalid-input"],
    [{ d1: "500", d2: "20", center: "200" }, "invalid-geometry"],
    [{ d1: "120", d2: "80", center: "100" }, "overlapping-pulleys"],
  ])("rejects invalid geometry %#", (input, reason) => {
    expect(calculateOpenBelt(input)).toEqual({ ok: false, reason });
  });

  it("accepts comma decimals and remains finite at large scale", () => {
    const decimal = calculateOpenBelt({ d1: "120,5", d2: "80,25", center: "400,5" });
    const large = calculateOpenBelt({ d1: 1e9, d2: 5e8, center: 2e9 });
    expect(decimal.ok).toBe(true);
    expect(large.ok).toBe(true);
    if (large.ok) expect(Number.isFinite(large.length)).toBe(true);
  });

  it("calculates exact small and large wrap angles for D1=120, D2=80, C=400", () => {
    const res = calculateOpenBelt({ d1: "120", d2: "80", center: "400" });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    // ratio = (120 - 80) / (2 * 400) = 0.05
    // asin(0.05) ≈ 0.0500209 rad ≈ 2.86598°
    // betaSmall = 180 - 2 * 2.86598 = 174.268° ≈ 174.27°
    // betaBig = 180 + 2 * 2.86598 = 185.732° ≈ 185.73°
    expect(res.betaSmallDeg).toBeCloseTo(174.268, 2);
    expect(res.betaBigDeg).toBeCloseTo(185.732, 2);
    expect(res.length).toBeCloseTo(1115.159, 2);
  });

  it("verifies the 250 mm / 100 mm / 600 mm layout accurately matches formula 1759.15 mm", () => {
    const forward = calculateOpenBelt({ d1: 250, d2: 100, center: 600 });
    const reversed = calculateOpenBelt({ d1: 100, d2: 250, center: 600 });

    expect(forward.ok).toBe(true);
    expect(reversed.ok).toBe(true);
    if (!forward.ok || !reversed.ok) return;

    // L = 2*600 + (π/2)*(350) + (150)^2 / (4*600) = 1200 + 549.7787 + 9.375 = 1759.1537 mm
    expect(forward.length).toBeCloseTo(1759.154, 2);
    expect(reversed.length).toBeCloseTo(forward.length, 10);

    // r = 150 / 1200 = 0.125 -> asin(0.125) ≈ 7.1807°
    // betaSmall = 180 - 14.3615 = 165.6385° ≈ 165.64°
    // betaBig = 180 + 14.3615 = 194.3615° ≈ 194.36°
    expect(forward.betaSmallDeg).toBeCloseTo(165.639, 2);
    expect(forward.betaBigDeg).toBeCloseTo(194.361, 2);
    expect(reversed.betaSmallDeg).toBeCloseTo(forward.betaSmallDeg, 10);
    expect(reversed.betaBigDeg).toBeCloseTo(forward.betaBigDeg, 10);

    // Physical source tracking
    expect(forward.smallPulleySource).toBe("D2");
    expect(forward.bigPulleySource).toBe("D1");
    expect(reversed.smallPulleySource).toBe("D1");
    expect(reversed.bigPulleySource).toBe("D2");
  });

  it("handles locale-formatted inputs when locale is provided", () => {
    // Turkish locale: '.' is thousands separator
    const trRes = calculateOpenBelt({ d1: "1.200", d2: "800", center: "4.000", locale: "tr" });
    expect(trRes.ok).toBe(true);
    if (trRes.ok) {
      expect(trRes.dBig).toBe(1200);
      expect(trRes.dSmall).toBe(800);
    }

    // English locale: ',' is thousands separator
    const enRes = calculateOpenBelt({ d1: "1,200", d2: "800", center: "4,000", locale: "en" });
    expect(enRes.ok).toBe(true);
    if (enRes.ok) {
      expect(enRes.dBig).toBe(1200);
      expect(enRes.dSmall).toBe(800);
    }

    // Cross-locale thousands separator is rejected
    const trMismatch = calculateOpenBelt({ d1: "1,200", d2: "800", center: "4,000", locale: "tr" });
    expect(trMismatch.ok).toBe(false);

    const enMismatch = calculateOpenBelt({ d1: "1.200", d2: "800", center: "4.000", locale: "en" });
    expect(enMismatch.ok).toBe(false);
  });
});
