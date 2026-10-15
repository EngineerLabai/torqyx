const STRICT_DECIMAL_REGEX = /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?$/;

/**
 * Parses an engineering input value into a finite number.
 *
 * Supported formats:
 * - Standard decimal: "12.5", "-0.75"
 * - Comma decimal (Turkish/European): "12,5", "-0,75"
 * - Leading decimal: ".5", ",5"
 * - Scientific notation: "1.5e-3", "2e6"
 * - Direct numbers: 12.5, -3
 *
 * Intentionally rejected (returns null):
 * - Trailing characters or unit suffixes: "12,5abc", "100mm"
 * - Ambiguous inputs with thousands separators or multiple separators: "1.234,56", "1,234.56", "1.2.3"
 * - Empty or whitespace-only strings: "", "   "
 * - Non-finite numbers: NaN, Infinity, -Infinity
 * - Extreme out-of-range overflows that produce Infinity
 */
export function parseEngineeringNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !STRICT_DECIMAL_REGEX.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}
