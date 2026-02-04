"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import ToolFavoriteButton from "@/components/tools/ToolFavoriteButtonLazy";
import useToolRecents from "@/components/tools/useToolRecents";
import { formatMessage, getMessages } from "@/utils/messages";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";

type RecentToolsStripProps = {
  tone?: "light" | "dark";
  className?: string;
  maxItems?: number;
};

export default function RecentToolsStrip({ tone = "light", className = "", maxItems = 6 }: RecentToolsStripProps) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.recentTools;
  const { recents } = useToolRecents();

  const items = useMemo(() => {
    const mapped = recents
      .map((entry) => ({
        entry,
        tool: toolCatalog.find((tool) => tool.id === entry.toolId) ?? null,
      }))
      .filter((item): item is { entry: typeof recents[number]; tool: (typeof toolCatalog)[number] } => Boolean(item.tool));
    return mapped.slice(0, maxItems);
  }, [recents, maxItems]);

  const toneClasses =
    tone === "dark"
      ? {
          container: "border-white/10 bg-white/5 text-white",
          title: "text-white",
          description: "text-slate-300",
          card: "border-white/10 bg-black/30 text-white hover:border-white/30",
          cardText: "text-slate-200",
          cardMuted: "text-slate-400",
        }
      : {
          container: "border-slate-200 bg-white text-slate-900",
          title: "text-slate-900",
          description: "text-slate-600",
          card: "border-slate-200 bg-white text-slate-900 hover:border-slate-300",
          cardText: "text-slate-700",
          cardMuted: "text-slate-500",
        };

  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${toneClasses.container} ${className}`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className={`text-base font-semibold ${toneClasses.title}`}>{copy.title}</h2>
          <p className={`text-xs ${toneClasses.description}`}>{copy.description}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={`mt-4 rounded-2xl border border-dashed p-4 text-xs ${toneClasses.cardMuted}`}>
          {copy.empty}
        </div>
      ) : (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {items.map(({ tool }) => {
            const toolCopy = getToolCopy(tool, locale);
            return (
              <div
                key={tool.id}
                className={`relative min-w-[220px] flex-1 rounded-2xl border p-4 shadow-sm transition ${toneClasses.card}`}
              >
                <div className="absolute right-3 top-3">
                  <ToolFavoriteButton toolId={tool.id} toolTitle={toolCopy.title} size="sm" />
                </div>
                <Link
                  href={tool.href}
                  aria-label={formatMessage(copy.open, { title: toolCopy.title })}
                  className="block space-y-2 pr-10"
                >
                  <p className={`text-sm font-semibold ${toneClasses.title}`}>{toolCopy.title}</p>
                  <p className={`text-xs leading-relaxed ${toneClasses.cardText}`}>{toolCopy.description}</p>
                </Link>
                <p className={`mt-3 text-[10px] uppercase tracking-[0.2em] ${toneClasses.cardMuted}`}>
                  {tool.category ?? copy.generalCategory}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
