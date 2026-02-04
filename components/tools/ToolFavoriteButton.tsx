"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import useToolFavorites from "@/components/tools/useToolFavorites";
import { formatMessage, getMessages } from "@/utils/messages";

type ToolFavoriteButtonProps = {
  toolId: string;
  toolTitle?: string;
  size?: "sm" | "md";
  className?: string;
};

export default function ToolFavoriteButton({ toolId, toolTitle, size = "md", className = "" }: ToolFavoriteButtonProps) {
  const { locale } = useLocale();
  const { isFavorite, toggleFavorite } = useToolFavorites();
  const active = isFavorite(toolId);

  const copy = useMemo(() => getMessages(locale).components.toolFavoriteButton, [locale]);
  const title = toolTitle ?? copy.fallbackTitle;
  const label = active ? copy.removeLabel : copy.addLabel;
  const ariaLabel = formatMessage(active ? copy.removeAria : copy.addAria, { title });
  const sizeClasses = size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1 text-[11px]";
  const toneClasses = active
    ? "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300"
    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300";

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(toolId)}
      className={`inline-flex items-center gap-2 rounded-full border font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${sizeClasses} ${toneClasses} ${className}`.trim()}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      <span>{label}</span>
    </button>
  );
}
