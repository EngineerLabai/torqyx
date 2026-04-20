import type { ReactNode } from "react";
import Link from "next/link";
import AccessBadge from "@/components/tools/AccessBadge";
import ToolBadge from "@/components/tools/ToolBadge";
import ToolFavoriteButton from "@/components/tools/ToolFavoriteButtonLazy";
import type { Locale } from "@/utils/locale";
import type { ToolAccess, ToolStatus } from "@/tools/_shared/catalog";

type ToolLibraryCardProps = {
  toolId: string;
  title: string;
  titleDisplay?: ReactNode;
  description: string;
  descriptionDisplay?: ReactNode;
  href: string;
  guideHref?: string;
  guideLabel?: string;
  usageLabel: string;
  typeLabel?: string;
  typeTone?: "calculator" | "bundle" | "guide";
  tags?: string[];
  accessLabel?: string;
  accessTone?: ToolAccess;
  status: ToolStatus;
  validationStandard?: string;
  locale: Locale;
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
  guideHref,
  guideLabel,
  usageLabel,
  typeLabel,
  typeTone = "calculator",
  tags,
  accessLabel,
  accessTone = "free",
  status,
  validationStandard,
  locale,
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
    <article className="group flex h-full min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between">
        <div className="space-y-3">
          <h3 className="min-w-0 break-words text-base font-semibold leading-snug text-slate-900">
            {titleDisplay ?? title}
          </h3>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {typeLabel ? (
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeToneClass}`.trim()}>
                {typeLabel}
              </span>
            ) : null}
            {isNew ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                NEW
              </span>
            ) : null}
            <ToolFavoriteButton toolId={toolId} toolTitle={title} size="sm" />
          </div>

          <div>
            <ToolBadge status={status} standard={validationStandard} locale={locale} />
          </div>

          {accessLabel ? (
            <div>
              <AccessBadge access={accessTone} label={accessLabel} size="sm" />
            </div>
          ) : null}

          <div>
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {usageLabel}
            </span>
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

        <div className="mt-5 space-y-2">
          <Link
            href={href}
            prefetch={false}
            className="btn-cta tap-target inline-flex w-full items-center justify-center rounded-md text-center text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            aria-label={ariaLabel}
          >
            {ctaLabel}
          </Link>
          {guideHref && guideLabel ? (
            <div>
              <Link
                href={guideHref}
                prefetch={false}
                className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 hover:border-sky-300 hover:bg-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                aria-label={`${title} - ${guideLabel}`}
              >
                {guideLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
