import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";

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
  const envSiteUrl =
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "localhost:3000";

  try {
    return normalizeSiteUrl(envSiteUrl);
  } catch {
    return "https://localhost:3000";
  }
};

export const SITE_URL = resolveSiteUrl();
export const CANONICAL_SITE_URL = "https://aiengineerslab.vercel.app";

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

export const buildLanguageAlternates = (path: string) => ({
  tr: buildLocalizedCanonical(path, "tr"),
  en: buildLocalizedCanonical(path, "en"),
});

export const DEFAULT_OG_IMAGE = new URL("/og-image.png", CANONICAL_SITE_URL).toString();
export const DEFAULT_OG_IMAGE_META = {
  url: DEFAULT_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: "AI Engineers Lab — Mühendislik Hesaplayıcıları",
};
