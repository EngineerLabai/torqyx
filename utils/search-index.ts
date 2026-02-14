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

const TURKISH_CHAR_MAP: Record<string, string> = {
  "\u0131": "i",
  "\u0130": "i",
  "\u00e7": "c",
  "\u00c7": "c",
  "\u011f": "g",
  "\u011e": "g",
  "\u00f6": "o",
  "\u00d6": "o",
  "\u015f": "s",
  "\u015e": "s",
  "\u00fc": "u",
  "\u00dc": "u",
};

const STEM_SUFFIXES_TR = [
  "lar",
  "ler",
  "nin",
  "n\u0131n",
  "nun",
  "n\u00fcn",
  "den",
  "dan",
  "ten",
  "tan",
  "dir",
  "d\u0131r",
  "dur",
  "d\u00fcr",
  "lik",
  "l\u0131k",
  "luk",
  "l\u00fck",
  "siz",
  "s\u0131z",
  "suz",
  "s\u00fcz",
  "sel",
  "sal",
];

const STEM_SUFFIXES_EN = ["ingly", "edly", "ation", "ments", "ment", "ings", "ing", "ied", "ies", "ed", "es", "s"];

const foldTurkishChars = (value: string) =>
  value.replace(/[\u0131\u0130\u00e7\u00c7\u011f\u011e\u00f6\u00d6\u015f\u015e\u00fc\u00dc]/g, (char) => TURKISH_CHAR_MAP[char] ?? char);

export const normalizeSearchText = (value: string) => {
  if (!value) return "";
  return foldTurkishChars(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const stemToken = (token: string) => {
  if (token.length < 4) return token;

  let stemmed = token;
  for (const suffix of STEM_SUFFIXES_TR) {
    if (stemmed.endsWith(suffix) && stemmed.length - suffix.length >= 3) {
      stemmed = stemmed.slice(0, -suffix.length);
      break;
    }
  }

  for (const suffix of STEM_SUFFIXES_EN) {
    if (stemmed.endsWith(suffix) && stemmed.length - suffix.length >= 3) {
      stemmed = stemmed.slice(0, -suffix.length);
      break;
    }
  }

  return stemmed;
};

export const tokenizeSearchText = (value: string) => {
  const normalized = normalizeSearchText(value);
  if (!normalized) return [] as string[];

  const tokens = normalized.split(" ").filter(Boolean);
  const expanded = tokens.flatMap((token) => {
    const stem = stemToken(token);
    return stem === token ? [token] : [token, stem];
  });
  return Array.from(new Set(expanded));
};

export const buildSearchNeedles = (query: string) => {
  const normalized = normalizeSearchText(query);
  const tokens = tokenizeSearchText(query);
  return {
    normalized,
    tokens,
    all: Array.from(new Set([normalized, ...tokens].filter(Boolean))),
  };
};

export const buildSearchText = (...parts: Array<string | undefined | null>) => {
  const source = parts.filter(Boolean).join(" ");
  const normalized = normalizeSearchText(source);
  if (!normalized) return "";
  const tokens = tokenizeSearchText(source);
  return Array.from(new Set([normalized, ...tokens])).join(" ");
};
