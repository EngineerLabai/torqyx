import type { Metadata } from "next";
import { getBrandCopy } from "@/config/brand";
import type { Locale } from "@/utils/locale";
import { DEFAULT_OG_IMAGE_META, buildLanguageAlternates, buildLocalizedCanonical } from "@/utils/seo";

type PageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  locale: Locale;
  type?: "website" | "article";
  keywords?: string[];
  image?: typeof DEFAULT_OG_IMAGE_META;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
  alternatesLanguages?: NonNullable<Metadata["alternates"]> extends { languages?: infer L } ? L | null : null;
};

const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MIN_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 155;

const SEO_KEYWORD_BY_LOCALE: Record<Locale, string> = {
  tr: "muhendislik hesaplayicilari",
  en: "engineering calculators",
};

const DESCRIPTION_SUFFIX_BY_LOCALE: Record<Locale, string> = {
  tr: " Standartlar, hesap adimlari ve pratik raporlarla hizli karar destegi sunar.",
  en: " It includes standards, calculation steps, and practical reports for faster decisions.",
};

const trimToWordBoundary = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  const sliced = value.slice(0, maxLength + 1);
  const lastSpace = sliced.lastIndexOf(" ");
  if (lastSpace > 20) {
    return sliced.slice(0, lastSpace).trimEnd();
  }
  return value.slice(0, maxLength).trimEnd();
};

const normalizeTitle = (title: string, locale: Locale) => {
  const siteName = getBrandCopy(locale).siteName;
  const cleanTitle = title.trim();
  const baseTitle = cleanTitle.length > 0 && !/^untitled$/i.test(cleanTitle) ? cleanTitle : siteName;
  const hasTemplate = baseTitle.includes("|");
  const suffix = ` | ${siteName}`;
  let normalized = hasTemplate ? baseTitle : `${baseTitle}${suffix}`;

  if (normalized.length <= TITLE_MAX_LENGTH) {
    return normalized;
  }

  const maxPageNameLength = Math.max(8, TITLE_MAX_LENGTH - suffix.length);
  const pageName = baseTitle.split("|")[0]?.trim() ?? baseTitle;
  const clippedPageName = trimToWordBoundary(pageName, maxPageNameLength);
  normalized = `${clippedPageName}${suffix}`;
  return normalized.length > TITLE_MAX_LENGTH ? normalized.slice(0, TITLE_MAX_LENGTH).trimEnd() : normalized;
};

const normalizeDescription = (description: string | undefined, locale: Locale) => {
  const keyword = SEO_KEYWORD_BY_LOCALE[locale];
  const fallbackByLocale: Record<Locale, string> = {
    tr: `AI Engineers Lab, ${keyword} ve muhendislik standartlari ile teknik analiz, dogrulama ve raporlama surecini tek yerde toplar.`,
    en: `AI Engineers Lab combines ${keyword}, engineering standards, technical analysis, validation, and reporting in one place.`,
  };

  let normalized = (description ?? "").trim();
  if (!normalized || /^untitled$/i.test(normalized)) {
    normalized = fallbackByLocale[locale];
  }

  if (!normalized.toLowerCase().includes(keyword)) {
    normalized = `${normalized} ${keyword}.`;
  }

  while (normalized.length < DESCRIPTION_MIN_LENGTH) {
    const next = `${normalized}${DESCRIPTION_SUFFIX_BY_LOCALE[locale]}`;
    if (next.length === normalized.length) {
      break;
    }
    normalized = next;
  }

  if (normalized.length > DESCRIPTION_MAX_LENGTH) {
    normalized = trimToWordBoundary(normalized, DESCRIPTION_MAX_LENGTH);
  }

  return normalized;
};

export const buildPageMetadata = ({
  title,
  description,
  path,
  locale,
  type = "website",
  keywords,
  image,
  openGraph,
  twitter,
  alternatesLanguages: alternatesLanguagesArg,
}: PageMetadataOptions): Metadata => {
  const normalizedTitle = normalizeTitle(title, locale);
  const normalizedDescription = normalizeDescription(description, locale);
  const canonical = buildLocalizedCanonical(path, locale);
  const alternatesLanguages = alternatesLanguagesArg === undefined ? buildLanguageAlternates(path) : alternatesLanguagesArg;
  const alternates = {
    canonical,
    ...(alternatesLanguages ? { languages: alternatesLanguages } : {}),
  };
  const resolvedImage = image ?? DEFAULT_OG_IMAGE_META;
  const openGraphMeta: Metadata["openGraph"] = {
    title: normalizedTitle,
    description: normalizedDescription,
    type,
    url: canonical,
    images: [resolvedImage],
    locale: locale === "tr" ? "tr_TR" : "en_US",
    ...openGraph,
  };
  const twitterMeta: Metadata["twitter"] = {
    card: "summary_large_image",
    title: normalizedTitle,
    description: normalizedDescription,
    images: [resolvedImage.url],
    ...twitter,
  };

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    keywords,
    alternates,
    openGraph: openGraphMeta,
    twitter: twitterMeta,
  };
};
