"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import type { StandardsTable as StandardsTableType } from "@/data/standards";
import StandardsTable from "@/components/standards/StandardsTable";
import StandardsTableWrapper from "@/components/standards/StandardsTableWrapper";

type EnhancedStandardsTableProps = {
  table: StandardsTableType;
  rows: Array<Record<string, unknown>>;
  locale: "tr" | "en";
  exportLabel: string;
  emptyLabel: string;
};

export default function EnhancedStandardsTable({
  table,
  rows,
  locale,
  exportLabel,
  emptyLabel,
}: EnhancedStandardsTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(() => table.columns.map((column) => column.key));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleColumns = useMemo(() => {
    const keySet = new Set(visibleColumnKeys);
    return table.columns.filter((column) => keySet.has(column.key));
  }, [table.columns, visibleColumnKeys]);

  const filteredTable = useMemo(
    () => ({
      ...table,
      columns: visibleColumns,
    }),
    [table, visibleColumns],
  );

  const toggleColumn = (key: string) => {
    setVisibleColumnKeys((current) => {
      if (current.includes(key)) {
        if (current.length === 1) return current;
        return current.filter((columnKey) => columnKey !== key);
      }

      const next = [...current, key];
      const order = new Map(table.columns.map((column, index) => [column.key, index]));
      return next.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
    });
  };

  const columnSelectorLabel = locale === "tr" ? "Kolonlar" : "Columns";
  const columnSelectorHelper =
    locale === "tr" ? "Görünür kolonları seçin" : "Select visible columns";

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            <span>{columnSelectorLabel}</span>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
              {visibleColumns.length}/{table.columns.length}
            </span>
          </button>

          {isOpen ? (
            <div
              className="absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
              role="menu"
              aria-label={columnSelectorHelper}
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{columnSelectorHelper}</p>
              <div className="space-y-2">
                {table.columns.map((column) => {
                  const checked = visibleColumnKeys.includes(column.key);
                  const disableUncheck = checked && visibleColumnKeys.length === 1;

                  return (
                    <label key={`${table.id}-column-${column.key}`} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleColumn(column.key)}
                        disabled={disableUncheck}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <span>{column.label[locale]}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <StandardsTableWrapper hintLabel={locale === "tr" ? "← kaydır →" : "← scroll →"}>
        <StandardsTable
          table={filteredTable}
          rows={rows}
          locale={locale}
          exportLabel={exportLabel}
          emptyLabel={emptyLabel}
        />
      </StandardsTableWrapper>
    </div>
  );
}
