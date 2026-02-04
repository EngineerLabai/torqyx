"use client";

import Link from "next/link";
import ToolFavoriteButton from "@/components/tools/ToolFavoriteButtonLazy";

type ActionCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
  ctaLabel?: string;
  toolId?: string;
};

export default function ActionCard({
  title,
  description,
  href,
  badge,
  ctaLabel = "Detaylari Gor",
  toolId,
}: ActionCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="break-words text-base font-semibold leading-snug text-slate-900">{title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {badge ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {badge}
              </span>
            ) : null}
            {toolId ? <ToolFavoriteButton toolId={toolId} toolTitle={title} size="sm" /> : null}
          </div>
        </div>
        <p className="break-words text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
      <div className="mt-4">
        <Link href={href} className="btn-cta tap-target block w-full rounded-md text-center text-xs font-semibold">
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
