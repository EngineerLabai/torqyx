import { DEFAULT_LOCALE, getBrandCopy } from "@/config/brand";
import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiengineerslab.com";

export const buildCanonical = (path: string) => {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return undefined;
  }
};

export const buildLocalizedPath = (path: string, locale: Locale) => withLocalePrefix(path, locale);

export const buildLocalizedCanonical = (path: string, locale: Locale) =>
  buildCanonical(buildLocalizedPath(path, locale)) ?? buildLocalizedPath(path, locale);

export const buildLanguageAlternates = (path: string) => ({
  tr: buildLocalizedCanonical(path, "tr"),
  en: buildLocalizedCanonical(path, "en"),
});

export const DEFAULT_OG_IMAGE = new URL("/og-default.png", SITE_URL).toString();
export const DEFAULT_OG_IMAGE_META = {
  url: DEFAULT_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: getBrandCopy(DEFAULT_LOCALE).siteName,
};
