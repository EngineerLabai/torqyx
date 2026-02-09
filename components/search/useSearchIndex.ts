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

const buildIndexField = (value?: string | string[] | null) => {
  if (!value) return "";
  if (Array.isArray(value)) return normalizeSearchText(value.join(" "));
  return normalizeSearchText(value);
};

export const filterSearchResults = (items: SearchIndexItem[], query: string, limit = 20) => {
  const needle = normalizeSearchText(query);
  if (!needle) return [];

  const scored = items
    .map((item) => {
      const titleText = [item.title, ...(item.localeTitles ? Object.values(item.localeTitles) : [])]
        .filter(Boolean)
        .join(" ");
      const titleIndex = buildIndexField(titleText).indexOf(needle);
      const tagIndex = buildIndexField([...(item.tags ?? []), ...(item.keywords ?? [])]).indexOf(needle);
      const descriptionIndex = buildIndexField(item.description).indexOf(needle);
      const searchIndex = item.searchText.indexOf(needle);

      if (titleIndex === -1 && tagIndex === -1 && descriptionIndex === -1 && searchIndex === -1) {
        return null;
      }

      const tier = titleIndex !== -1 ? 0 : tagIndex !== -1 ? 1 : descriptionIndex !== -1 ? 2 : 3;
      const position =
        titleIndex !== -1 ? titleIndex : tagIndex !== -1 ? tagIndex : descriptionIndex !== -1 ? descriptionIndex : searchIndex;

      return { item, score: tier * 10000 + Math.max(0, position) };
    })
    .filter((entry): entry is { item: SearchIndexItem; score: number } => Boolean(entry))
    .sort((a, b) => a.score - b.score);

  return scored.slice(0, limit).map(({ item }) => item);
};
