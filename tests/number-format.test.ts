import { describe, expect, it } from "vitest";
import { formatNumber, formatNumberFixed } from "@/utils/number-format";

describe("number formatting for tr and en locales", () => {
  it("formats decimal separators correctly for TR and EN", () => {
    const value = 1234.56;

    const trFormatted = formatNumberFixed(value, "tr", 2);
    const enFormatted = formatNumberFixed(value, "en", 2);

    // In Turkish (tr-TR), comma is decimal separator and dot is thousands separator
    expect(trFormatted).toContain(",");
    expect(trFormatted).toBe("1.234,56");

    // In English (en-US), dot is decimal separator and comma is thousands separator
    expect(enFormatted).toContain(".");
    expect(enFormatted).toBe("1,234.56");
  });

  it("handles null, undefined, and non-finite values gracefully with fallback", () => {
    expect(formatNumber(null, "tr")).toBe("-");
    expect(formatNumber(undefined, "en")).toBe("-");
    expect(formatNumber(Number.NaN, "tr")).toBe("-");
    expect(formatNumber(Number.POSITIVE_INFINITY, "en")).toBe("-");
    expect(formatNumber(null, "tr", {}, "N/A")).toBe("N/A");
  });

  it("formats integer and zero values properly", () => {
    expect(formatNumberFixed(0, "tr", 2)).toBe("0,00");
    expect(formatNumberFixed(0, "en", 2)).toBe("0.00");
    expect(formatNumber(500, "tr")).toBe("500");
    expect(formatNumber(500, "en")).toBe("500");
  });
});
