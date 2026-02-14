import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import Formula from "@/components/mdx/Formula";
import ActionCard from "@/components/ui/ActionCard";
import { getContentBySlug, getContentList, getContentLocaleAvailability, getContentSlugs } from "@/utils/content";
import { BRAND_NAME } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { formatMessage, getMessages } from "@/utils/messages";
import { buildLanguageAlternates, buildLocalizedCanonical } from "@/utils/seo";
import { buildPageMetadata } from "@/utils/metadata";
import { slugify } from "@/utils/slugify";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import { withLocalePrefix } from "@/utils/locale-path";

const formatDate = (value: string, locale: "tr" | "en") =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );

const extractFormulas = (content: string) => {
  const regex = /<Formula(?:[^>]*label=(?:"([^"]+)"|'([^']+)'))?[^>]*>([\s\S]*?)<\/Formula>/g;
  const formulas: Array<{ label?: string; value: string }> = [];
  let match = regex.exec(content);
  while (match) {
    const label = match[1] ?? match[2] ?? undefined;
    const value = match[3]?.trim();
    if (value) {
      formulas.push({ label, value });
    }
    match = regex.exec(content);
  }
  return formulas;
};

type GlossaryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getContentSlugs("glossary");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GlossaryPageProps) {
  const locale = await getLocaleFromCookies();
  const { slug } = await params;
  const notFoundCopy = getMessages(locale).pages.notFound;
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const [term, availability] = await Promise.all([
    getContentBySlug("glossary", slug, { locale }),
    getContentLocaleAvailability("glossary", slug),
  ]);

  if (!term) {
    const hasAnyLocale = availability.tr || availability.en;
    const title = hasAnyLocale ? fallbackCopy.title : notFoundCopy.title;
    const description = hasAnyLocale ? fallbackCopy.description : notFoundCopy.description;
    const alternatesLanguages = availability.tr && availability.en ? buildLanguageAlternates(`/glossary/${slug}`) : null;
    return buildPageMetadata({
      title,
      description,
      path: `/glossary/${slug}`,
      locale,
      alternatesLanguages,
    });
  }

  return buildPageMetadata({
    title: term.title,
    description: term.description,
    path: `/glossary/${term.slug}`,
    locale,
    type: "article",
    keywords: term.tags,
    alternatesLanguages: availability.tr && availability.en ? buildLanguageAlternates(`/glossary/${term.slug}`) : null,
  });
}

export default async function GlossaryPage({ params }: GlossaryPageProps) {
  const locale = await getLocaleFromCookies();
  const { slug } = await params;
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const [term, availability] = await Promise.all([
    getContentBySlug("glossary", slug, { locale }),
    getContentLocaleAvailability("glossary", slug),
  ]);

  if (!term) {
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

  const copy = getMessages(locale).pages.glossary;
  const canonical = buildLocalizedCanonical(`/glossary/${term.slug}`, locale);
  const glossaryIndexUrl = buildLocalizedCanonical("/glossary", locale);
  const glossaryHref = withLocalePrefix("/glossary", locale);
  const categoriesHref = withLocalePrefix(`/categories/${slugify(term.category)}`, locale);
  const termJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${term.title} | ${copy.badge}`,
        description: term.description,
        url: canonical,
        mainEntity: {
          "@type": "DefinedTerm",
          name: term.title,
          description: term.description,
          url: canonical,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: `${BRAND_NAME} ${copy.badge}`,
            url: glossaryIndexUrl,
          },
        },
      },
      {
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
            item: glossaryIndexUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: term.title,
            item: canonical,
          },
        ],
      },
    ],
  };

  const [blog, guides] = await Promise.all([
    getContentList("blog", { locale }),
    getContentList("guides", { locale }),
  ]);

  const tagSlugs = new Set(term.tags.map((tag) => slugify(tag)));
  const relatedBlog = blog.filter((item) => item.tags.some((tag) => tagSlugs.has(slugify(tag)))).slice(0, 4);
  const relatedGuides = guides.filter((item) => item.tags.some((tag) => tagSlugs.has(slugify(tag)))).slice(0, 4);
  const relatedTools = toolCatalog
    .filter((tool) => (tool.tags ?? []).some((tag) => tagSlugs.has(slugify(tag))))
    .slice(0, 4)
    .map((tool) => ({ tool, copy: getToolCopy(tool, locale) }));

  const formulas = extractFormulas(term.content);

  return (
    <PageShell>
      <JsonLd data={termJsonLd} />
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <Link href={glossaryHref} className="text-xs font-semibold text-orange-700 hover:underline">
            {copy.back}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <Link
              href={categoriesHref}
              className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-700"
            >
              {term.category}
            </Link>
            <span>{formatDate(term.date, locale)}</span>
            <span>|</span>
            <span>{formatMessage(copy.readingTime, { count: term.readingTimeMinutes })}</span>
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            {term.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{term.description}</p>
          <div className="flex flex-wrap gap-2">
            {term.tags.map((tag) => (
              <Link
                key={tag}
                href={withLocalePrefix(`/tags/${slugify(tag)}`, locale)}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">{copy.definitionTitle}</h2>
              <div className="mdx-content space-y-6">
                <MDXRenderer source={term.content} locale={locale} />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">{copy.formulaTitle}</h2>
              {formulas.length === 0 ? (
                <p className="text-sm text-slate-600">{copy.formulaEmpty}</p>
              ) : (
                <div className="space-y-4">
                  {formulas.map((formula, index) => (
                    <Formula key={`${formula.label ?? "formula"}-${index}`} label={formula.label}>
                      {formula.value}
                    </Formula>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">{copy.relatedTitle}</h3>
              <p className="mt-1 text-xs text-slate-600">{copy.relatedDescription}</p>
            </div>

            {relatedBlog.length === 0 && relatedGuides.length === 0 && relatedTools.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                {copy.relatedEmpty}
              </div>
            ) : null}

            {relatedBlog.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.relatedBlog}</h4>
                <div className="space-y-3">
                  {relatedBlog.map((item) => (
                    <ActionCard
                      key={item.slug}
                      title={item.title}
                      description={item.description}
                      href={withLocalePrefix(`/blog/${item.slug}`, locale)}
                      badge={item.category}
                      ctaLabel={copy.readCta}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {relatedGuides.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.relatedGuides}</h4>
                <div className="space-y-3">
                  {relatedGuides.map((item) => (
                    <ActionCard
                      key={item.slug}
                      title={item.title}
                      description={item.description}
                      href={withLocalePrefix(`/guides/${item.slug}`, locale)}
                      badge={item.category}
                      ctaLabel={copy.readCta}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {relatedTools.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.relatedTools}</h4>
                <div className="space-y-3">
                  {relatedTools.map(({ tool, copy: toolCopy }) => (
                    <ActionCard
                      key={tool.id}
                      title={toolCopy.title}
                      description={toolCopy.description}
                      href={withLocalePrefix(tool.href, locale)}
                      badge={tool.category}
                      toolId={tool.id}
                      ctaLabel={copy.openToolCta}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </article>
    </PageShell>
  );
}
