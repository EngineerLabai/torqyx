import type { ReactNode } from "react";
import Link from "next/link";
import AccessBadge from "@/components/tools/AccessBadge";
import ToolFavoriteButton from "@/components/tools/ToolFavoriteButtonLazy";
import type { ToolAccess } from "@/tools/_shared/catalog";

type ToolLibraryCardProps = {
  toolId: string;
  title: string;
  titleDisplay?: ReactNode;
  description: string;
  descriptionDisplay?: ReactNode;
  href: string;
  usageLabel: string;
  typeLabel?: string;
  typeTone?: "calculator" | "bundle" | "guide";
  tags?: string[];
  accessLabel?: string;
  accessTone?: ToolAccess;
  ctaLabel: string;
  ariaLabel: string;
  isNew?: boolean;
};

export default function ToolLibraryCard({
  toolId,
  title,
  titleDisplay,
  description,
  descriptionDisplay,
  href,
  usageLabel,
  typeLabel,
  typeTone = "calculator",
  tags,
  accessLabel,
  accessTone = "free",
  ctaLabel,
  ariaLabel,
  isNew = false,
}: ToolLibraryCardProps) {
  const typeToneClass = {
    calculator: "bg-emerald-100 text-emerald-700",
    bundle: "bg-amber-100 text-amber-700",
    guide: "bg-sky-100 text-sky-700",
  }[typeTone];

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <Link
        href={href}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        aria-label={ariaLabel}
      >
        <span className="sr-only">{ariaLabel}</span>
      </Link>
      <div className="absolute right-4 top-4 z-20">
        <ToolFavoriteButton toolId={toolId} toolTitle={title} size="sm" />
      </div>
      <div className="relative z-0 space-y-2">
        <div className="flex items-start justify-between gap-2 pr-12">
          <h3 className="break-words text-base font-semibold leading-snug text-slate-900">{titleDisplay ?? title}</h3>
          <div className="flex flex-col items-end gap-1">
            {typeLabel ? (
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${typeToneClass}`.trim()}>
                {typeLabel}
              </span>
            ) : null}
            {accessLabel ? <AccessBadge access={accessTone} label={accessLabel} /> : null}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              {usageLabel}
            </span>
            {isNew ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                NEW
              </span>
            ) : null}
          </div>
        </div>
        <p className="break-words text-sm leading-relaxed text-slate-600">{descriptionDisplay ?? description}</p>
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="relative z-0 mt-4">
        <span className="btn-cta tap-target block w-full rounded-md text-center text-xs font-semibold">
          {ctaLabel}
        </span>
      </div>
    </article>
  );
}
