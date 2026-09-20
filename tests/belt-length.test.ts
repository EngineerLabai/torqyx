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
});
