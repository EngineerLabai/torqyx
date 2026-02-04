import Link from "next/link";
import type { Locale } from "@/utils/locale";
import type { ChangelogEntry } from "@/utils/changelog";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";

type ChangelogSectionProps = {
  locale: Locale;
  latest: ChangelogEntry | null;
};

const formatDate = (value: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );

export default function ChangelogSection({ locale, latest }: ChangelogSectionProps) {
  const copy = getMessages(locale).home.changelog;
  const changelogHref = withLocalePrefix("/changelog", locale);
  const blogHref = withLocalePrefix("/blog", locale);

  return (
    <section id="changelog" className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.description}</p>
        </div>

        {latest ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
              <span>{copy.latestLabel}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">v{latest.version}</span>
              <span className="text-slate-400">{formatDate(latest.date, locale)}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{latest.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{latest.description}</p>
            {latest.addedTools.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {latest.addedTools.slice(0, 4).map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={changelogHref}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-emerald-700"
              >
                {copy.ctaPrimary}
              </Link>
              <Link
                href={blogHref}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            {copy.empty}
          </div>
        )}
      </div>
    </section>
  );
}
