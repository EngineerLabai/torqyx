import { describe, expect, it } from "vitest";
import { calculateFilletWeld, DEFAULT_INPUT } from "@/tools/fillet-weld/logic";

describe("fillet weld calculator", () => {
  it("calculates required leg size and throat thickness correctly", () => {
    // load = 15000 N, length = 120 mm, allowable = 140 MPa, fillet = 0
    const result = calculateFilletWeld(DEFAULT_INPUT);

    expect(result.error).toBeUndefined();

    // requiredA = F / (0.707 * L * allowable)
    // requiredA = 15000 / (0.707 * 120 * 140) ≈ 1.2629 mm
    expect(result.requiredA).toBeCloseTo(1.2629, 3);

    // throat = requiredA * 0.707 ≈ 0.8929 mm
    expect(result.throat).toBeCloseTo(0.8929, 3);
  });

  it("checks stress and safety when user provides existing weld leg size", () => {
    // load = 20000 N, length = 150 mm, allowable = 160 MPa, fillet = 6 mm
    const result = calculateFilletWeld({
      load: "20000",
      length: "150",
      allowable: "160",
      fillet: "6",
    });

    expect(result.error).toBeUndefined();

    // requiredA = 20000 / (0.707 * 150 * 160) ≈ 1.1787 mm
    expect(result.requiredA).toBeCloseTo(1.1787, 3);

    // stress = load / (0.707 * fillet * length)
    // stress = 20000 / (0.707 * 6 * 150) ≈ 31.432 MPa
    expect(result.stress).toBeCloseTo(31.432, 2);

    // isSafe: stress <= allowable (31.432 <= 160 -> true)
    expect(result.isSafe).toBe(true);
  });

  it("marks weld unsafe when stress exceeds allowable limit", () => {
    // load = 80000 N, length = 80 mm, allowable = 100 MPa, fillet = 3 mm
    const result = calculateFilletWeld({
      load: "80000",
      length: "80",
      allowable: "100",
      fillet: "3",
    });

    expect(result.error).toBeUndefined();
    // stress = 80000 / (0.707 * 3 * 80) ≈ 471.5 MPa > 100 MPa
    expect(result.stress).toBeGreaterThan(100);
    expect(result.isSafe).toBe(false);
  });

  it.each([
    { load: "0", length: "120", allowable: "140", fillet: "0" },
    { load: "-100", length: "120", allowable: "140", fillet: "0" },
    { load: "15000", length: "0", allowable: "140", fillet: "0" },
    { load: "15000", length: "-5", allowable: "140", fillet: "0" },
    { load: "15000", length: "120", allowable: "0", fillet: "0" },
    { load: "15000", length: "120", allowable: "-50", fillet: "0" },
    { load: "invalid", length: "120", allowable: "140", fillet: "0" },
  ])("rejects invalid input %#", (input) => {
    const result = calculateFilletWeld(input);
    expect(result.error).toBeTruthy();
    expect(result.requiredA).toBeNull();
    expect(result.throat).toBeNull();
  });

  it("supports comma decimal separators", () => {
    const result = calculateFilletWeld({
      load: "15000,5",
      length: "120,5",
      allowable: "140,2",
      fillet: "5,5",
    });
    expect(result.error).toBeUndefined();
    expect(result.requiredA).toBeGreaterThan(0);
    expect(result.stress).toBeGreaterThan(0);
  });

  it("handles locale thousands grouping when locale is provided", () => {
    // TR: '.' is thousands, ',' is decimal
    const trRes = calculateFilletWeld({
      load: "15.000",
      length: "120",
      allowable: "140",
      fillet: "0",
      locale: "tr",
    });
    expect(trRes.error).toBeUndefined();
    expect(trRes.requiredA).toBeCloseTo(1.2629, 3);

    // EN: ',' is thousands, '.' is decimal
    const enRes = calculateFilletWeld({
      load: "15,000",
      length: "120",
      allowable: "140",
      fillet: "0",
      locale: "en",
    });
    expect(enRes.error).toBeUndefined();
    expect(enRes.requiredA).toBeCloseTo(1.2629, 3);

    // Cross-locale grouping is rejected (English grouping 15,000.50 in Turkish locale)
    const trMismatch = calculateFilletWeld({
      load: "15,000.50",
      length: "120",
      allowable: "140",
      fillet: "0",
      locale: "tr",
    });
    expect(trMismatch.error).toBeTruthy();
  });
});
