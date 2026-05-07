import Link from "next/link";
import Image from "next/image";
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

const getMarkdownPreview = (markdown: string) =>
  markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function ChangelogSection({ locale, latest }: ChangelogSectionProps) {
  const copy = getMessages(locale).home.changelog;
  const changelogHref = withLocalePrefix("/changelog", locale);
  const blogHref = withLocalePrefix("/blog", locale);

  return (
    <section id="changelog" className="w-full py-12">
      <div className="site-container space-y-6">
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
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{latest.tool}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{getMarkdownPreview(latest.description)}</p>
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
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Image
              src="/images/empty-state.webp"
              alt="Empty toolbox"
              width={120}
              height={120}
              className="mb-4 opacity-80"
            />
            <p className="text-sm font-medium text-slate-600">{copy.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}
