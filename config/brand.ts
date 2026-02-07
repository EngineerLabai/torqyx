import type { Locale } from "@/utils/locale";
import { DEFAULT_LOCALE } from "@/utils/locale";

export type BrandCopy = {
  siteName: string;
  description: string;
};

export const brandByLocale: Record<Locale, BrandCopy> = {
  tr: {
    siteName: "AI Engineers Lab",
    description: "Metodoloji odaklı mühendislik notları ve hesaplayıcılar.",
  },
  en: {
    siteName: "AI Engineers Lab",
    description: "Methodology-first engineering notes and calculators.",
  },
};

export const getBrandCopy = (locale: Locale) => brandByLocale[locale] ?? brandByLocale[DEFAULT_LOCALE];

export { DEFAULT_LOCALE };

export const BRAND_NAME = brandByLocale[DEFAULT_LOCALE].siteName;
export const BRAND_DESCRIPTION = brandByLocale[DEFAULT_LOCALE].description;
