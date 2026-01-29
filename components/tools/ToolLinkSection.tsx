"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import ActionCard from "@/components/ui/ActionCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";

const MAX_LINKS = 4;

const pickUnique = (items: typeof toolCatalog) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const buildList = (primary: typeof toolCatalog, fallback: typeof toolCatalog) =>
  pickUnique([...primary, ...fallback]).slice(0, MAX_LINKS);

export default function ToolLinkSection() {
  const pathname = usePathname() ?? "";
  const { locale } = useLocale();

  const { similarLinks, helpfulLinks } = useMemo(() => {
    const normalized = pathname.replace(/\/$/, "");
    const current = toolCatalog.find(
      (tool) => normalized === tool.href || normalized.startsWith(`${tool.href}/`)
    );

    const others = toolCatalog.filter((tool) => tool.id !== current?.id);
    const categoryMatches = current?.category
      ? others.filter((tool) => tool.category === current.category)
      : [];
    const tagMatches = current?.tags?.length
      ? others.filter((tool) => (tool.tags ?? []).some((tag) => current.tags?.includes(tag)))
      : [];

    const similarPrimary = categoryMatches.length > 0 ? categoryMatches : tagMatches;
    const similarFallback = categoryMatches.length > 0 ? tagMatches : others;
    const similar = buildList(similarPrimary, similarFallback);

    const similarIds = new Set(similar.map((tool) => tool.id));
    const helpfulPrimary = tagMatches.filter((tool) => !similarIds.has(tool.id));
    const helpfulFallback = others.filter((tool) => !similarIds.has(tool.id));
    const helpful = buildList(helpfulPrimary, helpfulFallback);

    return {
      similarLinks: similar,
      helpfulLinks: helpful,
    };
  }, [pathname]);

  if (similarLinks.length === 0 && helpfulLinks.length === 0) return null;

  return (
    <section className="space-y-6">
      {similarLinks.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {locale === "en" ? "Similar calculators" : "Benzer hesaplayicilar"}
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              {locale === "en" ? "Related calculators" : "Ilgili hesaplayicilar"}
            </h2>
            <p className="text-sm text-slate-600">
              {locale === "en"
                ? "Explore calculators with similar categories or tags."
                : "Ayni kategori veya benzer etiketlere sahip hesaplayicilari burada bulabilirsin."}
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similarLinks.map((tool) => {
              const copy = getToolCopy(tool, locale);
              return (
                <ActionCard
                  key={tool.id}
                  title={copy.title}
                  description={copy.description}
                  href={tool.href}
                  toolId={tool.id}
                  ctaLabel={locale === "en" ? "Open calculator" : "Hesaplayiciyi Ac"}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {helpfulLinks.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {locale === "en" ? "Other picks" : "Diger oneriler"}
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              {locale === "en" ? "These might help too" : "Sunlar da isine yarayabilir"}
            </h2>
            <p className="text-sm text-slate-600">
              {locale === "en"
                ? "Review alternative calculators for adjacent needs."
                : "Yaklasik ihtiyaclar icin farkli hesaplayicilari gozden gecirebilirsin."}
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {helpfulLinks.map((tool) => {
              const copy = getToolCopy(tool, locale);
              return (
                <ActionCard
                  key={tool.id}
                  title={copy.title}
                  description={copy.description}
                  href={tool.href}
                  toolId={tool.id}
                  ctaLabel={locale === "en" ? "Open calculator" : "Hesaplayiciyi Ac"}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
