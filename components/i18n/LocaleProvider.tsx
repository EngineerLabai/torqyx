"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_STORAGE_KEY, isLocale, type Locale } from "@/utils/locale";
import { getLocaleFromPathname } from "@/utils/locale-path";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function LocaleProvider({ children, initialLocale = DEFAULT_LOCALE }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const pathname = usePathname();
  const pathLocale = pathname ? getLocaleFromPathname(pathname) : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathLocale) return;
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) {
      Promise.resolve().then(() => setLocale(stored));
    }
  }, [pathLocale]);

  useEffect(() => {
    if (!pathLocale || pathLocale === locale) return;
    Promise.resolve().then(() => setLocale(pathLocale));
  }, [pathLocale, locale]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
