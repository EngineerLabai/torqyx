import type { Locale } from "@/utils/locale";

const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  tr: {
    Mechanical: "Mekanik",
    Automotive: "Otomotiv",
    "General Engineering": "Genel Mühendislik",
  },
  en: {
    Mechanical: "Mechanical",
    Automotive: "Automotive",
    "General Engineering": "General Engineering",
  },
};

export const categoryLabels = (locale: Locale) => CATEGORY_LABELS[locale];
