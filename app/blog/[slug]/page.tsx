import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import JsonLd from "@/components/seo/JsonLd";
import ActionCard from "@/components/ui/ActionCard";
import { extractToc, getContentBySlug, getContentList, getContentLocaleAvailability, getContentSlugs } from "@/utils/content";
import { getRelatedForBlogPost } from "@/utils/related-items";
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

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getContentSlugs("blog");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const locale = await getLocaleFromCookies();
  const notFoundCopy = getMessages(locale).pages.notFound;
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const [post, availability] = await Promise.all([
    getContentBySlug("blog", params.slug, { locale }),
    getContentLocaleAvailability("blog", params.slug),
  ]);

  if (!post) {
    const hasAnyLocale = availability.tr || availability.en;
    const title = hasAnyLocale ? fallbackCopy.title : notFoundCopy.title;
    const description = hasAnyLocale ? fallbackCopy.description : notFoundCopy.description;
    const alternatesLanguages = availability.tr && availability.en ? buildLanguageAlternates(`/blog/${params.slug}`) : null;
    return buildPageMetadata({
      title,
      description,
      path: `/blog/${params.slug}`,
      locale,
      alternatesLanguages,
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    locale,
    type: "article",
    keywords: post.tags,
    alternatesLanguages: availability.tr && availability.en ? buildLanguageAlternates(`/blog/${post.slug}`) : null,
    openGraph: {
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = await getLocaleFromCookies();
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const [post, availability] = await Promise.all([
    getContentBySlug("blog", params.slug, { locale }),
    getContentLocaleAvailability("blog", params.slug),
  ]);

  if (!post) {
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
  const copy = getMessages(locale).pages.blog;
  const canonical = buildLocalizedCanonical(`/blog/${post.slug}`, locale);
  const logoUrl = new URL("/brand/logo.svg", SITE_URL).toString();
  const blogListHref = withLocalePrefix("/blog", locale);
  const blogPostingJsonLd = {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
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
    keywords: post.tags.join(", "),
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
        name: "Blog",
        item: buildLocalizedCanonical("/blog", locale),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonical,
      },
    ],
  };
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@graph": [blogPostingJsonLd, breadcrumbJsonLd],
  };

  const toc = extractToc(post.content);
  const allPosts = await getContentList("blog", { locale });
  const { relatedPosts, relatedTools } = getRelatedForBlogPost(post, allPosts, { locale });

  return (
    <PageShell>
      <JsonLd data={blogJsonLd} />
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="space-y-4">
          <Link href={blogListHref} className="text-xs font-semibold text-emerald-700 hover:underline">
            {copy.back}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">{post.category}</span>
            <span>{formatDate(post.date, locale)}</span>
            <span>|</span>
            <span>{formatMessage(copy.readingTime, { count: post.readingTimeMinutes })}</span>
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            {post.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{post.description}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        </header>

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
                      <a href={`#${item.id}`} className="hover:text-emerald-700">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <div className="order-2 space-y-10 lg:order-1">
            <div className="space-y-6 mdx-content">
              <MDXRenderer source={post.content} />
            </div>

            {relatedPosts.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">{copy.relatedPostsTitle}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.slug}
                      href={withLocalePrefix(`/blog/${item.slug}`, locale)}
                      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-950">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600">{item.description}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                        <span>{formatDate(item.date, locale)}</span>
                        <span>|</span>
                        <span>{formatMessage(copy.readingTime, { count: item.readingTimeMinutes })}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedTools.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">{copy.relatedToolsTitle}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {relatedTools.map((tool) => (
                    <ActionCard
                      key={tool.href}
                      title={tool.title}
                      description={tool.description}
                      href={withLocalePrefix(tool.href, locale)}
                      badge={tool.category}
                      toolId={tool.id}
                      ctaLabel={copy.relatedToolsCta}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </article>
    </PageShell>
  );
}
