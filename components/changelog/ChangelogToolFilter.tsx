"use client";

import { useEffect, useMemo, useState } from "react";

type ChangelogToolFilterProps = {
  listId: string;
  allLabel: string;
  filterLabel: string;
  resultLabelTemplate: string;
  tools: Array<{
    value: string;
    label: string;
    count: number;
  }>;
  totalCount: number;
};

const formatCountLabel = (template: string, count: number) => template.replace("{count}", String(count));

export default function ChangelogToolFilter({
  listId,
  allLabel,
  filterLabel,
  resultLabelTemplate,
  tools,
  totalCount,
}: ChangelogToolFilterProps) {
  const [selectedTool, setSelectedTool] = useState("all");
  const normalizedTools = useMemo(() => tools.filter((tool) => tool.value && tool.label), [tools]);
  const visibleCount = useMemo(() => {
    if (selectedTool === "all") return totalCount;
    return normalizedTools.find((tool) => tool.value === selectedTool)?.count ?? 0;
  }, [normalizedTools, selectedTool, totalCount]);

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;

    const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-changelog-tool]"));

    for (const card of cards) {
      const toolSlug = card.dataset.changelogTool ?? "";
      const shouldShow = selectedTool === "all" || toolSlug === selectedTool;
      card.classList.toggle("hidden", !shouldShow);
    }
  }, [listId, selectedTool]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-700" htmlFor="changelog-tool-filter">
          <span className="font-semibold text-slate-900">{filterLabel}</span>
          <select
            id="changelog-tool-filter"
            value={selectedTool}
            onChange={(event) => setSelectedTool(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">{allLabel}</option>
            {normalizedTools.map((tool) => (
              <option key={tool.value} value={tool.value}>
                {tool.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-slate-500">{formatCountLabel(resultLabelTemplate, visibleCount)}</p>
      </div>
    </section>
  );
}
