import type { Locale } from "@/utils/locale";

export type LocalizedValue<T> = T | { tr: T; en: T };

const isLocalizedRecord = <T,>(value: unknown): value is { tr: T; en: T } => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return "tr" in value && "en" in value;
};

export const resolveLocalizedValue = <T>(value: LocalizedValue<T> | undefined, locale: Locale) => {
  if (value === undefined) return undefined;
  if (isLocalizedRecord<T>(value)) {
    return value[locale];
  }
  return value as T;
};
