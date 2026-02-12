"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";

type PremiumVariant = "compact" | "full";

type PremiumCTAProps = {
  variant?: PremiumVariant;
  className?: string;
};

export default function PremiumCTA({ variant = "compact", className = "" }: PremiumCTAProps) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.premiumCTA;
  const supportHref = withLocalePrefix("/support", locale);
  const premiumHref = withLocalePrefix("/pricing", locale);
  const rootClassName = `${className} ${variant === "compact" ? "" : ""}`.trim();

  if (variant === "compact") {
    return (
      <div className={`rounded-2xl border border-amber-100 bg-amber-50/80 p-4 shadow-sm ${rootClassName}`.trim()}>
        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">{copy.badge}</p>
            <h3 className="text-sm font-semibold text-slate-900">{copy.title}</h3>
            <p className="text-xs text-slate-600">{copy.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href={supportHref}
              className="rounded-full bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-amber-500"
            >
              {copy.ctaPrimary}
            </Link>
            <Link
              href={premiumHref}
              className="rounded-full border border-amber-200 px-4 py-2 font-semibold text-amber-700 hover:border-amber-300 hover:bg-amber-100"
            >
              {copy.ctaSecondary}
            </Link>
            <span className="text-[11px] text-amber-700/80">{copy.supportNote}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${rootClassName}`.trim()}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] text-amber-700 md:text-xs">
            <span className="font-semibold">{copy.badge}</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            {copy.title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">{copy.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link
              href={supportHref}
              className="rounded-full bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-amber-500"
            >
              {copy.ctaPrimary}
            </Link>
            <Link
              href={premiumHref}
              className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              {copy.ctaSecondary}
            </Link>
            <span className="text-[11px] text-slate-500">{copy.supportNote}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.packageTitle}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {copy.packageItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.statusTitle}</h2>
          <p className="mt-2 text-sm text-slate-700">{copy.statusBody}</p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {copy.stepsTitle}
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {copy.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
