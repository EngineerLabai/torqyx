import type { Locale } from "@/utils/locale";
import tr from "@/messages/tr.json";
import en from "@/messages/en.json";

export type Messages = typeof tr;

const messagesByLocale: Record<Locale, Messages> = {
  tr,
  en: en as Messages,
};

export const getMessages = (locale: Locale): Messages => messagesByLocale[locale] ?? messagesByLocale.tr;

export type MessageVars = Record<string, string | number>;

export const formatMessage = (template: string, vars?: MessageVars) => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = vars[key];
    return value === undefined || value === null ? match : String(value);
  });
};
