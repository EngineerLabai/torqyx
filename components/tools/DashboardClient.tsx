"use client";

import { useMemo } from "react";
import ActionCard from "@/components/ui/ActionCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import useToolFavorites from "@/components/tools/useToolFavorites";
import useToolRecents from "@/components/tools/useToolRecents";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";

const formatShortDate = (value: string, locale: "tr" | "en") => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(date);
};

export default function DashboardClient() {
  const { locale } = useLocale();
  const { favorites, favoritesSet } = useToolFavorites();
  const { recents } = useToolRecents();

  const favoriteTools = useMemo(
    () =>
      favorites
        .map((id) => toolCatalog.find((tool) => tool.id === id))
        .filter((tool): tool is (typeof toolCatalog)[number] => Boolean(tool)),
    [favorites],
  );

  const recentTools = useMemo(
    () =>
      recents
        .map((entry) => ({
          entry,
          tool: toolCatalog.find((tool) => tool.id === entry.toolId) ?? null,
        }))
        .filter((item): item is { entry: typeof recents[number]; tool: (typeof toolCatalog)[number] } => Boolean(item.tool)),
    [recents],
  );

  const recommendedTools = useMemo(() => {
    if (favoriteTools.length === 0 && recentTools.length === 0) return [];
    const categories = new Set<string>();
    const tags = new Set<string>();
    [...favoriteTools, ...recentTools.map((item) => item.tool)].forEach((tool) => {
      if (tool.category) categories.add(tool.category);
      (tool.tags ?? []).forEach((tag) => tags.add(tag));
    });

    const recentIds = new Set(recentTools.map((item) => item.tool.id));
    return toolCatalog
      .filter((tool) => !favoritesSet.has(tool.id) && !recentIds.has(tool.id))
      .filter(
        (tool) =>
          (tool.category && categories.has(tool.category)) ||
          (tool.tags ?? []).some((tag) => tags.has(tag)),
      )
      .slice(0, 8);
  }, [favoriteTools, recentTools, favoritesSet]);

  const copy =
    locale === "en"
      ? {
          title: "Your dashboard",
          description: "Favorites, recent work, and recommendations in one place.",
          favorites: "Favorites",
          favoritesEmpty: "You have no favorites yet.",
          recents: "Recently used",
          recentsEmpty: "No calculators opened yet.",
          recommended: "Recommended",
          recommendedEmpty: "Add favorites to see recommendations.",
          open: "Open calculator",
          lastUsed: "Last used",
        }
      : {
          title: "Kontrol paneli",
          description: "Favoriler, son kullanilanlar ve ozel oneriler tek yerde.",
          favorites: "Favoriler",
          favoritesEmpty: "Henuz favori eklemedin.",
          recents: "Son kullanilanlar",
          recentsEmpty: "Henuz bir hesaplayici acilmadi.",
          recommended: "Onerilen",
          recommendedEmpty: "Favori ekledikce oneriler burada gorunur.",
          open: "Hesaplayiciyi Ac",
          lastUsed: "Son kullanim",
        };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h1>
          <p className="text-sm text-slate-600">{copy.description}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.favorites}</h2>
          <p className="text-sm text-slate-600">
            {locale === "en" ? "Pinned calculators you want to keep close." : "Sik kullandigin hesaplayicilarin listesi."}
          </p>
        </div>
        {favoriteTools.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            {copy.favoritesEmpty}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => {
              const toolCopy = getToolCopy(tool, locale);
              return (
                <ActionCard
                  key={tool.id}
                  title={toolCopy.title}
                  description={toolCopy.description}
                  href={tool.href}
                  badge={tool.category}
                  toolId={tool.id}
                  ctaLabel={copy.open}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.recents}</h2>
          <p className="text-sm text-slate-600">
            {locale === "en" ? "Pick up where you left off." : "Kaldigin yerden devam et."}
          </p>
        </div>
        {recentTools.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            {copy.recentsEmpty}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map(({ tool, entry }) => {
              const toolCopy = getToolCopy(tool, locale);
              const lastUsed = formatShortDate(entry.lastUsedAt, locale);
              return (
                <div key={tool.id} className="space-y-2">
                  <ActionCard
                    title={toolCopy.title}
                    description={toolCopy.description}
                    href={tool.href}
                    badge={tool.category}
                    toolId={tool.id}
                    ctaLabel={copy.open}
                  />
                  {lastUsed ? (
                    <p className="text-[11px] text-slate-500">
                      {copy.lastUsed}: {lastUsed}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.recommended}</h2>
          <p className="text-sm text-slate-600">
            {locale === "en"
              ? "Based on categories or tags from your recent activity."
              : "Son kullanilanlarinla benzer kategori veya etiketlerden secildi."}
          </p>
        </div>
        {recommendedTools.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            {copy.recommendedEmpty}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedTools.map((tool) => {
              const toolCopy = getToolCopy(tool, locale);
              return (
                <ActionCard
                  key={tool.id}
                  title={toolCopy.title}
                  description={toolCopy.description}
                  href={tool.href}
                  badge={tool.category}
                  toolId={tool.id}
                  ctaLabel={copy.open}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
