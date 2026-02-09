import type { Locale } from "@/utils/locale";

export type SearchIndexItemType = "tool" | "standard" | "reference" | "blog" | "guide" | "glossary";

export type SearchIndexLocaleTitles = Partial<Record<Locale, string>>;

export type SearchIndexItem = {
  id: string;
  type: SearchIndexItemType;
  title: string;
  description?: string;
  href: string;
  searchText: string;
  tags?: string[];
  keywords?: string[];
  localeTitles?: SearchIndexLocaleTitles;
};

export type SearchIndexData = {
  locale: Locale;
  updatedAt: string;
  items: SearchIndexItem[];
};

export const normalizeSearchText = (value: string) => {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/ı/g, "i")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const buildSearchText = (...parts: Array<string | undefined | null>) => {
  return normalizeSearchText(parts.filter(Boolean).join(" "));
};
