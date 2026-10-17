const STRICT_DECIMAL_REGEX = /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?$/;
const TR_THOUSANDS_REGEX = /^[+-]?(?:\d{1,3}(?:\.\d{3})+(?:,\d+)?)$/;
const EN_THOUSANDS_REGEX = /^[+-]?(?:\d{1,3}(?:,\d{3})+(?:\.\d+)?)$/;

export type ParseEngineeringNumberOptions = {
  locale?: "tr" | "en";
};

/**
 * Parses an engineering input value into a finite number.
 *
 * Supported formats:
 * - Standard decimal: "12.5", "-0.75"
 * - Comma decimal (Turkish/European): "12,5", "-0,75"
 * - Leading decimal: ".5", ",5"
 * - Scientific notation: "1.5e-3", "2e6"
 * - Direct numbers: 12.5, -3
 * - Locale-aware thousands separators (when locale option is provided):
 *     "1.234,56" with { locale: "tr" } -> 1234.56
 *     "1,234.56" with { locale: "en" } -> 1234.56
 *
 * Intentionally rejected (returns null):
 * - Trailing characters or unit suffixes: "12,5abc", "100mm"
 * - Ambiguous inputs when locale is unknown: "1.234,56", "1,234.56"
 * - Ill-formed thousands separators: "1.23.4", "1,,5"
 * - Empty or whitespace-only strings: "", "   "
 * - Non-finite numbers: NaN, Infinity, -Infinity
 * - Extreme out-of-range overflows that produce Infinity
 */
export function parseEngineeringNumber(
  value: unknown,
  options?: ParseEngineeringNumberOptions,
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  // Handle explicit locale-formatted numbers with valid thousands grouping
  if (options?.locale === "tr" && TR_THOUSANDS_REGEX.test(trimmed)) {
    const normalized = trimmed.replace(/\./g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (options?.locale === "en" && EN_THOUSANDS_REGEX.test(trimmed)) {
    const normalized = trimmed.replace(/,/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  // Standard strict decimal validation (unambiguous format)
  if (!STRICT_DECIMAL_REGEX.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}
