import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import { BRAND_NAME } from "@/utils/brand";
import { DEFAULT_OG_IMAGE_META, buildCanonical } from "@/utils/seo";
import { getChangelogEntries } from "@/utils/changelog";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

export const metadata: Metadata = {
  title: `Changelog | ${BRAND_NAME}`,
  description: "Yeni araclar, duzeltmeler ve guncellemelerin tam listesi.",
  alternates: {
    canonical: buildCanonical("/changelog") ?? "/changelog",
  },
  openGraph: {
    title: `Changelog | ${BRAND_NAME}`,
    description: "Yeni araclar, duzeltmeler ve guncellemelerin tam listesi.",
    type: "website",
    url: buildCanonical("/changelog") ?? "/changelog",
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: `Changelog | ${BRAND_NAME}`,
    description: "Yeni araclar, duzeltmeler ve guncellemelerin tam listesi.",
    images: [DEFAULT_OG_IMAGE_META.url],
  },
};

export default async function ChangelogPage() {
  const entries = await getChangelogEntries();

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 md:text-xs">
            <span className="font-semibold">Changelog</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">
            Yenilikler ve guncellemeler
          </h1>
          <p className="text-sm text-slate-600">
            Yeni eklenen araclar, duzeltmeler ve genel degisiklikler burada listelenir.
          </p>
        </div>
      </section>

      {entries.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-slate-700">Henuz changelog yok.</p>
          <p className="mt-1 text-xs text-slate-500">Ilk guncelleme yakinda eklenecek.</p>
        </section>
      ) : (
        <section className="space-y-6">
          {entries.map((entry) => (
            <article key={entry.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">v{entry.version}</span>
                <span>{formatDate(entry.date)}</span>
              </div>
              <div className="mt-3 space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">{entry.title}</h2>
                <p className="text-sm text-slate-600">{entry.description}</p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Eklenen tool'lar</h3>
                  {entry.addedTools.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-500">Bu surumde yeni tool eklenmedi.</p>
                  ) : (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                      {entry.addedTools.map((tool) => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Duzeltmeler</h3>
                  {entry.fixes.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-500">Bu surumde duzeltme kaydi yok.</p>
                  ) : (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                      {entry.fixes.map((fix) => (
                        <li key={fix}>{fix}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {entry.content.trim().length > 0 ? (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mdx-content space-y-4 text-sm text-slate-700">
                    <MDXRenderer source={entry.content} />
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </PageShell>
  );
}
