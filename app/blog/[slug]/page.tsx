import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import JsonLd from "@/components/seo/JsonLd";
import ActionCard from "@/components/ui/ActionCard";
import { extractToc, getContentBySlug, getContentList } from "@/utils/content";
import { getRelatedForBlogPost } from "@/utils/related-items";
import { BRAND_NAME } from "@/utils/brand";
import { DEFAULT_OG_IMAGE_META, buildCanonical, SITE_URL } from "@/utils/seo";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getContentList("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getContentBySlug("blog", params.slug);

  if (!post) {
    return {
      title: "Icerik bulunamadi",
      description: "Istenen blog yazisi bulunamadi.",
    };
  }

  const canonical = post.canonical ?? buildCanonical(`/blog/${post.slug}`);

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: canonical ?? `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      images: [DEFAULT_OG_IMAGE_META],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [DEFAULT_OG_IMAGE_META.url],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getContentBySlug("blog", params.slug);

  if (!post) {
    notFound();
  }

  const canonical = post.canonical ?? buildCanonical(`/blog/${post.slug}`) ?? `/blog/${post.slug}`;
  const logoUrl = new URL("/icons/logo-mark.svg", SITE_URL).toString();
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
    keywords: post.tags.join(", "),
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
        name: "Blog",
        item: buildCanonical("/blog") ?? `${SITE_URL}/blog`,
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
  const allPosts = await getContentList("blog");
  const { relatedPosts, relatedTools } = getRelatedForBlogPost(post, allPosts);

  return (
    <PageShell>
      <JsonLd data={blogJsonLd} />
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="space-y-4">
          <Link href="/blog" className="text-xs font-semibold text-emerald-700 hover:underline">
            Blog listesine don
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">{post.category}</span>
            <span>{formatDate(post.date)}</span>
            <span>|</span>
            <span>{post.readingTimeMinutes} dk okuma</span>
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
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Icerik</div>
              {toc.length === 0 ? (
                <p className="text-xs text-slate-500">Bu yazida baslik bulunmuyor.</p>
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
                <h2 className="text-xl font-semibold text-slate-900">Benzer yazilar</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/blog/${item.slug}`}
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
                        <span>{formatDate(item.date)}</span>
                        <span>|</span>
                        <span>{item.readingTimeMinutes} dk</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedTools.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Ilgili araclar</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {relatedTools.map((tool) => (
                    <ActionCard
                      key={tool.href}
                      title={tool.title}
                      description={tool.description}
                      href={tool.href}
                      badge={tool.category}
                      toolId={tool.id}
                      ctaLabel="Hesaplayiciyi Ac"
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
