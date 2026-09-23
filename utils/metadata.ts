import type { Metadata } from "next";
import { getBrandCopy } from "@/config/brand";
import type { Locale } from "@/utils/locale";
import {
  DEFAULT_OG_IMAGE_META,
  buildCanonical,
  buildLanguageAlternates,
  buildLocalizedCanonical,
  buildOgImageMeta,
} from "@/utils/seo";

type PageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  locale: Locale;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
  robots?: Metadata["robots"];
  image?: typeof DEFAULT_OG_IMAGE_META;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
  alternatesLanguages?: NonNullable<Metadata["alternates"]> extends { languages?: infer L } ? L | null : null;
  useLocalizedCanonical?: boolean;
  absoluteTitle?: boolean;
};

const TITLE_MAX_LENGTH = 60;
const TITLE_TEMPLATE_SUFFIX = " | TORQYX";
const DESCRIPTION_MAX_LENGTH = 155;

export const NOINDEX_FOLLOW_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
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

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const ensureSentenceEnd = (value: string) => {
  const trimmed = value.trim().replace(/[,:;]+$/g, "");
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

const clampDescription = (value: string) => {
  if (value.length <= DESCRIPTION_MAX_LENGTH) return ensureSentenceEnd(value);
  const clipped = trimToWordBoundary(value, DESCRIPTION_MAX_LENGTH - 1);
  return ensureSentenceEnd(clipped);
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
  const fallbackByLocale: Record<Locale, string> = {
    tr: "TORQYX; mühendislik hesapları, teknik referanslar ve doğrulama için tek bir çalışma alanı sunar.",
    en: "TORQYX combines engineering calculations, technical references, and validation in one workspace.",
  };

  let normalized = normalizeWhitespace(description ?? "");
  if (!normalized || /^untitled$/i.test(normalized)) {
    normalized = fallbackByLocale[locale];
  }

  // Accurate short descriptions are better than a repeated SEO suffix.
  return clampDescription(normalized);
};

export const buildPageMetadata = ({
  title,
  description,
  path,
  locale,
  type = "website",
  keywords,
  noIndex = false,
  robots,
  image,
  openGraph,
  twitter,
  alternatesLanguages: alternatesLanguagesArg,
  useLocalizedCanonical = true,
  absoluteTitle = false,
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
  const resolvedImage =
    image ??
    buildOgImageMeta({
      title: normalizedTitle,
      description: normalizedDescription,
      locale,
      path,
    });
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
    title: absoluteTitle ? { absolute: normalizedTitle } : normalizedTitle,
    description: normalizedDescription,
    keywords,
    robots:
      robots ??
      (noIndex
        ? {
            index: false,
            follow: false,
            googleBot: {
              index: false,
              follow: false,
            },
          }
        : undefined),
    alternates,
    openGraph: openGraphMeta,
    twitter: twitterMeta,
  };
};
