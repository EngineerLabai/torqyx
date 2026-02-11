"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Bookmark, Compass, FileText, Scale, Wrench } from "lucide-react";
import { useSearchIndex, filterSearchResults } from "@/components/search/useSearchIndex";
import { COMMAND_PALETTE_OPEN_EVENT } from "@/components/search/commandPaletteEvents";
import { useDebouncedValue } from "@/components/search/useDebouncedValue";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { localePath } from "@/utils/locale-path";
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

export default function CommandPalette() {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.search;
  const { items, loading } = useSearchIndex();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebouncedValue(query, 100);

  const results = useMemo(() => filterSearchResults(items, debouncedQuery, 20), [items, debouncedQuery]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const openPalette = () => {
      setOpen(true);
      setQuery("");
      setActiveIndex(0);
    };

    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, openPalette);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, openPalette);
    };
  }, []);

  const handleNavigate = (item: SearchIndexItem) => {
    setOpen(false);
    router.push(localePath(locale, item.href));
  };

  const handleInputKey = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      handleNavigate(results[activeIndex]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 py-16" data-testid="command-palette">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label={copy.paletteOpen}
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{copy.paletteTitle}</p>
              <p className="text-xs text-slate-500">{copy.paletteHint}</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-500">
              Ctrl/Cmd + K
            </span>
          </div>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKey}
            placeholder={copy.palettePlaceholder}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            data-testid="command-palette-input"
          />
        </div>

        <div className="max-h-[420px] overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-slate-500">...</p>
          ) : query.trim().length === 0 ? (
            <p className="text-sm text-slate-500">{copy.paletteHint}</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-slate-500">{copy.paletteEmpty}</p>
          ) : (
            <ul className="space-y-2">
              {results.map((item, index) => {
                const Icon = ICONS[item.type];
                const active = index === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(item)}
                      className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        active ? "border-emerald-300 bg-emerald-50/60" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                      data-testid="command-palette-result"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
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
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
