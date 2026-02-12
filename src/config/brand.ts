import type { Locale } from "@/utils/locale";
import { DEFAULT_LOCALE } from "@/utils/locale";

export type BrandConfig = {
  siteName: string;
  taglineTR: string;
  taglineEN: string;
  brandStoryTR: string;
  brandStoryEN: string;
  disclaimerTR: string;
  disclaimerEN: string;
};

export type BrandCopy = {
  siteName: string;
  tagline: string;
  brandStory: string;
  disclaimer: string;
};

export const brandConfig: BrandConfig = {
  siteName: "AI Engineers Lab",
  taglineTR: "Deterministik mühendislik hesaplayıcıları, standartlar ve raporlama.",
  taglineEN: "Deterministic engineering calculators, standards, and reporting.",
  brandStoryTR:
    "AI Engineers Lab, mekanik tasarım ve üretim kararları için mühendisler tarafından geliştirilen deterministik bir araç setidir. Buradaki “AI”, Applied Intelligence / Analysis & Insights anlamına gelir: standartları derler, doğrulama adımlarını görünür kılar ve rapor çıktısını otomatikleştirir.\n\nHesaplayıcılar ISO/DIN/ASME standartları, mühendislik el kitapları ve üretici veri sayfalarından derlenen yöntemleri temel alır. Her sonuç, girdiler ve varsayımlar üzerinden şeffaf biçimde izlenebilir.",
  brandStoryEN:
    "AI Engineers Lab is a deterministic engineering toolkit built by engineers for mechanical design and manufacturing decisions. Here “AI” means Applied Intelligence / Analysis & Insights: curated standards, visible validation checks, and automated reporting.\n\nCalculators are grounded in ISO/DIN/ASME standards, engineering handbooks, and manufacturer datasheets. Every result is traceable to its inputs and assumptions.",
  disclaimerTR:
    "Bu platform eğitim ve ön tasarım amaçlıdır; kritik uygulamalarda resmi standartlar ve üretici verileri esas alınmalıdır. Sonuçlar; malzeme, emniyet katsayıları, çalışma koşulları ve üretim toleranslarına göre değişebilir. Profesyonel mühendislik onayı veya sertifikasyon yerine geçmez.",
  disclaimerEN:
    "This platform is for education and preliminary design; official standards and manufacturer data must be used for critical applications. Results may vary with material, safety factors, operating conditions, and manufacturing tolerances. It does not replace professional engineering approval or certification.",
};

export const getBrandCopy = (locale: Locale): BrandCopy => {
  const isTr = locale === "tr";
  return {
    siteName: brandConfig.siteName,
    tagline: isTr ? brandConfig.taglineTR : brandConfig.taglineEN,
    brandStory: isTr ? brandConfig.brandStoryTR : brandConfig.brandStoryEN,
    disclaimer: isTr ? brandConfig.disclaimerTR : brandConfig.disclaimerEN,
  };
};

export { DEFAULT_LOCALE };

export const BRAND_NAME = brandConfig.siteName;
export const BRAND_TAGLINE = getBrandCopy(DEFAULT_LOCALE).tagline;
export const BRAND_DESCRIPTION = BRAND_TAGLINE;
