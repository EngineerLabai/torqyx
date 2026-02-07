import Link from "next/link";
import ToolLibraryCard from "@/components/tools/ToolLibraryCard";
import RecentToolsStrip from "@/components/tools/RecentToolsStripLazy";
import InlineSearch from "@/components/search/InlineSearch";
import type { Locale } from "@/utils/locale";
import { formatMessage, getMessages } from "@/utils/messages";
import {
  getToolCopy,
  toolCatalog,
  toolCategories,
  toolTags,
  toolTypes,
  type ToolType,
} from "@/tools/_shared/catalog";

const TYPE_ALL = "All" as const;
const CATEGORY_ALL = "All" as const;
const TAG_ALL = "All" as const;
const NEW_WINDOW_DAYS = 14;
const DEFAULT_TYPE: ToolType = "calculator";
const NOW = Date.now();

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

const buildHref = ({ type, category, tag, query }: FilterState) => {
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
  return qs ? `/tools?${qs}` : "/tools";
};

export default function ToolLibrary({ locale, searchParams }: ToolLibraryProps) {
  const messages = getMessages(locale);
  const copy = messages.components.toolLibrary;
  const labels = copy.labels;

  const typeFilter = resolveTypeFilter(getParam(searchParams?.type));
  const category = resolveCategoryFilter(getParam(searchParams?.category));
  const tag = resolveTagFilter(getParam(searchParams?.tag));
  const query = getParam(searchParams?.q).trim();
  const typeOptions: TypeFilter[] = [...toolTypes, TYPE_ALL];
  const filterState: FilterState = { type: typeFilter, category, tag, query };

  const filtered = toolCatalog.filter((tool) => {
    const typeMatch = typeFilter === TYPE_ALL || tool.type === typeFilter;
    const categoryMatch = category === CATEGORY_ALL || tool.category === category;
    const tagMatch = tag === TAG_ALL || (tool.tags ?? []).includes(tag);
    const { title, description } = getToolCopy(tool, locale);
    const text = `${title} ${description}`.toLowerCase();
    const needle = query.toLowerCase();
    const queryMatch = needle.length === 0 || text.includes(needle);
    return typeMatch && categoryMatch && tagMatch && queryMatch;
  });

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
                    href={link.href}
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
            href="/request-tool"
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
              href="/tools"
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
              const href = buildHref({ ...filterState, type: value });
              return (
                <Link
                  key={value}
                  href={href}
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

        <form id="tool-filters" method="get" action="/tools" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input type="hidden" name="type" value={typeFilter} />
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              {copy.filterSection.categoryLabel}
            </label>
            <select
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
            <label className="block text-[11px] font-medium text-slate-700">
              {copy.filterSection.tagLabel}
            </label>
            <select
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
              defaultValue={query}
              placeholder={copy.filterSection.searchPlaceholder}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              aria-label={copy.filterSection.searchAria}
            />
          </div>
        </form>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">{copy.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.emptyState.description}</p>
          <Link
            href="/tools"
            className="mt-4 inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            {copy.emptyState.reset}
          </Link>
        </section>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => {
            const { title, description } = getToolCopy(tool, locale);
            const categoryLabel = tool.category ? labels.category[tool.category] : labels.generalCategory;
            const tagLabels = (tool.tags ?? []).map((tagValue) => labels.tag[tagValue]);
            const isNew = tool.lastUpdated
              ? NOW - new Date(tool.lastUpdated).getTime() <= NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
              : false;
            return (
              <ToolLibraryCard
                key={tool.id}
                toolId={tool.id}
                title={title}
                description={description}
                href={tool.href}
                usageLabel={categoryLabel}
                typeLabel={labels.type[tool.type]}
                typeTone={tool.type}
                tags={tagLabels}
                ctaLabel={labels.cta[tool.type]}
                ariaLabel={formatMessage(labels.openAria, { title })}
                isNew={isNew}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
