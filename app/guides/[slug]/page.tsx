import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import { extractToc, getContentBySlug, getContentLocaleAvailability, getContentSlugs } from "@/utils/content";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { formatMessage, getMessages } from "@/utils/messages";
import { buildLanguageAlternates, buildLocalizedCanonical, SITE_URL } from "@/utils/seo";
import { buildPageMetadata } from "@/utils/metadata";
import { withLocalePrefix } from "@/utils/locale-path";

const formatDate = (value: string, locale: "tr" | "en") =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );

type GuidePageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getContentSlugs("guides");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const locale = await getLocaleFromCookies();
  const notFoundCopy = getMessages(locale).pages.notFound;
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const [guide, availability] = await Promise.all([
    getContentBySlug("guides", params.slug, { locale }),
    getContentLocaleAvailability("guides", params.slug),
  ]);

  if (!guide) {
    const hasAnyLocale = availability.tr || availability.en;
    const title = hasAnyLocale ? fallbackCopy.title : notFoundCopy.title;
    const description = hasAnyLocale ? fallbackCopy.description : notFoundCopy.description;
    const alternatesLanguages = availability.tr && availability.en ? buildLanguageAlternates(`/guides/${params.slug}`) : null;
    return buildPageMetadata({
      title,
      description,
      path: `/guides/${params.slug}`,
      locale,
      alternatesLanguages,
    });
  }

  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    locale,
    type: "article",
    keywords: guide.tags,
    alternatesLanguages: availability.tr && availability.en ? buildLanguageAlternates(`/guides/${guide.slug}`) : null,
    openGraph: {
      type: "article",
      publishedTime: guide.date,
      tags: guide.tags,
    },
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const locale = await getLocaleFromCookies();
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const [guide, availability] = await Promise.all([
    getContentBySlug("guides", params.slug, { locale }),
    getContentLocaleAvailability("guides", params.slug),
  ]);

  if (!guide) {
    const hasAnyLocale = availability.tr || availability.en;
    if (!hasAnyLocale) {
      notFound();
    }
    return (
      <PageShell>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{fallbackCopy.title}</h1>
          <p className="mt-3 text-sm text-slate-600">{fallbackCopy.description}</p>
        </article>
      </PageShell>
    );
  }

  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).pages.guides;
  const canonical = buildLocalizedCanonical(`/guides/${guide.slug}`, locale);
  const logoUrl = new URL("/brand/logo.svg", SITE_URL).toString();
  const listHref = withLocalePrefix("/guides", locale);
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
      name: brandContent.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: brandContent.siteName,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    image: [logoUrl],
    keywords: guide.tags.join(", "),
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
  };
  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "tr" ? "Ana sayfa" : "Home",
        item: buildLocalizedCanonical("/", locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.badge,
        item: buildLocalizedCanonical("/guides", locale),
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
          <Link href={listHref} className="text-xs font-semibold text-sky-700 hover:underline">
            {copy.back}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700">{guide.category}</span>
            <span>{formatDate(guide.date, locale)}</span>
            <span>|</span>
            <span>{formatMessage(copy.readingTime, { count: guide.readingTimeMinutes })}</span>
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
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.tocTitle}</div>
              {toc.length === 0 ? (
                <p className="text-xs text-slate-500">{copy.tocEmpty}</p>
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
            <MDXRenderer source={guide.content} locale={locale} />
          </div>
        </div>
      </article>
    </PageShell>
  );
}
