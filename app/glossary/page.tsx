import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import { getContentList } from "@/utils/content";
import { DEFAULT_OG_IMAGE_META, buildCanonical } from "@/utils/seo";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

const GLOSSARY_DESCRIPTION = "Teknik terimler ve kisa tanimlar.";
const GLOSSARY_CANONICAL = buildCanonical("/glossary");

export const metadata: Metadata = {
  title: "Sozluk",
  description: GLOSSARY_DESCRIPTION,
  alternates: {
    canonical: GLOSSARY_CANONICAL ?? "/glossary",
  },
  openGraph: {
    title: "Sozluk",
    description: GLOSSARY_DESCRIPTION,
    type: "website",
    url: GLOSSARY_CANONICAL ?? "/glossary",
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sozluk",
    description: GLOSSARY_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_META.url],
  },
};

export default async function GlossaryIndexPage() {
  const terms = await getContentList("glossary");

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <svg
              className="hero-illustration text-orange-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
              <path d="M8 8h8M8 12h5M8 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] text-orange-700 md:text-xs">
              <span className="font-semibold">Sozluk</span>
            </div>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">
            Teknik terimler ve kisa tanimlar
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Disli, tork ve uretim terminolojisindeki kritik kavramlar tek yerde.
          </p>
        </div>
      </section>

      <section className="grid gap-4">
        {terms.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            Henuz yayinlanmis terim yok.
          </div>
        ) : (
          terms.map((term) => (
            <Link
              key={term.slug}
              href={`/glossary/${term.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-950">{term.title}</h2>
                  <p className="text-sm text-slate-600">{term.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                  {term.category}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>{formatDate(term.date)}</span>
                <span>|</span>
                <span>{term.readingTimeMinutes} dk okuma</span>
                {term.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        )}
      </section>
    </PageShell>
  );
}
