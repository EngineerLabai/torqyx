import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ActionCard from "@/components/ui/ActionCard";
import { getContentList } from "@/utils/content";
import { buildCanonical } from "@/utils/seo";
import { getCategoryIndex, matchesSlug, resolveLabelBySlug } from "@/utils/taxonomy";
import { slugify } from "@/utils/slugify";
import { toolCatalog } from "@/tools/_shared/catalog";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

type CategoryPageProps = {
  params: { category: string };
};

export async function generateStaticParams() {
  const categories = await getCategoryIndex();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getCategoryIndex();
  const categorySlug = decodeURIComponent(params.category);
  const label = resolveLabelBySlug(categorySlug, categories) ?? categorySlug.replace(/-/g, " ");

  return {
    title: `${label} kategorisi | AI Engineers Lab`,
    description: `${label} kategorisine ait blog, guide ve arac listesi.`,
    alternates: {
      canonical: buildCanonical(`/categories/${categorySlug}`),
    },
    openGraph: {
      title: `${label} kategorisi`,
      description: `${label} kategorisine ait blog, guide ve arac listesi.`,
      type: "website",
      url: buildCanonical(`/categories/${categorySlug}`) ?? `/categories/${categorySlug}`,
    },
    twitter: {
      card: "summary",
      title: `${label} kategorisi`,
      description: `${label} kategorisine ait blog, guide ve arac listesi.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = decodeURIComponent(params.category);
  const [blog, guides, categories] = await Promise.all([
    getContentList("blog"),
    getContentList("guides"),
    getCategoryIndex(),
  ]);

  const label = resolveLabelBySlug(categorySlug, categories) ?? categorySlug.replace(/-/g, " ");

  const blogMatches = blog.filter((item) => matchesSlug(item.category, categorySlug));
  const guideMatches = guides.filter((item) => matchesSlug(item.category, categorySlug));
  const toolMatches = toolCatalog.filter((tool) => (tool.category ? matchesSlug(tool.category, categorySlug) : false));

  const relatedTags = Array.from(
    new Set(
      [...blogMatches, ...guideMatches]
        .flatMap((item) => item.tags)
        .concat(toolMatches.flatMap((tool) => tool.tags ?? []))
        .map((tag) => slugify(tag))
        .filter(Boolean),
    ),
  )
    .map((slug) => ({ label: slug.replace(/-/g, " "), slug }))
    .slice(0, 12);

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] text-sky-700 md:text-xs">
            <span className="font-semibold">Kategori</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">{label}</h1>
          <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
            Bu kategori altindaki blog yazilari, rehberler ve araclar.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <ContentSection
          title="Blog"
          description="Kategoriye ait blog yazilari."
          items={blogMatches.map((item) => ({
            href: `/blog/${item.slug}`,
            title: item.title,
            description: item.description,
            category: item.category,
            date: formatDate(item.date),
            readingTime: `${item.readingTimeMinutes} dk`,
            tags: item.tags,
          }))}
        />

        <ContentSection
          title="Guides"
          description="Kategoriye ait rehberler."
          items={guideMatches.map((item) => ({
            href: `/guides/${item.slug}`,
            title: item.title,
            description: item.description,
            category: item.category,
            date: formatDate(item.date),
            readingTime: `${item.readingTimeMinutes} dk`,
            tags: item.tags,
          }))}
        />

        <ToolSection tools={toolMatches} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Ilgili etiketler</h2>
          {relatedTags.length === 0 ? (
            <p className="text-sm text-slate-600">Ilgili etiket bulunamadi.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:border-slate-300"
                >
                  #{tag.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

type ContentItem = {
  href: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
  tags: string[];
};

function ContentSection({ title, description, items }: { title: string; description: string; items: ContentItem[] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Bu kategoride icerik bulunamadi.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Link href={item.href} className="text-base font-semibold text-slate-900 hover:text-slate-950">
                    {item.title}
                  </Link>
                  <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{item.description}</p>
                </div>
                <Link
                  href={`/categories/${slugify(item.category)}`}
                  className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600"
                >
                  {item.category}
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>{item.date}</span>
                <span>|</span>
                <span>{item.readingTime}</span>
                {item.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${slugify(tag)}`}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href={item.href} className="text-xs font-semibold text-sky-700 hover:underline">
                  Oku
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ToolSection({ tools }: { tools: typeof toolCatalog }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Tools</h2>
        <p className="text-sm text-slate-600">Kategoriye ait araclar.</p>
      </div>

      {tools.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Bu kategoride arac bulunamadi.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
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
      )}
    </section>
  );
}
