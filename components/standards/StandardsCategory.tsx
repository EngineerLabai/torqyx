"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { StandardsCategory, StandardsTable as StandardsTableType, LocalizedText } from "@/data/standards";
import StandardsTable from "@/components/standards/StandardsTable";

const isLocalized = (value: unknown): value is LocalizedText =>
  Boolean(value && typeof value === "object" && "tr" in value && "en" in value);

const getLocalized = (value: unknown, locale: "tr" | "en") => {
  if (value === null || value === undefined) return "";
  if (isLocalized(value)) return value[locale];
  return String(value);
};

type StandardsCategoryProps = {
  category: StandardsCategory;
  tables: StandardsTableType[];
  locale: "tr" | "en";
  copy: {
    searchTitle: string;
    searchDescription: string;
    searchLabel: string;
    searchPlaceholder: string;
    exportCta: string;
    emptyState: string;
    sourcesTitle: string;
    sourcesLabel: string;
  };
};

export default function StandardsCategoryView({ category, tables, locale, copy }: StandardsCategoryProps) {
  const [query, setQuery] = useState("");
  const localeLower = locale === "tr" ? "tr-TR" : "en-US";
  const normalizedQuery = query.trim().toLocaleLowerCase(localeLower);

  const filteredTables = useMemo(() => {
    return tables.map((table) => {
      if (!normalizedQuery) {
        return { table, rows: table.rows };
      }
      const rows = table.rows.filter((row) => {
        const searchText = table.columns
          .map((column) => getLocalized(row[column.key], locale))
          .join(" ")
          .toLocaleLowerCase(localeLower);
        return searchText.includes(normalizedQuery);
      });
      return { table, rows };
    });
  }, [tables, normalizedQuery, locale, localeLower]);

  const sources = category.sources[locale];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{category.title[locale]}</p>
            <h2 className="text-xl font-semibold text-slate-900">{copy.searchTitle}</h2>
            <p className="text-sm text-slate-600">{copy.searchDescription}</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-700" htmlFor="standards-search">
              {copy.searchLabel}
            </label>
            <input
              id="standards-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredTables.map(({ table, rows }) => (
              <a
                key={table.id}
                href={`#${table.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <span>{table.title[locale]}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{rows.length}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {filteredTables.map(({ table, rows }) => (
        <StandardsTable
          key={table.id}
          table={table}
          rows={rows}
          locale={locale}
          exportLabel={copy.exportCta}
          emptyLabel={copy.emptyState}
        />
      ))}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.sourcesTitle}</h3>
          <p>{sources.text}</p>
          <div className="flex flex-wrap gap-3">
            {sources.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
              >
                {copy.sourcesLabel}: {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
