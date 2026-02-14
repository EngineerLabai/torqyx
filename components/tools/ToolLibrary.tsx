"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import ToolLibraryCard from "@/components/tools/ToolLibraryCard";
import RecentToolsStrip from "@/components/tools/RecentToolsStripLazy";
import InlineSearch from "@/components/search/InlineSearch";
import { filterSearchResults, useSearchIndex } from "@/components/search/useSearchIndex";
import { useDebouncedValue } from "@/components/search/useDebouncedValue";
import type { Locale } from "@/utils/locale";
import { formatMessage, getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildSearchText } from "@/utils/search-index";
import {
  getToolCopy,
  toolCatalog,
  toolCategories,
  toolTags,
  toolTypes,
  type ToolType,
  type ToolCatalogItem,
} from "@/tools/_shared/catalog";
import type { SearchIndexItem } from "@/utils/search-index";

const TYPE_ALL = "All" as const;
const CATEGORY_ALL = "All" as const;
const TAG_ALL = "All" as const;
const NEW_WINDOW_DAYS = 14;
const DEFAULT_TYPE: ToolType = "calculator";
const NOW = Date.now();
const INITIAL_VISIBLE_TOOLS = 24;
const VISIBLE_TOOLS_STEP = 24;

type TypeFilter = typeof TYPE_ALL | ToolType;
type CategoryFilter = typeof CATEGORY_ALL | (typeof toolCategories)[number];
type TagFilter = typeof TAG_ALL | (typeof toolTags)[number];

type ToolLibraryProps = {
  locale: Locale;
  searchParams?: Record<string, string | string[] | undefined>;
};

type FilterState = {
  type: TypeFilter;
  category: CategoryFilter;
  tag: TagFilter;
  query: string;
};

const getParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value ?? "");

const resolveTypeFilter = (value: string): TypeFilter => {
  if (value === TYPE_ALL) return TYPE_ALL;
  if (toolTypes.includes(value as ToolType)) return value as ToolType;
  return DEFAULT_TYPE;
};

const resolveCategoryFilter = (value: string): CategoryFilter => {
  if (value === CATEGORY_ALL) return CATEGORY_ALL;
  if (toolCategories.includes(value as (typeof toolCategories)[number])) {
    return value as (typeof toolCategories)[number];
  }
  return CATEGORY_ALL;
};

const resolveTagFilter = (value: string): TagFilter => {
  if (value === TAG_ALL) return TAG_ALL;
  if (toolTags.includes(value as (typeof toolTags)[number])) {
    return value as (typeof toolTags)[number];
  }
  return TAG_ALL;
};

const buildHref = (basePath: string, { type, category, tag, query }: FilterState) => {
  const params = new URLSearchParams();

  if (type === TYPE_ALL) {
    params.set("type", TYPE_ALL);
  } else if (type !== DEFAULT_TYPE) {
    params.set("type", type);
  }

  if (category !== CATEGORY_ALL) {
    params.set("category", category);
  }

  if (tag !== TAG_ALL) {
    params.set("tag", tag);
  }

  if (query) {
    params.set("q", query);
  }

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightMatch = (text: string, query: string): ReactNode => {
  const needle = query.trim();
  if (!needle) return text;
  const regex = new RegExp(`(${escapeRegExp(needle)})`, "ig");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={`${part}-${index}`} className="rounded bg-amber-100 px-1 py-0.5 text-slate-900">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
};

export default function ToolLibrary({ locale, searchParams }: ToolLibraryProps) {
  const messages = getMessages(locale);
  const copy = messages.components.toolLibrary;
  const labels = copy.labels;
  const accessLabels = messages.common.access;
  const basePath = withLocalePrefix("/tools", locale);

  const typeFilter = resolveTypeFilter(getParam(searchParams?.type));
  const category = resolveCategoryFilter(getParam(searchParams?.category));
  const tag = resolveTagFilter(getParam(searchParams?.tag));
  const initialQuery = getParam(searchParams?.q).trim();
  const [query, setQuery] = useState(initialQuery);
  const [visibleToolsCount, setVisibleToolsCount] = useState(INITIAL_VISIBLE_TOOLS);
  const debouncedQuery = useDebouncedValue(query, 100);
  const searchEnabled = query.trim().length > 0;
  const { items: searchItems, loading: searchLoading } = useSearchIndex(searchEnabled);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setVisibleToolsCount(INITIAL_VISIBLE_TOOLS);
  }, [typeFilter, category, tag, debouncedQuery, locale]);

  const typeOptions: TypeFilter[] = [...toolTypes, TYPE_ALL];
  const filterState: FilterState = { type: typeFilter, category, tag, query: query.trim() };

  const toolById = useMemo(() => new Map(toolCatalog.map((tool) => [tool.id, tool])), []);

  const baseTools = useMemo(
    () =>
      toolCatalog.filter((tool) => {
        const typeMatch = typeFilter === TYPE_ALL || tool.type === typeFilter;
        const categoryMatch = category === CATEGORY_ALL || tool.category === category;
        const tagMatch = tag === TAG_ALL || (tool.tags ?? []).includes(tag);
        return typeMatch && categoryMatch && tagMatch;
      }),
    [typeFilter, category, tag],
  );

  const baseToolIds = useMemo(() => new Set(baseTools.map((tool) => tool.id)), [baseTools]);

  const localSearchItems = useMemo<SearchIndexItem[]>(
    () =>
      toolCatalog.map((tool) => {
        const copy = getToolCopy(tool, locale);
        const tags = tool.tags ?? [];
        const localeTitles = { tr: tool.title, en: tool.titleEn ?? tool.title };
        return {
          id: `tool:${tool.id}`,
          type: "tool",
          title: copy.title,
          description: copy.description,
          href: tool.href,
          tags,
          localeTitles,
          searchText: buildSearchText(
            copy.title,
            copy.description,
            tool.id,
            tags.join(" "),
            tool.category ?? "",
            tool.type,
            ...Object.values(localeTitles),
          ),
        };
      }),
    [locale],
  );

  const toolSearchItems = useMemo(() => {
    const source = !searchLoading && searchItems.length > 0 ? searchItems : localSearchItems;
    return source.filter((item) => item.id.startsWith("tool:"));
  }, [searchItems, localSearchItems, searchLoading]);

  const rankedTools = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const ranked = filterSearchResults(toolSearchItems, debouncedQuery, 200);
    return ranked
      .map((item) => item.id.replace(/^tool:/, ""))
      .filter((id) => baseToolIds.has(id))
      .map((id) => toolById.get(id))
      .filter((tool): tool is ToolCatalogItem => Boolean(tool))
      .slice(0, 20);
  }, [debouncedQuery, toolSearchItems, baseToolIds, toolById]);

  const filtered = debouncedQuery.trim().length > 0 ? rankedTools : baseTools;
  const visibleTools = useMemo(() => filtered.slice(0, visibleToolsCount), [filtered, visibleToolsCount]);
  const hasMoreTools = filtered.length > visibleTools.length;
  const toolCardModels = useMemo(
    () =>
      visibleTools.map((tool) => {
        const { title, description } = getToolCopy(tool, locale);
        const categoryLabel = tool.category ? labels.category[tool.category] : labels.generalCategory;
        const tagLabels = (tool.tags ?? []).map((tagValue) => labels.tag[tagValue]);
        const accessLabel = accessLabels?.[tool.access] ?? accessLabels?.free ?? "";
        const isNew = tool.lastUpdated
          ? NOW - new Date(tool.lastUpdated).getTime() <= NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
          : false;

        return {
          tool,
          title,
          description,
          categoryLabel,
          tagLabels,
          accessLabel,
          isNew,
        };
      }),
    [visibleTools, locale, labels, accessLabels],
  );

  return (
    <div className="space-y-6">
      <RecentToolsStrip tone="light" />
      <InlineSearch />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {copy.scenarioSection.kicker}
          </p>
          <h2 className="text-lg font-semibold text-slate-900">{copy.scenarioSection.title}</h2>
          <p className="text-sm text-slate-600">{copy.scenarioSection.description}</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {copy.scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">{scenario.title}</h3>
                <p className="text-sm text-slate-600">{scenario.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {scenario.links.map((link) => (
                  <Link
                    key={link.href}
                    href={withLocalePrefix(link.href, locale)}
                    prefetch={false}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{copy.requestSection.title}</h2>
            <p className="text-sm text-slate-600">{copy.requestSection.description}</p>
          </div>
          <Link
            href={withLocalePrefix("/request-tool", locale)}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-[12px] font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            aria-label={copy.requestSection.ctaAria}
          >
            {copy.requestSection.cta}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{copy.filterSection.title}</h2>
            <p className="text-xs text-slate-500">{copy.filterSection.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              form="tool-filters"
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              {copy.filterSection.apply}
            </button>
            <Link
              href={basePath}
              prefetch={false}
              className="rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              {copy.filterSection.clear}
            </Link>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">{copy.filterSection.note}</p>

        <div className="mt-4 space-y-2">
          <label className="block text-[11px] font-medium text-slate-700">
            {copy.filterSection.typeLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((value) => {
              const href = buildHref(basePath, { ...filterState, type: value });
              return (
                <Link
                  key={value}
                  href={href}
                  prefetch={false}
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold transition ${
                    typeFilter === value
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {labels.typeFilter[value]}
                </Link>
              );
            })}
          </div>
        </div>

        <form id="tool-filters" method="get" action={basePath} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input type="hidden" name="type" value={typeFilter} />
          <div className="space-y-1">
            <label htmlFor="tool-filter-category" className="block text-[11px] font-medium text-slate-700">
              {copy.filterSection.categoryLabel}
            </label>
            <select
              id="tool-filter-category"
              name="category"
              defaultValue={category}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              <option value={CATEGORY_ALL}>{copy.filterSection.allCategories}</option>
              {toolCategories.map((value) => (
                <option key={value} value={value}>
                  {labels.category[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="tool-filter-tag" className="block text-[11px] font-medium text-slate-700">
              {copy.filterSection.tagLabel}
            </label>
            <select
              id="tool-filter-tag"
              name="tag"
              defaultValue={tag}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              <option value={TAG_ALL}>{copy.filterSection.allTags}</option>
              {toolTags.map((value) => (
                <option key={value} value={value}>
                  {labels.tag[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              {copy.filterSection.searchLabel}
            </label>
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.filterSection.searchPlaceholder}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              aria-label={copy.filterSection.searchAria}
            />
            {searchLoading && query.trim().length > 0 ? (
              <p className="text-[11px] text-slate-500">{copy.filterSection.loading}</p>
            ) : null}
          </div>
        </form>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">{copy.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.emptyState.description}</p>
          <Link
            href={basePath}
            prefetch={false}
            className="mt-4 inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            {copy.emptyState.reset}
          </Link>
        </section>
      ) : (
        <section className="space-y-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {toolCardModels.map(({ tool, title, description, categoryLabel, tagLabels, accessLabel, isNew }) => (
              <ToolLibraryCard
                key={tool.id}
                toolId={tool.id}
                title={title}
                titleDisplay={highlightMatch(title, debouncedQuery)}
                description={description}
                descriptionDisplay={highlightMatch(description, debouncedQuery)}
                href={withLocalePrefix(tool.href, locale)}
                usageLabel={categoryLabel}
                typeLabel={labels.type[tool.type]}
                typeTone={tool.type}
                tags={tagLabels}
                accessLabel={accessLabel}
                accessTone={tool.access}
                ctaLabel={labels.cta[tool.type]}
                ariaLabel={formatMessage(labels.openAria, { title })}
                isNew={isNew}
              />
            ))}
          </div>
          {hasMoreTools ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleToolsCount((prev) => Math.min(prev + VISIBLE_TOOLS_STEP, filtered.length))
                }
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {locale === "tr" ? "Daha fazla yükle" : "Load more"}
              </button>
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
