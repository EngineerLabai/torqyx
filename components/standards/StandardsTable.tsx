"use client";

import { useMemo } from "react";
import type { StandardsTable as StandardsTableType, LocalizedText } from "@/data/standards";
import { buildCsv, downloadCsv } from "@/utils/csv";

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

type StandardsTableProps = {
  table: StandardsTableType;
  rows: Array<Record<string, unknown>>;
  locale: "tr" | "en";
  exportLabel: string;
  emptyLabel: string;
};

export default function StandardsTable({ table, rows, locale, exportLabel, emptyLabel }: StandardsTableProps) {
  const header = useMemo(() => table.columns.map((column) => getLocalized(column.label, locale)), [table.columns, locale]);

  const handleExport = () => {
    const lines = rows.map((row) =>
      table.columns.map((column) => getLocalized(row[column.key], locale)),
    );
    const csv = buildCsv(header, lines);
    downloadCsv(csv, `${table.id}-${locale}.csv`);
  };

  return (
    <section id={table.id} className="scroll-mt-28 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">{table.title[locale]}</h3>
          {table.description ? <p className="text-sm text-slate-600">{table.description[locale]}</p> : null}
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
        >
          {exportLabel}
        </button>
      </div>

      {table.note ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          {table.note[locale]}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {table.columns.map((column) => (
                  <th key={`${table.id}-${column.key}`} className="border-b border-slate-200 px-4 py-3">
                    {column.label[locale]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${table.id}-row-${rowIndex}`} className="border-b border-slate-100 last:border-b-0">
                  {table.columns.map((column) => (
                    <td key={`${table.id}-${rowIndex}-${column.key}`} className="px-4 py-2 text-slate-700">
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
  );
}
