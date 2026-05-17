import type { Locale } from "@/utils/locale";
import { stripLocaleFromPath, withLocalePrefix } from "@/utils/locale-path";

const FALLBACK_SITE_URL = "https://torqyx.com";

const ensureProtocol = (value: string) => (/^https?:\/\//i.test(value) ? value : `https://${value}`);

const normalizeSiteUrl = (value: string) => {
  const parsed = new URL(ensureProtocol(value.trim()));
  parsed.protocol = "https:";
  parsed.hostname = parsed.hostname.replace(/^www\./i, "");
  parsed.pathname = "";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
};

const resolveSiteUrl = () => {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  const vercelSiteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const envSiteUrl =
    explicitSiteUrl ??
    (process.env.VERCEL_ENV === "production" ? FALLBACK_SITE_URL : vercelSiteUrl) ??
    FALLBACK_SITE_URL;

  try {
    return normalizeSiteUrl(envSiteUrl);
  } catch {
    return FALLBACK_SITE_URL;
  }
};

const isExplicitlyFalseEnv = (value?: string) => {
  if (!value) return false;
  return ["0", "false", "no", "off"].includes(value.trim().toLowerCase());
};

export const SITE_URL = resolveSiteUrl();
export const CANONICAL_SITE_URL = SITE_URL;
export const IS_INDEXING_ENABLED = !isExplicitlyFalseEnv(process.env.INDEX_SITE ?? process.env.NEXT_PUBLIC_INDEX_SITE);

export const buildCanonical = (path: string) => {
  try {
    return new URL(path, CANONICAL_SITE_URL).toString();
  } catch {
    return undefined;
  }
};

export const buildLocalizedPath = (path: string, locale: Locale) => withLocalePrefix(path, locale);

export const buildLocalizedCanonical = (path: string, locale: Locale) =>
  buildCanonical(buildLocalizedPath(path, locale)) ?? buildLocalizedPath(path, locale);

export const buildXDefaultCanonical = (path: string) => buildCanonical(stripLocaleFromPath(path)) ?? SITE_URL;

export const buildLanguageAlternates = (path: string) => ({
  tr: buildLocalizedCanonical(path, "tr"),
  en: buildLocalizedCanonical(path, "en"),
  "x-default": buildXDefaultCanonical(path),
});

export const DEFAULT_OG_IMAGE = new URL("/og-image.png", CANONICAL_SITE_URL).toString();
export const DEFAULT_OG_IMAGE_META = {
  url: DEFAULT_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: "TORQYX engineering calculators",
};

type OgImageOptions = {
  title: string;
  description?: string;
  locale: Locale;
  path?: string;
};

const trimOgParam = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1).trimEnd()}...` : normalized;
};

export const buildOgImageUrl = ({ title, description, locale, path }: OgImageOptions) => {
  const url = new URL("/og", CANONICAL_SITE_URL);
  url.searchParams.set("locale", locale);
  url.searchParams.set("title", trimOgParam(title, 96));

  if (description) {
    url.searchParams.set("subtitle", trimOgParam(description, 132));
  }

  if (path) {
    url.searchParams.set("path", path);
  }

  return url.toString();
};

export const buildOgImageMeta = (options: OgImageOptions) => ({
  url: buildOgImageUrl(options),
  width: 1200,
  height: 630,
  alt: `${options.title} - TORQYX`,
});
