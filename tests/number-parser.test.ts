import { describe, it, expect } from "vitest";
import { parseEngineeringNumber } from "@/utils/number-parser";

describe("parseEngineeringNumber", () => {
  it("parses valid dot and comma decimal strings", () => {
    expect(parseEngineeringNumber("12.5")).toBe(12.5);
    expect(parseEngineeringNumber("12,5")).toBe(12.5);
    expect(parseEngineeringNumber("-0.75")).toBe(-0.75);
    expect(parseEngineeringNumber("-0,75")).toBe(-0.75);
    expect(parseEngineeringNumber("0")).toBe(0);
    expect(parseEngineeringNumber("42")).toBe(42);
  });

  it("parses leading decimal point or comma", () => {
    expect(parseEngineeringNumber(".5")).toBe(0.5);
    expect(parseEngineeringNumber(",5")).toBe(0.5);
    expect(parseEngineeringNumber("-.5")).toBe(-0.5);
    expect(parseEngineeringNumber("-,5")).toBe(-0.5);
  });

  it("parses scientific notation", () => {
    expect(parseEngineeringNumber("1e3")).toBe(1000);
    expect(parseEngineeringNumber("1.5e-3")).toBe(0.0015);
    expect(parseEngineeringNumber("1,5e-3")).toBe(0.0015);
    expect(parseEngineeringNumber("-2e2")).toBe(-200);
  });

  it("handles numeric inputs directly", () => {
    expect(parseEngineeringNumber(12.5)).toBe(12.5);
    expect(parseEngineeringNumber(0)).toBe(0);
    expect(parseEngineeringNumber(-42)).toBe(-42);
  });

  it("rejects strings with trailing units or alphabetic junk", () => {
    expect(parseEngineeringNumber("12,5abc")).toBeNull();
    expect(parseEngineeringNumber("12.5mm")).toBeNull();
    expect(parseEngineeringNumber("100 kN")).toBeNull();
    expect(parseEngineeringNumber("N100")).toBeNull();
  });

  it("rejects ambiguous thousands separators or mixed separators", () => {
    expect(parseEngineeringNumber("1.234,56")).toBeNull();
    expect(parseEngineeringNumber("1,234.56")).toBeNull();
    expect(parseEngineeringNumber("1 234.56")).toBeNull();
    expect(parseEngineeringNumber("1.000.000")).toBeNull();
    expect(parseEngineeringNumber("1,000,000")).toBeNull();
  });

  it("rejects multiple consecutive separators", () => {
    expect(parseEngineeringNumber("1..5")).toBeNull();
    expect(parseEngineeringNumber("1,,5")).toBeNull();
    expect(parseEngineeringNumber("1.,5")).toBeNull();
    expect(parseEngineeringNumber("1,.5")).toBeNull();
  });

  it("rejects empty or whitespace-only inputs", () => {
    expect(parseEngineeringNumber("")).toBeNull();
    expect(parseEngineeringNumber("   ")).toBeNull();
    expect(parseEngineeringNumber("\t\n")).toBeNull();
    expect(parseEngineeringNumber(null)).toBeNull();
    expect(parseEngineeringNumber(undefined)).toBeNull();
  });

  it("rejects non-finite values and overflows", () => {
    expect(parseEngineeringNumber(NaN)).toBeNull();
    expect(parseEngineeringNumber(Infinity)).toBeNull();
    expect(parseEngineeringNumber(-Infinity)).toBeNull();
    expect(parseEngineeringNumber("NaN")).toBeNull();
    expect(parseEngineeringNumber("Infinity")).toBeNull();
    expect(parseEngineeringNumber("1e999")).toBeNull();
  });

  it("parses valid thousands grouping when locale is explicitly provided", () => {
    // Turkish locale: '.' is thousands, ',' is decimal
    expect(parseEngineeringNumber("1.234,56", { locale: "tr" })).toBe(1234.56);
    expect(parseEngineeringNumber("1.000.000", { locale: "tr" })).toBe(1000000);
    expect(parseEngineeringNumber("1.000.000,50", { locale: "tr" })).toBe(1000000.5);
    expect(parseEngineeringNumber("-1.234,56", { locale: "tr" })).toBe(-1234.56);

    // English locale: ',' is thousands, '.' is decimal
    expect(parseEngineeringNumber("1,234.56", { locale: "en" })).toBe(1234.56);
    expect(parseEngineeringNumber("1,000,000", { locale: "en" })).toBe(1000000);
    expect(parseEngineeringNumber("1,000,000.50", { locale: "en" })).toBe(1000000.5);
    expect(parseEngineeringNumber("-1,234.56", { locale: "en" })).toBe(-1234.56);

    // Rejects cross-locale or ill-formed groupings
    expect(parseEngineeringNumber("1,234.56", { locale: "tr" })).toBeNull();
    expect(parseEngineeringNumber("1.234,56", { locale: "en" })).toBeNull();
    expect(parseEngineeringNumber("1.23.4", { locale: "tr" })).toBeNull();
    expect(parseEngineeringNumber("1,23,4", { locale: "en" })).toBeNull();

    // Standard decimals still parse regardless of locale
    expect(parseEngineeringNumber("12,5", { locale: "tr" })).toBe(12.5);
    expect(parseEngineeringNumber("12.5", { locale: "tr" })).toBe(12.5);
    expect(parseEngineeringNumber("12.5", { locale: "en" })).toBe(12.5);
    expect(parseEngineeringNumber("12,5", { locale: "en" })).toBe(12.5);
  });
});
