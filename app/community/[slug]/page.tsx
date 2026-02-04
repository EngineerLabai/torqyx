import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";
import { formatMessage, getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import { getThreads } from "../data";

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps) {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const threads = getThreads(locale);
  const thread = threads.find((t) => t.slug === params.slug);
  const copy = getMessages(locale).pages.community.thread;

  if (!thread) {
    return buildPageMetadata({
      title: `${copy.missingTitle} | ${brandContent.siteName}`,
      description: copy.missingDescription,
      path: `/community/${params.slug}`,
      locale,
    });
  }

  return buildPageMetadata({
    title: `${thread.title} | ${brandContent.siteName}`,
    description: thread.excerpt,
    path: `/community/${thread.slug}`,
    locale,
  });
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.community.thread;
  const threads = getThreads(locale);
  const thread = threads.find((t) => t.slug === params.slug);
  if (!thread) return notFound();
  const backHref = withLocalePrefix("/community", locale);

  return (
    <PageShell>
      <Link href={backHref} className="tap-target inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-600">
        {copy.backLabel}
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{thread.category}</span>
          <h1 className="text-xl font-semibold text-slate-900">{thread.title}</h1>
        </div>
        <p className="mt-2 text-sm text-slate-700">{thread.details}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
          <span>{formatMessage(copy.authorLabel, { author: thread.author })}</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span>{thread.updated}</span>
          <div className="flex flex-wrap gap-1">
            {thread.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{copy.repliesTitle}</h2>
        <div className="mt-3 space-y-2">
          {thread.replies.map((answer) => (
            <div key={`${answer.user}-${answer.time}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center justify-between text-[12px] text-slate-600">
                <span className="font-semibold text-slate-800">{answer.user}</span>
                <span>{answer.time}</span>
              </div>
              <p className="text-sm text-slate-700">{answer.text}</p>
            </div>
          ))}
        </div>

        <form className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
          <label className="text-xs font-semibold text-slate-700" htmlFor="reply">
            {copy.replyLabel}
          </label>
          <textarea
            id="reply"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder={copy.replyPlaceholder}
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500"
            >
              {copy.replyCta}
            </button>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
