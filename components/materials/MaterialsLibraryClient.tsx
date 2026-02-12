"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/utils/locale";
import { formatMessage, getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import type { MaterialCategory, MaterialEntry } from "@/src/data/materials/types";

const CATEGORY_ALL = "all" as const;

const CATEGORY_ORDER: MaterialCategory[] = [
  "steel",
  "stainless",
  "tool",
  "cast-iron",
  "aluminum",
  "copper",
  "nickel",
  "titanium",
  "magnesium",
  "plastics",
  "elastomer",
  "composites",
];

type MaterialsLibraryClientProps = {
  materials: MaterialEntry[];
  locale: Locale;
};

type IndexedMaterial = MaterialEntry & {
  categoryLabel: string;
  searchText: string;
};

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value: number | null, locale: Locale, options?: Intl.NumberFormatOptions) => {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", options);
};

export default function MaterialsLibraryClient({ materials, locale }: MaterialsLibraryClientProps) {
  const copy = getMessages(locale).pages.materials;
  const localeLower = locale === "tr" ? "tr-TR" : "en-US";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<typeof CATEGORY_ALL | MaterialCategory>(CATEGORY_ALL);
  const [yieldMin, setYieldMin] = useState("");
  const [yieldMax, setYieldMax] = useState("");
  const [modulusMin, setModulusMin] = useState("");
  const [modulusMax, setModulusMax] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase(localeLower);
  const yieldMinValue = parseNumber(yieldMin);
  const yieldMaxValue = parseNumber(yieldMax);
  const modulusMinValue = parseNumber(modulusMin);
  const modulusMaxValue = parseNumber(modulusMax);

  const indexedMaterials = useMemo<IndexedMaterial[]>(() => {
    return materials.map((material) => {
      const categoryLabel = copy.categories[material.category] ?? material.category;
      const searchText = [
        material.name,
        material.standard,
        material.category,
        categoryLabel,
        material.notes ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase(localeLower);
      return { ...material, categoryLabel, searchText };
    });
  }, [materials, copy.categories, localeLower]);

  const filtered = useMemo(() => {
    const matches = indexedMaterials.filter((material) => {
      if (category !== CATEGORY_ALL && material.category !== category) return false;
      if (normalizedQuery && !material.searchText.includes(normalizedQuery)) return false;

      if (yieldMinValue !== null) {
        if (material.yield === null || material.yield < yieldMinValue) return false;
      }
      if (yieldMaxValue !== null) {
        if (material.yield === null || material.yield > yieldMaxValue) return false;
      }
      if (modulusMinValue !== null && material.E < modulusMinValue) return false;
      if (modulusMaxValue !== null && material.E > modulusMaxValue) return false;

      return true;
    });

    return matches.sort((a, b) => a.name.localeCompare(b.name, localeLower));
  }, [indexedMaterials, category, normalizedQuery, yieldMinValue, yieldMaxValue, modulusMinValue, modulusMaxValue, localeLower]);

  const handleClear = () => {
    setQuery("");
    setCategory(CATEGORY_ALL);
    setYieldMin("");
    setYieldMax("");
    setModulusMin("");
    setModulusMax("");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{copy.search.title}</h2>
            <p className="text-sm text-slate-600">{copy.search.description}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">{copy.search.label}</label>
              <input
                type="search"
                inputMode="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.search.placeholder}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">{copy.filters.categoryLabel}</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as typeof CATEGORY_ALL | MaterialCategory)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
              >
                <option value={CATEGORY_ALL}>{copy.filters.allCategories}</option>
                {CATEGORY_ORDER.map((value) => (
                  <option key={value} value={value}>
                    {copy.categories[value] ?? value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-700">{copy.filters.yieldLabel}</label>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="number"
                  value={yieldMin}
                  onChange={(event) => setYieldMin(event.target.value)}
                  placeholder={copy.filters.yieldMin}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
                  min={0}
                />
                <input
                  type="number"
                  value={yieldMax}
                  onChange={(event) => setYieldMax(event.target.value)}
                  placeholder={copy.filters.yieldMax}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-700">{copy.filters.modulusLabel}</label>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="number"
                  value={modulusMin}
                  onChange={(event) => setModulusMin(event.target.value)}
                  placeholder={copy.filters.modulusMin}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
                  min={0}
                  step="any"
                />
                <input
                  type="number"
                  value={modulusMax}
                  onChange={(event) => setModulusMax(event.target.value)}
                  placeholder={copy.filters.modulusMax}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
                  min={0}
                  step="any"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>{formatMessage(copy.results.countLabel, { count: filtered.length })}</span>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            >
              {copy.filters.clear}
            </button>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">{copy.results.emptyTitle}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.results.emptyDescription}</p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((material) => (
            <article
              key={material.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{material.name}</h3>
                    <p className="text-xs text-slate-500">
                      {copy.card.standard}: {material.standard}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {material.categoryLabel}
                  </span>
                </div>
                <dl className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <dt>{copy.card.density}</dt>
                    <dd className="font-mono text-slate-900">
                      {formatNumber(material.density, locale, { maximumFractionDigits: 0 })} kg/m3
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>{copy.card.modulus}</dt>
                    <dd className="font-mono text-slate-900">
                      {formatNumber(material.E, locale, { maximumFractionDigits: 1 })}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>{copy.card.yield}</dt>
                    <dd className="font-mono text-slate-900">
                      {formatNumber(material.yield, locale, { maximumFractionDigits: 0 })}
                    </dd>
                  </div>
                </dl>
              </div>
              <Link
                href={withLocalePrefix(`/materials/${material.id}`, locale)}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                {copy.card.cta}
              </Link>
            </article>
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs text-amber-700">
        {copy.disclaimer}
      </section>
    </div>
  );
}
