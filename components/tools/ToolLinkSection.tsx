"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import ActionCard from "@/components/ui/ActionCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { stripLocaleFromPath, withLocalePrefix } from "@/utils/locale-path";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";

const MAX_LINKS = 4;

export default function ToolLinkSection() {
  const pathname = usePathname() ?? "";
  const { locale } = useLocale();
  const copy = getMessages(locale).components.toolLinkSection;

  const similarLinks = useMemo(() => {
    const normalized = stripLocaleFromPath(pathname).replace(/\/$/, "");
    const current = toolCatalog.find(
      (tool) => normalized === tool.href || normalized.startsWith(`${tool.href}/`)
    );

    if (!current || !current.category) return [];

    // Strictly candidates from the exact same category, excluding current tool
    const sameCategoryCandidates = toolCatalog.filter(
      (tool) => tool.id !== current.id && tool.category === current.category
    );

    if (sameCategoryCandidates.length === 0) return [];

    const currentTags = new Set(current.tags ?? []);

    const scored = sameCategoryCandidates.map((tool) => {
      let tagMatchCount = 0;
      (tool.tags ?? []).forEach((tag) => {
        if (currentTags.has(tag)) {
          tagMatchCount += 1;
        }
      });
      // Score: category match (1) + tag matches (2 per matching tag)
      const score = 1 + tagMatchCount * 2;
      return { tool, score };
    });

    // Sort by score descending; preserve deterministic ordering on tie
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.tool.id.localeCompare(b.tool.id);
    });

    return scored.slice(0, MAX_LINKS).map((item) => item.tool);
  }, [pathname]);

  if (similarLinks.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {copy.similar.eyebrow}
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            {copy.similar.title}
          </h2>
          <p className="text-sm text-slate-600">
            {copy.similar.description}
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similarLinks.map((tool) => {
            const toolCopy = getToolCopy(tool, locale);
            return (
              <ActionCard
                key={tool.id}
                title={toolCopy.title}
                description={toolCopy.description}
                href={withLocalePrefix(tool.href, locale)}
                toolId={tool.id}
                ctaLabel={copy.similar.cta}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
