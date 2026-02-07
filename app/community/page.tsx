// app/community/page.tsx
import Link from "next/link";
import AuthGate from "@/components/auth/AuthGate";
import CommentStream from "@/components/community/CommentStream";
import CommunityAuthCta from "@/components/community/CommunityAuthCta";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";
import { formatMessage, getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import { getThreads } from "./data";

const isSampleContent = true;

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).pages.community;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/community",
    locale,
  });
}

export default async function CommunityPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.community;
  const threads = getThreads(locale);
  const baseHref = withLocalePrefix("/community", locale);
  const heroImage = getHeroImageSrc("community");

  return (
    <PageShell>
      <AuthGate mode="notice">
        <PageHero
          title={copy.title}
          description={copy.description}
          eyebrow={copy.badge}
          imageSrc={heroImage}
          imageAlt={copy.imageAlt}
        >
          {isSampleContent ? (
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
              {copy.sampleBadge}
            </span>
          ) : null}
        </PageHero>

        <CommunityAuthCta />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{copy.form.title}</h2>
            <p className="text-sm text-slate-600">{copy.form.description}</p>
          </div>

          <form className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700" htmlFor="topic-title">
                  {copy.form.titleLabel}
                </label>
                <input
                  id="topic-title"
                  name="topic-title"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder={copy.form.titlePlaceholder}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700" htmlFor="topic-category">
                  {copy.form.categoryLabel}
                </label>
                <select
                  id="topic-category"
                  name="topic-category"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                >
                  {copy.form.categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700" htmlFor="topic-body">
                {copy.form.bodyLabel}
              </label>
              <textarea
                id="topic-body"
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                placeholder={copy.form.bodyPlaceholder}
              />
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p className="text-[11px] text-slate-600">{copy.form.helper}</p>
              <button
                type="button"
                className="tap-target inline-flex items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-500"
              >
                {copy.form.submit}
              </button>
            </div>
          </form>
        </section>

        <section id="community-topics" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{copy.stream.kicker}</p>
            <h2 className="text-base font-semibold text-slate-900">{copy.stream.title}</h2>
            <p className="text-sm text-slate-700">{copy.stream.description}</p>
          </div>
          <div className="mt-4">
            <CommentStream />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900">{copy.recent.title}</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {formatMessage(copy.recent.countLabel, { count: threads.length })}
              </span>
              {isSampleContent ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  {copy.sampleBadge}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {threads.map((thread) => (
              <Link
                key={thread.slug}
                href={`${baseHref}/${thread.slug}`}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm transition hover:border-purple-200 hover:bg-purple-50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{thread.category}</span>
                  {isSampleContent ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      {copy.sampleBadge}
                    </span>
                  ) : null}
                  <h3 className="font-semibold text-slate-900">{thread.title}</h3>
                </div>
                <p className="mt-2 text-slate-700">{thread.excerpt}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
                  <span>{formatMessage(copy.recent.replyCount, { count: thread.replies.length })}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-400" />
                  <span>{thread.updated}</span>
                  <div className="flex flex-wrap gap-1">
                    {thread.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </AuthGate>
    </PageShell>
  );
}



