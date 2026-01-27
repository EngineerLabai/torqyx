import Link from "next/link";

type ToolLibraryCardProps = {
  title: string;
  description: string;
  href: string;
  usageLabel: string;
  tags?: string[];
  ctaLabel: string;
  ariaLabel: string;
};

export default function ToolLibraryCard({
  title,
  description,
  href,
  usageLabel,
  tags,
  ctaLabel,
  ariaLabel,
}: ToolLibraryCardProps) {
  return (
    <Link
      href={href}
      className="group block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      aria-label={ariaLabel}
    >
      <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm transition group-hover:border-slate-300 group-hover:shadow-md">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="break-words text-base font-semibold leading-snug text-slate-900">{title}</h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              {usageLabel}
            </span>
          </div>
          <p className="break-words text-sm leading-relaxed text-slate-600">{description}</p>
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
        <div className="mt-4">
          <span className="btn-cta tap-target block w-full rounded-md text-center text-xs font-semibold">
            {ctaLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}
