import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ChangelogToolFilter from "@/components/changelog/ChangelogToolFilter";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import { getBrandCopy } from "@/config/brand";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { getChangelogEntries, type ChangelogBadge } from "@/utils/changelog";
import { withLocalePrefix } from "@/utils/locale-path";
import type { Locale } from "@/utils/locale";

export const dynamic = "force-static";

const CHANGELOG_LOCALE: Locale = "tr";
const CHANGELOG_LIST_ID = "changelog-entry-list";

const formatDate = (value: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(new Date(value));

const BADGE_CLASS: Record<ChangelogBadge, string> = {
  new: "border-emerald-200 bg-emerald-50 text-emerald-700",
  fixed: "border-amber-200 bg-amber-50 text-amber-700",
  removed: "border-rose-200 bg-rose-50 text-rose-700",
};

const getBadgeLabel = (
  badge: ChangelogBadge,
  copy: {
    badgeNew: string;
    badgeFixed: string;
    badgeRemoved: string;
  },
) => {
  if (badge === "new") return copy.badgeNew;
  if (badge === "removed") return copy.badgeRemoved;
  return copy.badgeFixed;
};

export async function generateMetadata() {
  const brandContent = getBrandCopy(CHANGELOG_LOCALE);
  const copy = getMessages(CHANGELOG_LOCALE).pages.changelog;

  return buildPageMetadata({
    title: `${copy.badge} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/changelog",
    locale: CHANGELOG_LOCALE,
  });
}

export default async function ChangelogPage() {
  const locale = CHANGELOG_LOCALE;
  const copy = getMessages(locale).pages.changelog;
  const entries = await getChangelogEntries(locale, { includeDrafts: false });
  const feedHref = withLocalePrefix("/changelog/feed.xml", locale);
  const toolOptions = Array.from(
    entries.reduce((acc, entry) => {
      const current = acc.get(entry.toolSlug);
      if (!current) {
        acc.set(entry.toolSlug, { value: entry.toolSlug, label: entry.tool, count: 1 });
        return acc;
      }

      current.count += 1;
      return acc;
    }, new Map<string, { value: string; label: string; count: number }>()),
  )
    .map(([, value]) => value)
    .sort((a, b) => a.label.localeCompare(b.label, locale === "en" ? "en-US" : "tr-TR"));

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 md:text-xs">
              <span className="font-semibold">{copy.badge}</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">{copy.title}</h1>
            <p className="text-sm text-slate-600">{copy.description}</p>
          </div>
          <Link
            href={feedHref}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {copy.feedLabel}
          </Link>
        </div>
      </section>

      {entries.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">{copy.emptyTitle}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.emptyDescription}</p>
        </section>
      ) : (
        <section className="space-y-4">
          <ChangelogToolFilter
            listId={CHANGELOG_LIST_ID}
            allLabel={copy.filterAll}
            filterLabel={copy.filterLabel}
            resultLabelTemplate={copy.resultsLabel}
            tools={toolOptions}
            totalCount={entries.length}
          />

          <div id={CHANGELOG_LIST_ID} className="space-y-4">
            {entries.map((entry) => (
              <article
                id={entry.slug}
                key={entry.slug}
                data-changelog-tool={entry.toolSlug}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">v{entry.version}</span>
                  <span>{formatDate(entry.date, locale)}</span>
                  <span className={`rounded-full border px-2 py-1 font-semibold ${BADGE_CLASS[entry.badge]}`}>
                    {getBadgeLabel(entry.badge, copy)}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-semibold text-slate-900">{entry.tool}</h2>

                <div className="mdx-content mt-3 space-y-4 text-sm text-slate-700">
                  <MDXRenderer source={entry.description} locale={locale} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
