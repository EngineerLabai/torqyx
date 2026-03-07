import type { Locale } from "@/utils/locale";
import tr from "@/messages/tr.json";
import en from "@/messages/en.json";
import { runTrTextQualitySmokeTest } from "@/utils/tr-text-quality";

export type Messages = typeof tr;

const messagesByLocale: Record<Locale, Messages> = {
  tr,
  en: en as Messages,
};

let didRunTrTextQualitySmokeTest = false;

const maybeRunTrTextQualitySmokeTest = (locale: Locale) => {
  if (process.env.NODE_ENV === "production") return;
  if (locale !== "tr") return;
  if (didRunTrTextQualitySmokeTest) return;
  didRunTrTextQualitySmokeTest = true;
  runTrTextQualitySmokeTest(messagesByLocale.tr);
};

export const getMessages = (locale: Locale): Messages => {
  maybeRunTrTextQualitySmokeTest(locale);
  return messagesByLocale[locale] ?? messagesByLocale.tr;
};

export type MessageVars = Record<string, string | number>;

export const formatMessage = (template: string, vars?: MessageVars) => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = vars[key];
    return value === undefined || value === null ? match : String(value);
  });
};
