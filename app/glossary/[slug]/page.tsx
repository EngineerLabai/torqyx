import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import Formula from "@/components/mdx/Formula";
import ActionCard from "@/components/ui/ActionCard";
import { getContentBySlug, getContentList } from "@/utils/content";
import { buildCanonical } from "@/utils/seo";
import { slugify } from "@/utils/slugify";
import { toolCatalog } from "@/tools/_shared/catalog";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

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
  params: { slug: string };
};

export async function generateStaticParams() {
  const terms = await getContentList("glossary");
  return terms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: GlossaryPageProps): Promise<Metadata> {
  const term = await getContentBySlug("glossary", params.slug);

  if (!term) {
    return {
      title: "Icerik bulunamadi",
      description: "Istenen terim bulunamadi.",
    };
  }

  return {
    title: `${term.title} | Glossary`,
    description: term.description,
    keywords: term.tags,
    alternates: {
      canonical: term.canonical ?? buildCanonical(`/glossary/${term.slug}`),
    },
    openGraph: {
      title: term.title,
      description: term.description,
      type: "article",
      url: term.canonical ?? buildCanonical(`/glossary/${term.slug}`) ?? `/glossary/${term.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: term.title,
      description: term.description,
    },
  };
}

export default async function GlossaryPage({ params }: GlossaryPageProps) {
  const term = await getContentBySlug("glossary", params.slug);

  if (!term) {
    notFound();
  }

  const [blog, guides] = await Promise.all([
    getContentList("blog"),
    getContentList("guides"),
  ]);

  const tagSlugs = new Set(term.tags.map((tag) => slugify(tag)));
  const relatedBlog = blog.filter((item) => item.tags.some((tag) => tagSlugs.has(slugify(tag)))).slice(0, 4);
  const relatedGuides = guides.filter((item) => item.tags.some((tag) => tagSlugs.has(slugify(tag)))).slice(0, 4);
  const relatedTools = toolCatalog
    .filter((tool) => (tool.tags ?? []).some((tag) => tagSlugs.has(slugify(tag))))
    .slice(0, 4);

  const formulas = extractFormulas(term.content);

  return (
    <PageShell>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <Link href="/glossary" className="text-xs font-semibold text-orange-700 hover:underline">
            Glossary listesine don
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <Link
              href={`/categories/${slugify(term.category)}`}
              className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-700"
            >
              {term.category}
            </Link>
            <span>{formatDate(term.date)}</span>
            <span>|</span>
            <span>{term.readingTimeMinutes} dk okuma</span>
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            {term.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{term.description}</p>
          <div className="flex flex-wrap gap-2">
            {term.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${slugify(tag)}`}
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
              <h2 className="text-xl font-semibold text-slate-900">Tanim</h2>
              <div className="mdx-content space-y-6">
                <MDXRenderer source={term.content} />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Formuller</h2>
              {formulas.length === 0 ? (
                <p className="text-sm text-slate-600">Bu terim icin formuller eklenmedi.</p>
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
              <h3 className="text-sm font-semibold text-slate-900">Ilgili icerikler</h3>
              <p className="mt-1 text-xs text-slate-600">Benzer etiketli kaynaklar.</p>
            </div>

            {relatedBlog.length === 0 && relatedGuides.length === 0 && relatedTools.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                Ilgili icerik bulunamadi.
              </div>
            ) : null}

            {relatedBlog.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Blog</h4>
                <div className="space-y-3">
                  {relatedBlog.map((item) => (
                    <ActionCard
                      key={item.slug}
                      title={item.title}
                      description={item.description}
                      href={`/blog/${item.slug}`}
                      badge={item.category}
                      ctaLabel="Oku"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {relatedGuides.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Guides</h4>
                <div className="space-y-3">
                  {relatedGuides.map((item) => (
                    <ActionCard
                      key={item.slug}
                      title={item.title}
                      description={item.description}
                      href={`/guides/${item.slug}`}
                      badge={item.category}
                      ctaLabel="Oku"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {relatedTools.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tools</h4>
                <div className="space-y-3">
                  {relatedTools.map((tool) => (
                    <ActionCard
                      key={tool.id}
                      title={tool.title}
                      description={tool.description}
                      href={tool.href}
                      badge={tool.category}
                      ctaLabel="Araci Ac"
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
