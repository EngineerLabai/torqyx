"use client";

import { useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  virtualized?: boolean;
};

export default function StandardsTable({
  table,
  rows,
  locale,
  exportLabel,
  emptyLabel,
  virtualized = true,
}: StandardsTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const header = useMemo(() => table.columns.map((column) => getLocalized(column.label, locale)), [table.columns, locale]);
  const shouldVirtualize = virtualized && rows.length > 100;
  const scrollQueryKey = useMemo(() => `st_scroll_${table.id.replace(/[^a-zA-Z0-9_-]/g, "_")}`, [table.id]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    enabled: shouldVirtualize,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 40,
    overscan: 10,
    measureElement: (element) => element?.getBoundingClientRect().height ?? 40,
  });

  const virtualRows = shouldVirtualize ? rowVirtualizer.getVirtualItems() : [];
  const paddingTop = shouldVirtualize && virtualRows.length > 0 ? virtualRows[0]?.start ?? 0 : 0;
  const paddingBottom =
    shouldVirtualize && virtualRows.length > 0
      ? Math.max(0, rowVirtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.end ?? 0))
      : 0;

  const handleExport = () => {
    const lines = rows.map((row) =>
      table.columns.map((column) => getLocalized(row[column.key], locale)),
    );
    const csv = buildCsv(header, lines);
    downloadCsv(csv, `${table.id}-${locale}.csv`);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const params = new URLSearchParams(window.location.search);
    const value = params.get(scrollQueryKey);
    if (!value) return;

    const parsedOffset = Number(value);
    if (!Number.isFinite(parsedOffset)) return;

    const restoreFrame = window.requestAnimationFrame(() => {
      scrollContainer.scrollTop = parsedOffset;
    });

    return () => {
      window.cancelAnimationFrame(restoreFrame);
    };
  }, [scrollQueryKey, rows.length]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let timeoutId: number | null = null;

    const persistScrollToUrl = () => {
      const url = new URL(window.location.href);
      const offset = Math.round(scrollContainer.scrollTop);
      if (offset <= 0) {
        url.searchParams.delete(scrollQueryKey);
      } else {
        url.searchParams.set(scrollQueryKey, String(offset));
      }
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    };

    const handleScroll = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        persistScrollToUrl();
      }, 120);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        persistScrollToUrl();
      }
    };
  }, [scrollQueryKey]);

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
        <div
          ref={scrollContainerRef}
          data-standards-table-scroll
          className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"
        >
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
              {shouldVirtualize && paddingTop > 0 ? (
                <tr aria-hidden>
                  <td colSpan={table.columns.length} style={{ border: 0, height: `${paddingTop}px`, padding: 0 }} />
                </tr>
              ) : null}

              {shouldVirtualize
                ? virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    if (!row) return null;

                    return (
                      <tr
                        key={`${table.id}-row-${virtualRow.index}`}
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        {table.columns.map((column) => (
                          <td key={`${table.id}-${virtualRow.index}-${column.key}`} className="px-4 py-2 text-slate-700">
                            {formatValue(row[column.key], locale)}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                : rows.map((row, rowIndex) => (
                    <tr key={`${table.id}-row-${rowIndex}`} className="border-b border-slate-100 last:border-b-0">
                      {table.columns.map((column) => (
                        <td key={`${table.id}-${rowIndex}-${column.key}`} className="px-4 py-2 text-slate-700">
                          {formatValue(row[column.key], locale)}
                        </td>
                      ))}
                    </tr>
                  ))}

              {shouldVirtualize && paddingBottom > 0 ? (
                <tr aria-hidden>
                  <td colSpan={table.columns.length} style={{ border: 0, height: `${paddingBottom}px`, padding: 0 }} />
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
