import type { Locale } from "@/utils/locale";
import { stripLocaleFromPath, withLocalePrefix } from "@/utils/locale-path";

const FALLBACK_SITE_URL = "https://torqyx.com";
const VERCEL_APP_HOST = "vercel.app";

type SiteUrlEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
  VERCEL_ENV?: string;
};

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

const isVercelAppHost = (host: string) => {
  const normalizedHost = host.toLowerCase();
  return normalizedHost === VERCEL_APP_HOST || normalizedHost.endsWith(`.${VERCEL_APP_HOST}`);
};

const isVercelAppUrl = (value: string) => {
  try {
    return isVercelAppHost(new URL(value).hostname);
  } catch {
    return false;
  }
};

export const resolveCanonicalSiteUrl = (env?: SiteUrlEnv) => {
  const source: SiteUrlEnv =
    env ?? {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      SITE_URL: process.env.SITE_URL,
      VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };
  const candidates = [
    source.NEXT_PUBLIC_SITE_URL,
    source.SITE_URL,
    source.VERCEL_PROJECT_PRODUCTION_URL,
    source.VERCEL_ENV === "production" ? FALLBACK_SITE_URL : source.VERCEL_URL,
    FALLBACK_SITE_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    try {
      const normalized = normalizeSiteUrl(candidate);
      if (!isVercelAppUrl(normalized)) {
        return normalized;
      }
    } catch {
      continue;
    }
  }

  return FALLBACK_SITE_URL;
};

const isExplicitlyFalseEnv = (value?: string) => {
  if (!value) return false;
  return ["0", "false", "no", "off"].includes(value.trim().toLowerCase());
};

export const SITE_URL = resolveCanonicalSiteUrl();
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

export const buildXDefaultCanonical = (path: string) =>
  buildLocalizedCanonical(stripLocaleFromPath(path), "tr") ?? SITE_URL;

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
