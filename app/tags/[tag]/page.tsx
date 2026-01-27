import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ActionCard from "@/components/ui/ActionCard";
import { getContentList } from "@/utils/content";
import { buildCanonical } from "@/utils/seo";
import { getTagIndex, matchesSlug, resolveLabelBySlug } from "@/utils/taxonomy";
import { slugify } from "@/utils/slugify";
import { toolCatalog } from "@/tools/_shared/catalog";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

type TagPageProps = {
  params: { tag: string };
};

export async function generateStaticParams() {
  const tags = await getTagIndex();
  return tags.map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tags = await getTagIndex();
  const tagSlug = decodeURIComponent(params.tag);
  const label = resolveLabelBySlug(tagSlug, tags) ?? tagSlug.replace(/-/g, " ");

  return {
    title: `${label} etiketi | AI Engineers Lab`,
    description: `${label} etiketi ile iliskili blog, guide ve araclari kesfet.`,
    alternates: {
      canonical: buildCanonical(`/tags/${tagSlug}`),
    },
    openGraph: {
      title: `${label} etiketi`,
      description: `${label} etiketi ile iliskili blog, guide ve araclari kesfet.`,
      type: "website",
      url: buildCanonical(`/tags/${tagSlug}`) ?? `/tags/${tagSlug}`,
    },
    twitter: {
      card: "summary",
      title: `${label} etiketi`,
      description: `${label} etiketi ile iliskili blog, guide ve araclari kesfet.`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tagSlug = decodeURIComponent(params.tag);
  const [blog, guides, tags] = await Promise.all([
    getContentList("blog"),
    getContentList("guides"),
    getTagIndex(),
  ]);

  const label = resolveLabelBySlug(tagSlug, tags) ?? tagSlug.replace(/-/g, " ");

  const blogMatches = blog.filter((item) => item.tags.some((tag) => matchesSlug(tag, tagSlug)));
  const guideMatches = guides.filter((item) => item.tags.some((tag) => matchesSlug(tag, tagSlug)));
  const toolMatches = toolCatalog.filter((tool) => (tool.tags ?? []).some((tag) => matchesSlug(tag, tagSlug)));

  const relatedTags = Array.from(
    new Set(
      [...blogMatches, ...guideMatches]
        .flatMap((item) => item.tags)
        .concat(toolMatches.flatMap((tool) => tool.tags ?? []))
        .map((tag) => slugify(tag))
        .filter((slug) => slug && slug !== tagSlug),
    ),
  )
    .map((slug) => resolveLabelBySlug(slug, tags) ?? slug.replace(/-/g, " "))
    .map((tag) => ({ label: tag, slug: slugify(tag) }))
    .filter((tag) => tag.slug && tag.slug !== tagSlug)
    .slice(0, 12);

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 md:text-xs">
            <span className="font-semibold">Etiket</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">#{label}</h1>
          <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
            Bu etiketle iliskili blog yazilari, rehberler ve araclar.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <ContentSection
          title="Blog"
          description="Etikete ait blog yazilari."
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
          description="Etikete uygun rehberler."
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
            <p className="text-sm text-slate-600">Baska etiket bulunamadi.</p>
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
          Bu etikette icerik bulunamadi.
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
                <Link href={item.href} className="text-xs font-semibold text-emerald-700 hover:underline">
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
        <p className="text-sm text-slate-600">Etikete uygun araclar.</p>
      </div>

      {tools.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Bu etikette arac bulunamadi.
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
