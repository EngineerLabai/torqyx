import type { Locale } from "@/utils/locale";

const TURKISH_CHAR_REGEX = /[ğĞüÜşŞıİöÖçÇ]/;

export function assertNoTurkish(locale: Locale, value: unknown, context: string) {
  if (process.env.NODE_ENV === "production") return;
  if (locale !== "en") return;
  const payload = JSON.stringify(value);
  if (payload && TURKISH_CHAR_REGEX.test(payload)) {
    throw new Error(`[i18n] Turkish copy detected in EN locale for ${context}.`);
  }
}
