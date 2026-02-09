"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Bookmark, Compass, FileText, Scale, Wrench } from "lucide-react";
import { useSearchIndex, filterSearchResults } from "@/components/search/useSearchIndex";
import { useDebouncedValue } from "@/components/search/useDebouncedValue";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import type { SearchIndexItem } from "@/utils/search-index";

const ICONS = {
  tool: Wrench,
  standard: Scale,
  reference: Bookmark,
  blog: FileText,
  guide: Compass,
  glossary: BookOpen,
} as const;

const BADGE_STYLES: Record<SearchIndexItem["type"], string> = {
  tool: "border-emerald-200 bg-emerald-50 text-emerald-700",
  standard: "border-sky-200 bg-sky-50 text-sky-700",
  reference: "border-sky-200 bg-sky-50 text-sky-700",
  blog: "border-amber-200 bg-amber-50 text-amber-700",
  guide: "border-teal-200 bg-teal-50 text-teal-700",
  glossary: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function InlineSearch() {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.search;
  const { items, loading } = useSearchIndex();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 100);
  const results = useMemo(() => filterSearchResults(items, debouncedQuery, 8), [items, debouncedQuery]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="inline-search">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{copy.inlineTitle}</p>
        <p className="text-sm text-slate-600">{copy.inlineDescription}</p>
      </div>
      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-700" htmlFor="tools-global-search">
          {copy.inlineTitle}
        </label>
        <input
          id="tools-global-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.inlinePlaceholder}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-slate-500">...</p>
        ) : query.trim().length === 0 ? null : results.length === 0 ? (
          <p className="text-sm text-slate-500">{copy.inlineEmpty}</p>
        ) : (
          <div className="space-y-2">
            {results.map((item) => {
              const Icon = ICONS[item.type];
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition hover:border-emerald-300 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      {item.description ? (
                        <p className="text-xs text-slate-600">{item.description}</p>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${BADGE_STYLES[item.type]}`}
                  >
                    {copy.typeLabels[item.type]}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
