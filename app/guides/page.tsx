import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import { getContentList } from "@/utils/content";
import { buildCanonical } from "@/utils/seo";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

const GUIDES_DESCRIPTION = "Adim adim hesaplama ve uygulama rehberleri.";
const GUIDES_CANONICAL = buildCanonical("/guides");

export const metadata: Metadata = {
  title: "Guides",
  description: GUIDES_DESCRIPTION,
  alternates: {
    canonical: GUIDES_CANONICAL ?? "/guides",
  },
  openGraph: {
    title: "Guides",
    description: GUIDES_DESCRIPTION,
    type: "website",
    url: GUIDES_CANONICAL ?? "/guides",
  },
  twitter: {
    card: "summary",
    title: "Guides",
    description: GUIDES_DESCRIPTION,
  },
};

export default async function GuidesIndexPage() {
  const guides = await getContentList("guides");
  const grouped = guides.reduce<Record<string, typeof guides>>((acc, guide) => {
    const key = guide.category || "Diger";
    if (!acc[key]) acc[key] = [];
    acc[key].push(guide);
    return acc;
  }, {});
  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "tr-TR"));

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <svg
              className="hero-illustration text-sky-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
              <path d="M7 8h10M7 12h10M7 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 6l1-2 1 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] text-sky-700 md:text-xs">
              <span className="font-semibold">Guides</span>
            </div>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">
            Adim adim hesaplama ve uygulama rehberleri
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
            Malzeme secimi, kalite kontrolu ve uretim akislari icin pratik notlar.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        {guides.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            Henuz yayinlanmis rehber yok.
          </div>
        ) : (
          categories.map((category) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {category}
                </span>
                <span className="text-xs text-slate-400">{grouped[category].length} rehber</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {grouped[category].map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <h2 className="text-lg font-semibold text-slate-900 group-hover:text-slate-950">{guide.title}</h2>
                      <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{guide.description}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>{formatDate(guide.date)}</span>
                      <span>|</span>
                      <span>{guide.readingTimeMinutes} dk okuma</span>
                      {guide.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </PageShell>
  );
}
