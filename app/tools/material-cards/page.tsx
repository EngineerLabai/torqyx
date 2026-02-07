// app/tools/material-cards/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { MaterialCategory, MaterialInfo } from "./material-types";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

type MaterialData = {
  labels: Record<MaterialCategory, string>;
  extra: Partial<Record<MaterialCategory, string>>;
  materials: MaterialInfo[];
};

const INITIAL_CATEGORY_BATCH = 3;
const CATEGORY_BATCH = 2;

export default function MaterialCardsPage() {
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | "all">("all");
  const [data, setData] = useState<MaterialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [visibleCategories, setVisibleCategories] = useState(INITIAL_CATEGORY_BATCH);

  useEffect(() => {
    let active = true;
    import("./material-data")
      .then((mod) => {
        if (!active) return;
        setData({
          labels: mod.CATEGORY_LABELS,
          extra: mod.CATEGORY_EXTRA,
          materials: mod.MATERIALS,
        });
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadError("Kartlar yüklenemedi.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (categoryFilter !== "all") return;
    setVisibleCategories(INITIAL_CATEGORY_BATCH);
  }, [categoryFilter]);

  const categories = useMemo(
    () => (data ? (Object.keys(data.labels) as MaterialCategory[]) : []),
    [data],
  );

  const grouped = useMemo(() => {
    if (!data) return {} as Record<MaterialCategory, MaterialInfo[]>;
    return data.materials.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<MaterialCategory, MaterialInfo[]>);
  }, [data]);

  const visibleCategoryKeys = useMemo(() => {
    if (!data) return [] as MaterialCategory[];
    if (categoryFilter === "all") {
      return categories.slice(0, visibleCategories);
    }
    return categories.includes(categoryFilter) ? [categoryFilter] : [];
  }, [data, categories, categoryFilter, visibleCategories]);

  const hasMoreCategories =
    categoryFilter === "all" && data ? visibleCategories < categories.length : false;

  return (
    <PageShell>
      <ToolDocTabs slug="material-cards">
      {/* Başlık + filtre alanı */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Bilgi Kartları
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            Malzeme · Isıl İşlem · Kaplama Merkezi
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">Malzeme Bilgi Kartları</h1>
        <p className="mt-2 text-xs text-slate-600">
          Çelik, paslanmaz, alüminyum, bakır alaşımları, titanyum, nikel alaşımları, plastik ve
          elastomerler için hızlı mühendislik özetleri. Değerler fikir vermek içindir; kritik
          tasarımda datasheet ve standartları kontrol edin.
        </p>

        {/* Filtre butonları */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-700">Kategori filtresi:</span>
          {data ? (
            <>
              <FilterChip label="Tümü" active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")} />
              {categories.map((cat) => (
                <FilterChip
                  key={cat}
                  label={data.labels[cat]}
                  active={categoryFilter === cat}
                  onClick={() => setCategoryFilter(cat)}
                />
              ))}
            </>
          ) : (
            <span className="text-[11px] text-slate-500">{loadError || "Kartlar yükleniyor..."}</span>
          )}
        </div>
      </section>

      {/* Malzeme kartları */}
      <section className="space-y-6">
        {loadError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
            {loadError}
          </div>
        ) : null}

        {loading ? <LoadingGrid /> : null}

        {!loading && data
          ? visibleCategoryKeys.map((category) => {
              const items = grouped[category] ?? [];
              if (items.length === 0) return null;
              return (
                <section key={category} className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-slate-900">{data.labels[category]}</h2>
                        {data.extra[category] ? (
                          <p className="text-[11px] text-slate-600">{data.extra[category]}</p>
                        ) : null}
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                        {items.length} kart
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((m) => (
                      <article
                        key={m.name}
                        className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm hover:border-slate-300 hover:shadow-md"
                      >
                        <div>
                          <header className="mb-2">
                            <h3 className="text-sm font-semibold text-slate-900">{m.name}</h3>
                            <p className="text-[11px] uppercase tracking-wide text-slate-500">
                              {data.labels[m.category]}
                            </p>
                          </header>

                          <p className="mb-2 text-[11px] text-slate-700">{m.description}</p>

                          <p className="mb-1 text-[11px] text-slate-700">
                            <span className="font-semibold">Tipik kullanım:</span> {m.typicalUse}
                          </p>

                          <ul className="mb-1 list-inside list-disc text-[11px] text-slate-700">
                            {m.properties.map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>

                          {m.notes ? <p className="mt-1 text-[11px] text-slate-500">{m.notes}</p> : null}
                        </div>

                        <footer className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Genel mühendislik referansı</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5">Ücretsiz içerik</span>
                        </footer>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })
          : null}

        {hasMoreCategories ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCategories((prev) => Math.min(prev + CATEGORY_BATCH, categories.length))
              }
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300"
            >
              Daha fazla kategori yükle
            </button>
          </div>
        ) : null}
      </section>
          </ToolDocTabs>
    </PageShell>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-medium ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function LoadingGrid() {
  const items = Array.from({ length: 6 });
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((_, index) => (
        <div
          key={`loading-${index}`}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm"
        >
          <div className="mb-2 h-4 w-32 rounded bg-slate-100" />
          <div className="mb-3 h-3 w-24 rounded bg-slate-100" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
            <div className="h-3 w-4/6 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}


