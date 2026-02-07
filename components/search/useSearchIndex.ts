"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { normalizeSearchText, type SearchIndexData, type SearchIndexItem } from "@/utils/search-index";

type SearchIndexState = {
  items: SearchIndexItem[];
  error: string | null;
  locale: string | null;
};

export const useSearchIndex = () => {
  const { locale } = useLocale();
  const [state, setState] = useState<SearchIndexState>({ items: [], error: null, locale: null });

  useEffect(() => {
    let ignore = false;

    fetch(`/search-index.${locale}.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Search index load failed");
        const data = (await res.json()) as SearchIndexData;
        if (!ignore) {
          setState({ items: data.items ?? [], error: null, locale });
        }
      })
      .catch(() => {
        if (!ignore) {
          setState({ items: [], error: "Search index unavailable", locale });
        }
      });

    return () => {
      ignore = true;
    };
  }, [locale]);

  const loading = state.locale !== locale && !state.error;
  return { ...state, loading };
};

export const filterSearchResults = (items: SearchIndexItem[], query: string, limit = 12) => {
  const needle = normalizeSearchText(query);
  if (!needle) return [];

  const scored = items
    .map((item) => {
      const index = item.searchText.indexOf(needle);
      if (index === -1) return null;
      const titleMatch = normalizeSearchText(item.title).includes(needle);
      return { item, score: (titleMatch ? 0 : 1000) + index };
    })
    .filter((entry): entry is { item: SearchIndexItem; score: number } => Boolean(entry))
    .sort((a, b) => a.score - b.score);

  return scored.slice(0, limit).map(({ item }) => item);
};
