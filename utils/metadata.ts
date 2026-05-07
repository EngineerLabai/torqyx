import type { Metadata } from "next";
import { getBrandCopy } from "@/config/brand";
import type { Locale } from "@/utils/locale";
import { DEFAULT_OG_IMAGE_META, buildCanonical, buildLanguageAlternates, buildLocalizedCanonical } from "@/utils/seo";

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
  useLocalizedCanonical?: boolean;
};

const TITLE_MAX_LENGTH = 60;
const TITLE_TEMPLATE_SUFFIX = " | TORQYX";
const DESCRIPTION_MIN_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 155;

const SEO_KEYWORD_BY_LOCALE: Record<Locale, string> = {
  tr: "mühendislik hesaplayıcıları",
  en: "engineering calculators",
};

const DESCRIPTION_SUFFIX_BY_LOCALE: Record<Locale, string> = {
  tr: " Standartlar, hesap adımları ve pratik raporlarla hızlı karar desteği sunar.",
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

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeTitle = (title: string, locale: Locale) => {
  const siteName = getBrandCopy(locale).siteName;
  const cleanTitle = title.trim();
  const baseTitle = cleanTitle.length > 0 && !/^untitled$/i.test(cleanTitle) ? cleanTitle : siteName;
  const suffixPattern = new RegExp(`\\s*(?:\\||-|—)\\s*${escapeRegExp(siteName)}$`, "i");
  const normalized = baseTitle.replace(suffixPattern, "").trim() || siteName;
  const maxLength = normalized.toLowerCase() === siteName.toLowerCase()
    ? TITLE_MAX_LENGTH
    : Math.max(20, TITLE_MAX_LENGTH - TITLE_TEMPLATE_SUFFIX.length);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const clippedTitle = trimToWordBoundary(normalized, maxLength);
  return clippedTitle.length > maxLength ? clippedTitle.slice(0, maxLength).trimEnd() : clippedTitle;
};

const normalizeDescription = (description: string | undefined, locale: Locale) => {
  const keyword = SEO_KEYWORD_BY_LOCALE[locale];
  const fallbackByLocale: Record<Locale, string> = {
    tr: `TORQYX, ${keyword} ve mühendislik standartlari ile teknik analiz, dogrulama ve raporlama surecini tek yerde toplar.`,
    en: `TORQYX combines ${keyword}, engineering standards, technical analysis, validation, and reporting in one place.`,
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
  useLocalizedCanonical = false,
}: PageMetadataOptions): Metadata => {
  const normalizedTitle = normalizeTitle(title, locale);
  const normalizedDescription = normalizeDescription(description, locale);
  const canonical = useLocalizedCanonical
    ? buildLocalizedCanonical(path, locale)
    : buildCanonical(path) ?? path;
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
