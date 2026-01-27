export type Locale = "tr" | "en";

export const DEFAULT_LOCALE: Locale = "tr";
export const LOCALE_COOKIE = "aiel_locale";
export const LOCALE_STORAGE_KEY = "aiel:locale";

export const isLocale = (value?: string | null): value is Locale => value === "tr" || value === "en";
