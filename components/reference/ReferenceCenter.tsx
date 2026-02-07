"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import materialsData from "@/data/reference/materials.json";
import threadsData from "@/data/reference/threads.json";
import frictionData from "@/data/reference/friction.json";
import fitsData from "@/data/reference/fits.json";
import unitsData from "@/data/reference/units.json";

type LocalizedText = { tr: string; en: string };

type ReferenceColumn = {
  key: string;
  label: LocalizedText;
};

type ReferenceSection = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  columns: ReferenceColumn[];
  rows: Array<Record<string, unknown>>;
  note?: LocalizedText;
  layout?: "table" | "cards";
};

type ReferenceLink = {
  href: string;
  label: LocalizedText;
};

type SectionWithRows = ReferenceSection & { filteredRows: Array<Record<string, unknown>> };

const SECTIONS: ReferenceSection[] = [
  materialsData,
  threadsData,
  frictionData,
  fitsData,
  { ...unitsData, layout: "cards" },
];

const SECTION_LINKS: Record<string, ReferenceLink[]> = {
  materials: [
    {
      href: "/tools/material-cards",
      label: { tr: "Malzeme Kartlarına git", en: "Go to Material Cards" },
    },
  ],
  threads: [
    {
      href: "/tools/bolt-calculator",
      label: { tr: "Cıvata Boyut & Tork", en: "Bolt Size & Torque" },
    },
    {
      href: "/tools/bolt-database",
      label: { tr: "Cıvata Veri Merkezi", en: "Bolt Data Center" },
    },
  ],
  friction: [
    {
      href: "/tools/bolt-calculator",
      label: { tr: "Cıvata Boyut & Tork", en: "Bolt Size & Torque" },
    },
  ],
  fits: [
    {
      href: "/tools/materials-manufacturing",
      label: { tr: "Malzeme ve İmalat", en: "Materials & Manufacturing" },
    },
  ],
  units: [
    {
      href: "/tools/unit-converter",
      label: { tr: "Birim Dönüştürücü", en: "Unit Converter" },
    },
  ],
};

const isLocalized = (value: unknown): value is LocalizedText =>
  Boolean(value && typeof value === "object" && "tr" in value && "en" in value);

const getLocalized = (value: unknown, locale: "tr" | "en") => {
  if (value === null || value === undefined) return "";
  if (isLocalized(value)) return value[locale];
  return String(value);
};

const formatValue = (value: unknown, locale: "tr" | "en") => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
      maximumFractionDigits: 4,
    });
  }
  if (isLocalized(value)) return value[locale];
  return String(value);
};

const escapeCsvValue = (value: string) => {
  if (value.includes("\"") || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export default function ReferenceCenter() {
  const { locale } = useLocale();
  const copy = getMessages(locale).pages.reference;
  const [query, setQuery] = useState("");

  const localeLower = locale === "tr" ? "tr-TR" : "en-US";
  const normalizedQuery = query.trim().toLocaleLowerCase(localeLower);

  const filteredSections = useMemo<SectionWithRows[]>(() => {
    return SECTIONS.map((section) => {
      if (!normalizedQuery) {
        return { ...section, filteredRows: section.rows };
      }
      const filteredRows = section.rows.filter((row) => {
        const searchText = section.columns
          .map((column) => getLocalized(row[column.key], locale))
          .join(" ")
          .toLocaleLowerCase(localeLower);
        return searchText.includes(normalizedQuery);
      });
      return { ...section, filteredRows };
    });
  }, [normalizedQuery, locale, localeLower]);

  const handleExport = (section: ReferenceSection, rows: Array<Record<string, unknown>>) => {
    const header = section.columns.map((column) => getLocalized(column.label, locale));
    const lines = rows.map((row) =>
      section.columns
        .map((column) => escapeCsvValue(getLocalized(row[column.key], locale)))
        .join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${section.id}-${locale}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{copy.badge}</p>
            <h2 className="text-xl font-semibold text-slate-900">{copy.searchTitle}</h2>
            <p className="text-sm text-slate-600">{copy.searchDescription}</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-700" htmlFor="reference-search">
              {copy.searchLabel}
            </label>
            <input
              id="reference-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <span>{section.title[locale]}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                  {section.filteredRows.length}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {filteredSections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">{section.title[locale]}</h2>
              {section.description ? <p className="text-sm text-slate-600">{section.description[locale]}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => handleExport(section, section.filteredRows)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              {copy.exportCta}
            </button>
          </div>

          {section.note ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              {section.note[locale]}
            </div>
          ) : null}

          {SECTION_LINKS[section.id]?.length ? (
            <div className="flex flex-wrap gap-2">
              {SECTION_LINKS[section.id].map((link) => (
                <Link
                  key={link.href}
                  href={withLocalePrefix(link.href, locale)}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  {link.label[locale]}
                </Link>
              ))}
            </div>
          ) : null}

          {section.filteredRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
              {copy.emptyState}
            </div>
          ) : section.layout === "cards" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.filteredRows.map((row, index) => (
                <div
                  key={`${section.id}-card-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold text-slate-900">{formatValue(row[section.columns[0].key], locale)}</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-700">{formatValue(row[section.columns[1].key], locale)}</p>
                  <p className="mt-2 text-[11px] text-slate-600">
                    {formatValue(row[section.columns[2].key], locale)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full border-collapse text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    {section.columns.map((column) => (
                      <th key={`${section.id}-${column.key}`} className="border-b border-slate-200 px-4 py-3">
                        {column.label[locale]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.filteredRows.map((row, index) => (
                    <tr key={`${section.id}-${index}`} className="border-b border-slate-100 last:border-b-0">
                      {section.columns.map((column) => (
                        <td key={`${section.id}-${index}-${column.key}`} className="px-4 py-2 text-slate-700">
                          {formatValue(row[column.key], locale)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
        {copy.disclaimer}
      </section>
    </div>
  );
}
