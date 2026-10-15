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
});
