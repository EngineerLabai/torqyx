"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import type { StoredCalculation } from "@/components/tools/ToolHistory";

const STORAGE_PREFIX = "tool-history:";

const safeParse = (value: string | null) => {
  if (!value) return [] as StoredCalculation<unknown, unknown>[];
  try {
    const parsed = JSON.parse(value) as StoredCalculation<unknown, unknown>[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as StoredCalculation<unknown, unknown>[];
  }
};

const formatDate = (value: string, locale: string) => {
  try {
    return new Date(value).toLocaleString(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
};

export default function SavedCalculations() {
  const { locale } = useLocale();
  const [entries, setEntries] = useState<StoredCalculation<unknown, unknown>[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const toolMap = useMemo(() => new Map(toolCatalog.map((tool) => [tool.id, tool])), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const collected: StoredCalculation<unknown, unknown>[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
      const toolId = key.slice(STORAGE_PREFIX.length);
      const list = safeParse(localStorage.getItem(key)).map((entry) => ({
        ...entry,
        toolId: entry.toolId || toolId,
      }));
      collected.push(...list);
    }

    collected.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    Promise.resolve().then(() => {
      setEntries(collected);
      setIsLoaded(true);
    });
  }, []);

  const handleDelete = (entry: StoredCalculation<unknown, unknown>) => {
    if (typeof window === "undefined") return;
    const storageKey = `${STORAGE_PREFIX}${entry.toolId}`;
    const current = safeParse(localStorage.getItem(storageKey));
    const next = current.filter((item) => item.id !== entry.id);
    if (next.length === 0) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(next));
    }

    setEntries((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const copy =
    locale === "en"
      ? {
          title: "Saved calculations",
          description:
            "Saved items live only on this device. Reopen or delete entries from the list below.",
          loading: "Loading saved items...",
          emptyTitle: "No saved calculations yet.",
          emptyHint: 'Use the "Save" button inside a calculator to create one.',
          toolLibrary: "Go to Calculator Library",
          reopen: "Open again",
          delete: "Delete",
          details: "Input and result details",
          inputs: "Inputs",
          outputs: "Result",
        }
      : {
          title: "Kayitli Hesaplarim",
          description:
            "Kayitlar sadece bu cihazda saklanir. Tekrar acmak veya silmek icin listeden istedigin kaydi kullanabilirsin.",
          loading: "Kayitlar yukleniyor...",
          emptyTitle: "Kayitli hesap bulunamadi.",
          emptyHint: 'Bir hesaplayicida "Kaydet" butonunu kullanarak kayit olusturabilirsin.',
          toolLibrary: "Hesaplayici Kutuphanesi'ne git",
          reopen: "Tekrar Ac",
          delete: "Sil",
          details: "Parametre ve sonuc detaylari",
          inputs: "Parametreler",
          outputs: "Sonuc",
        };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.title}</h2>
          <p className="text-sm text-slate-600">{copy.description}</p>
        </div>
      </section>

      {!isLoaded ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          {copy.loading}
        </section>
      ) : entries.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">{copy.emptyTitle}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.emptyHint}</p>
          <Link
            href="/tools"
            className="mt-4 inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-700 hover:border-slate-400"
          >
            {copy.toolLibrary}
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => {
            const tool = toolMap.get(entry.toolId);
            const toolCopy = tool ? getToolCopy(tool, locale) : null;
            const title = toolCopy?.title ?? entry.toolTitle ?? entry.toolId;
            const href = tool?.href ?? `/tools/${entry.toolId}`;

            return (
              <article key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] text-slate-500">
                      {formatDate(entry.createdAt, locale === "en" ? "en-US" : "tr-TR")}
                    </p>
                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`${href}?historyId=${entry.id}`}
                      className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
                    >
                      {copy.reopen}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-slate-400"
                    >
                      {copy.delete}
                    </button>
                  </div>
                </div>

                <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <summary className="cursor-pointer text-[11px] font-semibold text-slate-700">
                    {copy.details}
                  </summary>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <p className="text-[11px] font-medium text-slate-500">{copy.inputs}</p>
                      <pre className="mt-1 max-h-44 overflow-auto text-[11px] text-slate-700">
                        {JSON.stringify(entry.input, null, 2)}
                      </pre>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <p className="text-[11px] font-medium text-slate-500">{copy.outputs}</p>
                      <pre className="mt-1 max-h-44 overflow-auto text-[11px] text-slate-700">
                        {JSON.stringify(entry.result, null, 2)}
                      </pre>
                    </div>
                  </div>
                </details>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
