import type { Locale } from "@/utils/locale";

const LOCALE_MAP: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
};

export const getNumberLocale = (locale: Locale) => LOCALE_MAP[locale] ?? LOCALE_MAP.tr;

export const formatNumber = (
  value: number | null | undefined,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
  fallback = "-",
) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return fallback;
  return new Intl.NumberFormat(getNumberLocale(locale), options).format(value);
};

export const formatNumberFixed = (
  value: number | null | undefined,
  locale: Locale,
  digits: number,
  options: Intl.NumberFormatOptions = {},
  fallback = "-",
) =>
  formatNumber(
    value,
    locale,
    {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      ...options,
    },
    fallback,
  );
