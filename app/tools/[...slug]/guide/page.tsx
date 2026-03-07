import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import { getBrandCopy } from "@/config/brand";
import { getToolGuideBySlug, toToolSlugFromPathParts } from "@/lib/tool-guides";
import { toolCatalog } from "@/tools/_shared/catalog";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildPageMetadata } from "@/utils/metadata";
import { buildLanguageAlternates, buildLocalizedCanonical, SITE_URL } from "@/utils/seo";

type GuideRoutePageProps = {
  params: Promise<{ slug: string[] }>;
};

type CopySet = {
  badge: string;
  backToTool: string;
  tocTitle: string;
  tocEmpty: string;
  standardsTitle: string;
  relatedTitle: string;
  relatedDescription: string;
  openTool: string;
  openGuide: string;
  breadcrumbHome: string;
  breadcrumbTools: string;
  readGuide: string;
};

const getCopy = (locale: "tr" | "en"): CopySet => {
  if (locale === "en") {
    return {
      badge: "Tool Guide",
      backToTool: "Back to tool",
      tocTitle: "Contents",
      tocEmpty: "No heading detected yet.",
      standardsTitle: "Relevant Standards",
      relatedTitle: "Related Tools",
      relatedDescription: "Automatic suggestions based on slug, category, and shared tags.",
      openTool: "Open tool",
      openGuide: "How to use",
      breadcrumbHome: "Home",
      breadcrumbTools: "Tools",
      readGuide: "Guide",
    };
  }

  return {
    badge: "Arac Rehberi",
    backToTool: "Araca don",
    tocTitle: "Icindekiler",
    tocEmpty: "Henuz baslik bulunmuyor.",
    standardsTitle: "Ilgili Standartlar",
    relatedTitle: "Ilgili Araclar",
    relatedDescription: "Slug, kategori ve ortak etiketlere gore otomatik oneriler.",
    openTool: "Araci ac",
    openGuide: "Nasil kullanilir",
    breadcrumbHome: "Ana sayfa",
    breadcrumbTools: "Araclar",
    readGuide: "Rehber",
  };
};

export async function generateStaticParams() {
  const params = new Map<string, { slug: string[] }>();

  toolCatalog.forEach((tool) => {
    if (!tool.href.startsWith("/tools/")) return;
    const slug = tool.href.replace(/^\/tools\//, "").replace(/^\/+|\/+$/g, "");
    if (!slug) return;
    const parts = slug.split("/").filter(Boolean);
    params.set(parts.join("/"), { slug: parts });
  });

  return Array.from(params.values());
}

export async function generateMetadata({ params }: GuideRoutePageProps): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { slug } = await params;
  const toolSlug = toToolSlugFromPathParts(slug ?? []);
  const guide = await getToolGuideBySlug({ slug: toolSlug, locale });

  if (!guide) {
    return buildPageMetadata({
      title: locale === "tr" ? "Rehber bulunamadi" : "Guide not found",
      description:
        locale === "tr"
          ? "Istenen arac rehberi bulunamadi."
          : "The requested tool guide could not be found.",
      path: `/tools/${toolSlug}/guide`,
      locale,
      type: "article",
    });
  }

  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/tools/${guide.slug}/guide`,
    locale,
    type: "article",
    keywords: [...(guide.tool.tags ?? []), "guide", "how-to"],
    alternatesLanguages: buildLanguageAlternates(`/tools/${guide.slug}/guide`),
    openGraph: {
      type: "article",
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      tags: guide.tool.tags ?? [],
    },
  });
}

export default async function ToolGuidePage({ params }: GuideRoutePageProps) {
  const locale = await getLocaleFromCookies();
  const copy = getCopy(locale);
  const { slug } = await params;
  const toolSlug = toToolSlugFromPathParts(slug ?? []);
  const guide = await getToolGuideBySlug({ slug: toolSlug, locale });

  if (!guide) {
    notFound();
  }

  const canonical = buildLocalizedCanonical(`/tools/${guide.slug}/guide`, locale);
  const toolHref = withLocalePrefix(guide.tool.href, locale);
  const listHref = withLocalePrefix("/tools", locale);
  const brand = getBrandCopy(locale);
  const logoUrl = new URL("/images/logo.png", SITE_URL).toString();

  const articleJsonLd = {
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    author: {
      "@type": "Organization",
      name: brand.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: brand.siteName,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    image: [logoUrl],
  };

  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: copy.breadcrumbHome,
        item: buildLocalizedCanonical("/", locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.breadcrumbTools,
        item: buildLocalizedCanonical("/tools", locale),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.tool.title,
        item: buildLocalizedCanonical(guide.tool.href, locale),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: copy.readGuide,
        item: canonical,
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [articleJsonLd, breadcrumbJsonLd] }} />
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <Link href={toolHref} className="text-xs font-semibold text-sky-700 hover:underline">
            {copy.backToTool}
          </Link>
          <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
            {copy.badge}
          </span>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            {guide.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{guide.description}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-8 mdx-content">
            <section className="space-y-4">
              <MDXRenderer source={guide.content} locale={locale} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-900">{copy.standardsTitle}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {guide.standards.map((standard) => (
                  <span
                    key={standard}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {standard}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{copy.relatedTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{copy.relatedDescription}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {guide.relatedTools.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={withLocalePrefix(item.href, locale)}
                        className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        {copy.openTool}
                      </Link>
                      <Link
                        href={withLocalePrefix(item.guideHref, locale)}
                        className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                      >
                        {copy.openGuide}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm lg:sticky lg:top-24">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {copy.tocTitle}
              </div>
              {guide.toc.length === 0 ? (
                <p className="text-xs text-slate-500">{copy.tocEmpty}</p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-600">
                  {guide.toc.map((item) => (
                    <li
                      key={item.id}
                      className={item.level === 3 ? "pl-4" : item.level === 4 ? "pl-7" : "pl-0"}
                    >
                      <a href={`#${item.id}`} className="hover:text-sky-700">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 border-t border-slate-200 pt-3">
                <Link href={listHref} className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                  {copy.breadcrumbTools}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PageShell>
  );
}

