import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import { extractToc, getContentBySlug, getContentList } from "@/utils/content";
import { BRAND_NAME } from "@/utils/brand";
import { DEFAULT_OG_IMAGE_META, buildCanonical, SITE_URL } from "@/utils/seo";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

type GuidePageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const guides = await getContentList("guides");
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = await getContentBySlug("guides", params.slug);

  if (!guide) {
    return {
      title: "Icerik bulunamadi",
      description: "Istenen rehber bulunamadi.",
    };
  }

  const canonical = guide.canonical ?? buildCanonical(`/guides/${guide.slug}`);

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.tags,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: canonical ?? `/guides/${guide.slug}`,
      publishedTime: guide.date,
      tags: guide.tags,
      images: [DEFAULT_OG_IMAGE_META],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [DEFAULT_OG_IMAGE_META.url],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getContentBySlug("guides", params.slug);

  if (!guide) {
    notFound();
  }

  const canonical = guide.canonical ?? buildCanonical(`/guides/${guide.slug}`) ?? `/guides/${guide.slug}`;
  const logoUrl = new URL("/icons/logo-mark.svg", SITE_URL).toString();
  const articleJsonLd = {
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    dateModified: guide.date,
    url: canonical,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    image: [logoUrl],
    keywords: guide.tags.join(", "),
    inLanguage: "tr-TR",
  };
  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana sayfa",
        item: buildCanonical("/") ?? `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Rehberler",
        item: buildCanonical("/guides") ?? `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: canonical,
      },
    ],
  };
  const guideJsonLd = {
    "@context": "https://schema.org",
    "@graph": [articleJsonLd, breadcrumbJsonLd],
  };

  const toc = extractToc(guide.content);

  return (
    <PageShell>
      <JsonLd data={guideJsonLd} />
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <Link href="/guides" className="text-xs font-semibold text-sky-700 hover:underline">
            Rehberler listesine don
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700">{guide.category}</span>
            <span>{formatDate(guide.date)}</span>
            <span>|</span>
            <span>{guide.readingTimeMinutes} dk okuma</span>
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            {guide.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{guide.description}</p>
          <div className="flex flex-wrap gap-2">
            {guide.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <aside className="order-1 lg:order-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm lg:sticky lg:top-24">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Icerik</div>
              {toc.length === 0 ? (
                <p className="text-xs text-slate-500">Bu rehberde baslik bulunmuyor.</p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-600">
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? "pl-4" : item.level === 4 ? "pl-7" : "pl-0"}>
                      <a href={`#${item.id}`} className="hover:text-sky-700">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <div className="order-2 space-y-6 mdx-content lg:order-1">
            <MDXRenderer source={guide.content} />
          </div>
        </div>
      </article>
    </PageShell>
  );
}
