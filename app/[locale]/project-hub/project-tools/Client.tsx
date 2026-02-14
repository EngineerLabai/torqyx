"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import type { Locale } from "@/utils/locale";
import {
  PROJECT_COPY,
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  type ProjectPriority,
  type ProjectStatus,
  type SortOption,
} from "./copy";

type ProjectItem = {
  id: string;
  title: string;
  owner: string;
  area: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate: string;
  link: string;
  notes: string;
  createdAt: number;
};

const STORAGE_KEY = "project-hub-projects-v2";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const readStorage = () => {
  if (typeof window === "undefined") return [] as ProjectItem[];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProjectItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function ProjectToolsClient({ locale, heroImage }: { locale: Locale; heroImage: string }) {
  const copy = PROJECT_COPY[locale];
  const [items, setItems] = useState<ProjectItem[]>(() => readStorage());
  const hasPersistedRef = useRef(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | ProjectPriority>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const [form, setForm] = useState<Omit<ProjectItem, "id" | "createdAt">>({
    title: "",
    owner: "",
    area: "",
    status: "open",
    priority: "medium",
    dueDate: "",
    link: "",
    notes: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasPersistedRef.current) {
      hasPersistedRef.current = true;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const statusOrder = useMemo(
    () => new Map(STATUS_OPTIONS.map((opt, index) => [opt.value, index])),
    [],
  );
  const priorityOrder = useMemo(
    () => new Map(PRIORITY_OPTIONS.map((opt, index) => [opt.value, index])),
    [],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    const nextItem: ProjectItem = {
      id: createId(),
      ...form,
      createdAt: Date.now(),
    };

    setItems((prev) => [nextItem, ...prev]);
    setForm({
      title: "",
      owner: "",
      area: "",
      status: "open",
      priority: "medium",
      dueDate: "",
      link: "",
      notes: "",
    });
  };

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;
      if (!normalizedQuery) return true;
      const haystack = [
        item.title,
        item.owner,
        item.area,
        item.notes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [items, query, statusFilter, priorityFilter]);

  const sortedItems = useMemo(() => {
    const next = [...filteredItems];
    next.sort((a, b) => {
      if (sort === "due-date") {
        const aTime = a.dueDate ? Date.parse(a.dueDate) : Number.POSITIVE_INFINITY;
        const bTime = b.dueDate ? Date.parse(b.dueDate) : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      }
      if (sort === "priority") {
        return (priorityOrder.get(a.priority) ?? 0) - (priorityOrder.get(b.priority) ?? 0);
      }
      if (sort === "status") {
        return (statusOrder.get(a.status) ?? 0) - (statusOrder.get(b.status) ?? 0);
      }
      return b.createdAt - a.createdAt;
    });
    return next;
  }, [filteredItems, sort, priorityOrder, statusOrder]);

  const updateItem = (id: string, patch: Partial<ProjectItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <PageShell>
      <PageHero
        title={copy.hero.title}
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        imageSrc={heroImage}
        imageAlt={copy.hero.imageAlt}
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{copy.formTitle}</h2>
              <p className="text-xs text-slate-500">{copy.formSubtitle}</p>
            </div>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
            >
              {copy.formCta}
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label={copy.fields.title}>
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder={copy.fields.title}
                required
              />
            </Field>

            <Field label={copy.fields.owner}>
              <input
                type="text"
                value={form.owner}
                onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
            </Field>

            <Field label={copy.fields.area}>
              <input
                type="text"
                value={form.area}
                onChange={(event) => setForm((prev) => ({ ...prev, area: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
            </Field>

            <Field label={copy.fields.dueDate}>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
            </Field>

            <Field label={copy.fields.status}>
              <select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ProjectStatus }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[locale]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={copy.fields.priority}>
              <select
                value={form.priority}
                onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value as ProjectPriority }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[locale]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={copy.fields.link} className="md:col-span-2">
              <input
                type="url"
                value={form.link}
                onChange={(event) => setForm((prev) => ({ ...prev, link: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="https://"
              />
            </Field>

            <Field label={copy.fields.notes} className="md:col-span-2">
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
            </Field>
          </div>
        </form>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{copy.filtersTitle}</h2>
          <div className="mt-3 space-y-3">
            <label className="block text-[11px] font-medium text-slate-700">{copy.fields.status}</label>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={statusFilter === "all"}
                label={locale === "tr" ? "Tumu" : "All"}
                onClick={() => setStatusFilter("all")}
              />
              {STATUS_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  active={statusFilter === option.value}
                  label={option.label[locale]}
                  onClick={() => setStatusFilter(option.value)}
                />
              ))}
            </div>

            <label className="block text-[11px] font-medium text-slate-700">{copy.fields.priority}</label>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={priorityFilter === "all"}
                label={locale === "tr" ? "Tumu" : "All"}
                onClick={() => setPriorityFilter("all")}
              />
              {PRIORITY_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  active={priorityFilter === option.value}
                  label={option.label[locale]}
                  onClick={() => setPriorityFilter(option.value)}
                />
              ))}
            </div>

            <label className="block text-[11px] font-medium text-slate-700">{locale === "tr" ? "Ara" : "Search"}</label>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              placeholder={copy.searchPlaceholder}
            />

            <label className="block text-[11px] font-medium text-slate-700">{locale === "tr" ? "Sirala" : "Sort"}</label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[locale]}
                </option>
              ))}
            </select>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
              <div className="font-semibold">{copy.exportLabel}</div>
              <div>{copy.exportSoon}</div>
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{copy.tableTitle}</h2>
            <span className="text-[11px] text-slate-500">{copy.storageNote}</span>
          </div>
          <button
            type="button"
            disabled
            className="rounded-full border border-amber-300 px-4 py-2 text-[11px] font-semibold text-amber-700 opacity-70"
          >
            {copy.exportLabel} - {copy.exportSoon}
          </button>
        </div>

        {sortedItems.length === 0 ? (
          <p className="mt-4 text-xs text-slate-500">{copy.emptyState}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <Th>{copy.fields.title}</Th>
                  <Th>{copy.fields.owner}</Th>
                  <Th>{copy.fields.area}</Th>
                  <Th>{copy.fields.status}</Th>
                  <Th>{copy.fields.priority}</Th>
                  <Th>{copy.fields.dueDate}</Th>
                  <Th>{copy.fields.link}</Th>
                  <Th>{copy.fields.notes}</Th>
                  <Th>{locale === "tr" ? "Aksiyon" : "Actions"}</Th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <Td className="font-semibold text-slate-900">{item.title}</Td>
                    <Td>{item.owner || "-"}</Td>
                    <Td>{item.area || "-"}</Td>
                    <Td>
                      <select
                        value={item.status}
                        onChange={(event) => updateItem(item.id, { status: event.target.value as ProjectStatus })}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] text-slate-700"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label[locale]}
                          </option>
                        ))}
                      </select>
                    </Td>
                    <Td>
                      <select
                        value={item.priority}
                        onChange={(event) => updateItem(item.id, { priority: event.target.value as ProjectPriority })}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] text-slate-700"
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label[locale]}
                          </option>
                        ))}
                      </select>
                    </Td>
                    <Td>{item.dueDate || "-"}</Td>
                    <Td>
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.link.startsWith("http") ? "_blank" : undefined}
                          rel={item.link.startsWith("http") ? "noreferrer" : undefined}
                          className="text-emerald-700 hover:underline"
                        >
                          {locale === "tr" ? "Ac" : "Open"}
                        </a>
                      ) : (
                        "-"
                      )}
                    </Td>
                    <Td className="max-w-[220px] text-[11px] text-slate-600">{item.notes || "-"}</Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] text-rose-700"
                      >
                        {copy.actions.delete}
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`space-y-1 text-[11px] font-medium text-slate-700 ${className}`.trim()}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="border-b border-slate-200 px-3 py-2 text-left">{children}</th>;
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-3 py-2 align-top text-slate-700 ${className}`}>{children}</td>;
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${
        active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}
