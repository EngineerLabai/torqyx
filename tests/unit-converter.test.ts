import { describe, it, expect } from "vitest";
import { calculateUnit } from "@/tools/unit-converter/logic";

describe("unit-converter calculator", () => {
  it("converts length units with dot decimal", () => {
    const res = calculateUnit({
      category: "length",
      fromUnit: "mm",
      toUnit: "m",
      value: "100",
    });
    expect(res.output).toBeCloseTo(0.1, 4);
    expect(res.baseValue).toBeCloseTo(0.1, 4);
    expect(res.inputValue).toBe(100);
  });

  it("converts length units with comma decimal", () => {
    const res = calculateUnit({
      category: "length",
      fromUnit: "mm",
      toUnit: "m",
      value: "12,5",
    });
    expect(res.output).toBeCloseTo(0.0125, 6);
    expect(res.inputValue).toBe(12.5);
  });

  it("converts pressure units (bar to Pa)", () => {
    const res = calculateUnit({
      category: "pressure",
      fromUnit: "bar",
      toUnit: "Pa",
      value: "2.5",
    });
    expect(res.output).toBe(250000);
  });

  it("converts force units (kN to N)", () => {
    const res = calculateUnit({
      category: "force",
      fromUnit: "kN",
      toUnit: "N",
      value: "5",
    });
    expect(res.output).toBe(5000);
  });

  it("converts energy units (kWh to MJ)", () => {
    const res = calculateUnit({
      category: "energy",
      fromUnit: "kWh",
      toUnit: "MJ",
      value: "1",
    });
    expect(res.output).toBeCloseTo(3.6, 4);
  });

  it("rejects inputs with trailing characters (e.g. 12,5abc)", () => {
    const res = calculateUnit({
      category: "length",
      fromUnit: "mm",
      toUnit: "m",
      value: "12,5abc",
    });
    expect(res.output).toBeNull();
    expect(res.errorKey).toBe("invalidNumber");
  });

  it("rejects ambiguous thousands separators (e.g. 1.234,56)", () => {
    const res = calculateUnit({
      category: "length",
      fromUnit: "mm",
      toUnit: "m",
      value: "1.234,56",
    });
    expect(res.output).toBeNull();
    expect(res.errorKey).toBe("invalidNumber");
  });

  it("rejects empty or whitespace inputs", () => {
    const res = calculateUnit({
      category: "length",
      fromUnit: "mm",
      toUnit: "m",
      value: "   ",
    });
    expect(res.output).toBeNull();
    expect(res.errorKey).toBe("invalidNumber");
  });

  it("handles missing units", () => {
    const res = calculateUnit({
      category: "length",
      fromUnit: "unknown" as any,
      toUnit: "m",
      value: "100",
    });
    expect(res.output).toBeNull();
    expect(res.errorKey).toBe("missingUnits");
  });

  it("parses locale-formatted inputs when locale is provided", () => {
    // Turkish locale: 1.234,56 mm -> 1.23456 m
    const trRes = calculateUnit({
      category: "length",
      fromUnit: "mm",
      toUnit: "m",
      value: "1.234,56",
      locale: "tr",
    });
    expect(trRes.output).toBeCloseTo(1.23456, 5);
    expect(trRes.errorKey).toBeUndefined();

    // English locale: 1,234.56 mm -> 1.23456 m
    const enRes = calculateUnit({
      category: "length",
      fromUnit: "mm",
      toUnit: "m",
      value: "1,234.56",
      locale: "en",
    });
    expect(enRes.output).toBeCloseTo(1.23456, 5);
    expect(enRes.errorKey).toBeUndefined();

    // Cross-locale inputs are safely rejected
    const trMismatch = calculateUnit({
      category: "length",
      fromUnit: "mm",
      toUnit: "m",
      value: "1,234.56",
      locale: "tr",
    });
    expect(trMismatch.output).toBeNull();
    expect(trMismatch.errorKey).toBe("invalidNumber");
  });
});
