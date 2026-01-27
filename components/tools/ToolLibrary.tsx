"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import ToolLibraryCard from "@/components/tools/ToolLibraryCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getToolCopy, toolCatalog, toolCategories, toolTags } from "@/tools/_shared/catalog";
import type { Locale } from "@/utils/locale";

const CATEGORY_ALL = "All" as const;
const TAG_ALL = "All" as const;

type CategoryFilter = typeof CATEGORY_ALL | (typeof toolCategories)[number];
type TagFilter = typeof TAG_ALL | (typeof toolTags)[number];

const SCENARIOS: Record<
  Locale,
  {
    id: string;
    title: string;
    description: string;
    links: { label: string; href: string }[];
  }[]
> = {
  tr: [
    {
      id: "convert",
      title: "Bir degeri donusturmek istiyorum",
      description: "Hizli birim cevirisi ve temel kontrol icin.",
      links: [{ label: "Birim Donusturucu", href: "/tools/unit-converter" }],
    },
    {
      id: "calculate",
      title: "Bir muhendislik hesabi yapacagim",
      description: "Manuel girdilerle temel hesaplamalara hizli eris.",
      links: [
        { label: "Civata Tork", href: "/tools/bolt-calculator" },
        { label: "Cekme Gerilmesi", href: "/tools/simple-stress" },
        { label: "Isi Akisi", href: "/tools/basic-engineering" },
      ],
    },
    {
      id: "visualize",
      title: "Grafik gormek istiyorum",
      description: "Parametrelerden grafik veya egriler olustur.",
      links: [
        { label: "Yay Kuvvet Grafigi", href: "/tools/param-chart" },
        { label: "Disli Hesaplayicilar", href: "/tools/gear-design/calculators" },
      ],
    },
  ],
  en: [
    {
      id: "convert",
      title: "I need to convert a value",
      description: "Quick unit conversion and basic checks.",
      links: [{ label: "Unit Converter", href: "/tools/unit-converter" }],
    },
    {
      id: "calculate",
      title: "I need to run an engineering calculation",
      description: "Fast access to core calculators with manual inputs.",
      links: [
        { label: "Bolt Torque", href: "/tools/bolt-calculator" },
        { label: "Tensile Stress", href: "/tools/simple-stress" },
        { label: "Heat Flow", href: "/tools/basic-engineering" },
      ],
    },
    {
      id: "visualize",
      title: "I want to visualize a chart",
      description: "Generate charts or curves from input parameters.",
      links: [
        { label: "Spring Force Chart", href: "/tools/param-chart" },
        { label: "Gear Calculators", href: "/tools/gear-design/calculators" },
      ],
    },
  ],
};

const CATEGORY_LABELS: Record<Locale, Record<(typeof toolCategories)[number], string>> = {
  tr: {
    Mechanical: "Mekanik",
    Automotive: "Otomotiv",
    "General Engineering": "Genel Muhendislik",
  },
  en: {
    Mechanical: "Mechanical",
    Automotive: "Automotive",
    "General Engineering": "General Engineering",
  },
};

const TAG_LABELS: Record<Locale, Record<(typeof toolTags)[number], string>> = {
  tr: {
    pressure: "basinc",
    torque: "tork",
    flow: "akis",
    thermal: "termal",
  },
  en: {
    pressure: "pressure",
    torque: "torque",
    flow: "flow",
    thermal: "thermal",
  },
};

export default function ToolLibrary() {
  const { locale } = useLocale();
  const [category, setCategory] = useState<CategoryFilter>(CATEGORY_ALL);
  const [tag, setTag] = useState<TagFilter>(TAG_ALL);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return toolCatalog.filter((tool) => {
      const categoryMatch = category === CATEGORY_ALL || tool.category === category;
      const tagMatch = tag === TAG_ALL || (tool.tags ?? []).includes(tag);
      const { title, description } = getToolCopy(tool, locale);
      const text = `${title} ${description}`.toLowerCase();
      const queryMatch = needle.length === 0 || text.includes(needle);
      return categoryMatch && tagMatch && queryMatch;
    });
  }, [category, tag, query, locale]);

  const resetFilters = () => {
    startTransition(() => {
      setCategory(CATEGORY_ALL);
      setTag(TAG_ALL);
      setQuery("");
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {locale === "en" ? "What do you want to do?" : "Ne yapmak istiyorsun?"}
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            {locale === "en" ? "Scenario-based shortcuts" : "Senaryoya gore hizli yonlendirme"}
          </h2>
          <p className="text-sm text-slate-600">
            {locale === "en"
              ? "Reach the right tools quickly based on common needs."
              : "En yaygin ihtiyaca gore ilgili araclara hizli ulas."}
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {SCENARIOS[locale].map((scenario) => (
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

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">{locale === "en" ? "Filter" : "Filtrele"}</h2>
              {isPending ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {locale === "en" ? "Filtering..." : "Filtreleniyor..."}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-500">
              {locale === "en"
                ? "Filter tools by category and tag."
                : "Kategori ve etiket secerek araclari daraltabilirsin."}
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            {locale === "en" ? "Clear filters" : "Filtreleri Temizle"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {locale === "en"
            ? "Filters apply instantly. Search results update as you type."
            : "Secimler otomatik uygulanir. Yazdikca arama sonuclari guncellenir."}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              {locale === "en" ? "Category" : "Kategori"}
            </label>
            <select
              value={category}
              onChange={(event) => startTransition(() => setCategory(event.target.value as CategoryFilter))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              <option value={CATEGORY_ALL}>{locale === "en" ? "All categories" : "Tum kategoriler"}</option>
              {toolCategories.map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABELS[locale][value]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              {locale === "en" ? "Tag" : "Etiket"}
            </label>
            <select
              value={tag}
              onChange={(event) => startTransition(() => setTag(event.target.value as TagFilter))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              <option value={TAG_ALL}>{locale === "en" ? "All tags" : "Tum etiketler"}</option>
              {toolTags.map((value) => (
                <option key={value} value={value}>
                  {TAG_LABELS[locale][value]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              {locale === "en" ? "Quick search" : "Hizli arama"}
            </label>
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={query}
              onChange={(event) => startTransition(() => setQuery(event.target.value))}
              placeholder={locale === "en" ? "e.g., torque, pressure, bolt" : "Orn. tork, basinc, civata"}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              aria-label={locale === "en" ? "Search tools" : "Arac ara"}
            />
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">
            {locale === "en" ? "No matching tools found." : "Eslesen arac bulunamadi."}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {locale === "en"
              ? "Try another category, tag, or search term."
              : "Baska bir kategori, etiket veya arama terimi deneyebilirsin."}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            {locale === "en" ? "Reset filters" : "Tum filtreleri sifirla"}
          </button>
        </section>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => {
            const { title, description } = getToolCopy(tool, locale);
            const categoryLabel = tool.category
              ? CATEGORY_LABELS[locale][tool.category]
              : locale === "en"
                ? "General"
                : "Genel";
            const tagLabels = (tool.tags ?? []).map((tag) => TAG_LABELS[locale][tag]);
            return (
              <ToolLibraryCard
                key={tool.id}
                title={title}
                description={description}
                href={tool.href}
                usageLabel={categoryLabel}
                tags={tagLabels}
                ctaLabel={locale === "en" ? "Open tool" : "Araci Ac"}
                ariaLabel={locale === "en" ? `Open ${title}` : `${title} aracina git`}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
