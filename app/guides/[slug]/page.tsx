import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import ActionCard from "@/components/ui/ActionCard";
import { extractToc, getContentBySlug, getContentLocaleAvailability, getContentSlugs } from "@/utils/content";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { formatMessage, getMessages } from "@/utils/messages";
import { getRelatedForGuide } from "@/utils/related-items";
import { buildLanguageAlternates, buildLocalizedCanonical, SITE_URL } from "@/utils/seo";
import { buildPageMetadata } from "@/utils/metadata";
import { withLocalePrefix } from "@/utils/locale-path";

const formatDate = (value: string, locale: "tr" | "en") =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );

const stripMdxText = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractFaqItems = (content: string) => {
  const lines = content.split(/\r?\n/);
  const items: Array<{ question: string; answer: string }> = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = /^###\s+(?:Soru|Question)\s*:\s*(.+)$/i.exec(lines[index].trim());
    if (!match) continue;

    const answerLines: string[] = [];
    for (let answerIndex = index + 1; answerIndex < lines.length; answerIndex += 1) {
      const line = lines[answerIndex];
      if (/^#{2,4}\s+/.test(line.trim())) break;
      if (line.trim()) answerLines.push(line);
    }

    const question = stripMdxText(match[1]);
    const answer = stripMdxText(answerLines.join(" "));
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items.slice(0, 5);
};

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

const buildGuideSeoTitle = (title: string, locale: "tr" | "en") => {
  const hasGuideWord = /rehber|guide/i.test(title);
  if (hasGuideWord) return title;
  return locale === "tr" ? `${title} Rehberi` : `${title} Guide`;
};

export async function generateStaticParams() {
  const slugs = await getContentSlugs("guides");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const locale = await getLocaleFromCookies();
  const { slug } = await params;
  const notFoundCopy = getMessages(locale).pages.notFound;
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const [guide, availability] = await Promise.all([
    getContentBySlug("guides", slug, { locale }),
    getContentLocaleAvailability("guides", slug),
  ]);

  if (!guide) {
    const hasAnyLocale = availability.tr || availability.en;
    const title = hasAnyLocale ? fallbackCopy.title : notFoundCopy.title;
    const description = hasAnyLocale ? fallbackCopy.description : notFoundCopy.description;
    const alternatesLanguages = availability.tr && availability.en ? buildLanguageAlternates(`/guides/${slug}`) : null;
    return buildPageMetadata({
      title,
      description,
      path: `/guides/${slug}`,
      locale,
      alternatesLanguages,
    });
  }

  return buildPageMetadata({
    title: buildGuideSeoTitle(guide.title, locale),
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
  const { slug } = await params;
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const [guide, availability] = await Promise.all([
    getContentBySlug("guides", slug, { locale }),
    getContentLocaleAvailability("guides", slug),
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
  const logoUrl = new URL("/images/logo.png", SITE_URL).toString();
  const listHref = withLocalePrefix("/guides", locale);
  const related = await getRelatedForGuide(guide, { locale });
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
  const faqItems = extractFaqItems(guide.content);
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;
  const guideJsonLd = {
    "@context": "https://schema.org",
    "@graph": [articleJsonLd, breadcrumbJsonLd, ...(faqJsonLd ? [faqJsonLd] : [])],
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
            <GuideRelatedLinks related={related} locale={locale} />
          </div>
        </div>
      </article>
    </PageShell>
  );
}

function GuideRelatedLinks({
  related,
  locale,
}: {
  related: Awaited<ReturnType<typeof getRelatedForGuide>>;
  locale: "tr" | "en";
}) {
  const hasLinks = related.guides.length > 0 || related.glossary.length > 0 || related.tools.length > 0;
  if (!hasLinks) return null;

  const copy =
    locale === "tr"
      ? {
          heading: "İlgili mühendislik bağlantıları",
          description: "Bu rehberle aynı kavramları kullanan hesaplayıcılar, terimler ve tamamlayıcı rehberler.",
          tools: "Hesaplayıcılar",
          guides: "Rehberler",
          glossary: "Sözlük",
          openTool: "Hesaplayıcıyı aç",
          read: "Oku",
        }
      : {
          heading: "Related engineering links",
          description: "Calculators, terms, and companion guides that share the same engineering concepts.",
          tools: "Calculators",
          guides: "Guides",
          glossary: "Glossary",
          openTool: "Open calculator",
          read: "Read",
        };

  return (
    <section className="border-t border-slate-200 pt-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{copy.heading}</h2>
        <p className="text-sm leading-relaxed text-slate-600">{copy.description}</p>
      </div>

      {related.tools.length > 0 ? (
        <div className="mt-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.tools}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {related.tools.map((tool) => (
              <ActionCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                badge={tool.category}
                toolId={tool.id}
                ctaLabel={copy.openTool}
              />
            ))}
          </div>
        </div>
      ) : null}

      {related.guides.length > 0 ? (
        <div className="mt-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.guides}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {related.guides.map((item) => (
              <ActionCard
                key={item.slug}
                title={item.title}
                description={item.description}
                href={`/guides/${item.slug}`}
                badge={item.category}
                ctaLabel={copy.read}
              />
            ))}
          </div>
        </div>
      ) : null}

      {related.glossary.length > 0 ? (
        <div className="mt-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.glossary}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {related.glossary.map((item) => (
              <ActionCard
                key={item.slug}
                title={item.title}
                description={item.description}
                href={`/glossary/${item.slug}`}
                badge={item.category}
                ctaLabel={copy.read}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
