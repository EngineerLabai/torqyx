import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";

const normalizePath = (value: string) => {
  if (!value) return "/";
  const next = value.startsWith("/") ? value : `/${value}`;
  return next === "" ? "/" : next;
};

const isExternalPath = (value: string) => {
  const trimmed = value.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("#")
  );
};

export const getLocaleFromPathname = (pathname: string): Locale | null => {
  const normalized = normalizePath(pathname);
  const segment = normalized.split("/")[1];
  return isLocale(segment) ? segment : null;
};

export const stripLocaleFromPath = (pathname: string) => {
  const normalized = normalizePath(pathname);
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (isLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return normalized;
};

export const localePath = (locale: Locale, pathname: string) => {
  if (!pathname) return `/${locale}`;
  const trimmed = pathname.trim();
  if (!trimmed) return `/${locale}`;
  if (isExternalPath(trimmed)) return trimmed;
  const normalized = normalizePath(trimmed);
  if (getLocaleFromPathname(normalized)) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
};

export const withLocalePrefix = (pathname: string, locale: Locale = DEFAULT_LOCALE) => {
  const base = stripLocaleFromPath(pathname);
  return localePath(locale, base);
};
