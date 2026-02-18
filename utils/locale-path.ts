import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";

const normalizePath = (value: string) => {
  if (!value) return "/";
  const next = value.startsWith("/") ? value : `/${value}`;
  if (next.length > 1 && next.endsWith("/")) {
    return next.replace(/\/+$/g, "");
  }
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

const LOCALE_PUBLIC_ALIASES = {
  tr: {
    "/hakkinda": "/hakkinda",
    "/gizlilik": "/gizlilik",
    "/cerez-politikasi": "/cerez-politikasi",
    "/kullanim-sartlari": "/kullanim-sartlari",
    "/iletisim": "/iletisim",
  },
  en: {
    "/hakkinda": "/about",
    "/gizlilik": "/privacy",
    "/cerez-politikasi": "/cookies",
    "/kullanim-sartlari": "/terms",
    "/iletisim": "/contact",
  },
} as const satisfies Record<Locale, Record<string, string>>;

const INTERNAL_ALIAS_LOOKUP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const locale of Object.keys(LOCALE_PUBLIC_ALIASES) as Locale[]) {
    const localeAliases = LOCALE_PUBLIC_ALIASES[locale];
    for (const [internalPath, publicPath] of Object.entries(localeAliases)) {
      const normalizedInternalPath = normalizePath(internalPath);
      const normalizedPublicPath = normalizePath(publicPath);
      map[normalizedInternalPath] = normalizedInternalPath;
      map[normalizedPublicPath] = normalizedInternalPath;
    }
  }
  return map;
})();

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

export const resolveInternalPath = (pathname: string) => {
  const normalized = stripLocaleFromPath(pathname);
  return INTERNAL_ALIAS_LOOKUP[normalized] ?? normalized;
};

export const resolveLocalePublicPath = (locale: Locale, pathname: string) => {
  const internalPath = resolveInternalPath(pathname);
  const localeAliases = LOCALE_PUBLIC_ALIASES[locale] as Record<string, string>;
  return localeAliases[internalPath] ?? internalPath;
};

export const localePath = (locale: Locale, pathname: string) => {
  if (!pathname) return `/${locale}`;
  const trimmed = pathname.trim();
  if (!trimmed) return `/${locale}`;
  if (isExternalPath(trimmed)) return trimmed;
  const normalized = normalizePath(trimmed);
  const prefixedLocale = getLocaleFromPathname(normalized);
  const targetLocale = prefixedLocale ?? locale;
  const localizedBasePath = resolveLocalePublicPath(targetLocale, normalized);
  if (localizedBasePath === "/") return `/${targetLocale}`;
  return `/${targetLocale}${localizedBasePath}`;
};

export const withLocalePrefix = (pathname: string, locale: Locale = DEFAULT_LOCALE) => {
  const base = stripLocaleFromPath(pathname);
  return localePath(locale, base);
};
