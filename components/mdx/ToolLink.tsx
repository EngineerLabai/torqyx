"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePath } from "@/utils/locale-path";

type ToolLinkProps = {
  href: string;
  title: string;
  description?: string;
  badge?: string;
};

export default function ToolLink({ href, title, description, badge }: ToolLinkProps) {
  const { locale } = useLocale();
  const resolvedHref = localePath(locale, href);
  return (
    <Link
      href={resolvedHref}
      className="group flex flex-col gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-emerald-900 group-hover:text-emerald-950">{title}</h3>
        {badge ? (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
            {badge}
          </span>
        ) : null}
      </div>
      {description ? <p className="text-xs leading-relaxed text-emerald-800/80">{description}</p> : null}
    </Link>
  );
}
