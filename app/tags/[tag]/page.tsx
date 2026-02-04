import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ActionCard from "@/components/ui/ActionCard";
import { getContentList } from "@/utils/content";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { formatMessage, getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { getTagIndex, matchesSlug, resolveLabelBySlug } from "@/utils/taxonomy";
import { slugify } from "@/utils/slugify";
import { toolCatalog } from "@/tools/_shared/catalog";

const formatDate = (value: string, locale: "tr" | "en") =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );

type TagPageProps = {
  params: { tag: string };
};

export async function generateStaticParams() {
  const tags = await getTagIndex();
  return tags.map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const tags = await getTagIndex();
  const tagSlug = decodeURIComponent(params.tag);
  const label = resolveLabelBySlug(tagSlug, tags) ?? tagSlug.replace(/-/g, " ");
  const titleBase = locale === "tr" ? `${label} etiketi` : `${label} tag`;
  const description =
    locale === "tr"
      ? `${label} etiketi ile iliskili blog, rehber ve hesaplayicilari kesfet.`
      : `Discover blog posts, guides, and calculators tagged with ${label}.`;

  return buildPageMetadata({
    title: `${titleBase} | ${brandContent.siteName}`,
    description,
    path: `/tags/${tagSlug}`,
    locale,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const tagSlug = decodeURIComponent(params.tag);
  const [blog, guides, tags, locale] = await Promise.all([
    getContentList("blog"),
    getContentList("guides"),
    getTagIndex(),
    getLocaleFromCookies(),
  ]);
  const copy = getMessages(locale).pages.tags;

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
            <span className="font-semibold">{copy.badge}</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">#{label}</h1>
          <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
            {copy.description}
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <ContentSection
          title={copy.blogTitle}
          description={copy.blogDesc}
          copy={copy}
          items={blogMatches.map((item) => ({
            href: `/blog/${item.slug}`,
            title: item.title,
            description: item.description,
            category: item.category,
            date: formatDate(item.date, locale),
            readingTime: formatMessage(copy.readingTimeShort, { count: item.readingTimeMinutes }),
            tags: item.tags,
          }))}
        />

        <ContentSection
          title={copy.guidesTitle}
          description={copy.guidesDesc}
          copy={copy}
          items={guideMatches.map((item) => ({
            href: `/guides/${item.slug}`,
            title: item.title,
            description: item.description,
            category: item.category,
            date: formatDate(item.date, locale),
            readingTime: formatMessage(copy.readingTimeShort, { count: item.readingTimeMinutes }),
            tags: item.tags,
          }))}
        />

        <ToolSection tools={toolMatches} copy={copy} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{copy.relatedTagsTitle}</h2>
          {relatedTags.length === 0 ? (
            <p className="text-sm text-slate-600">{copy.relatedTagsEmpty}</p>
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

function ContentSection({
  title,
  description,
  items,
  copy,
}: {
  title: string;
  description: string;
  items: ContentItem[];
  copy: { contentEmpty: string; readCta: string };
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          {copy.contentEmpty}
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
                  {copy.readCta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ToolSection({ tools, copy }: { tools: typeof toolCatalog; copy: { toolsTitle: string; toolsDesc: string; toolsEmpty: string; openToolCta: string } }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">{copy.toolsTitle}</h2>
        <p className="text-sm text-slate-600">{copy.toolsDesc}</p>
      </div>

      {tools.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          {copy.toolsEmpty}
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
              toolId={tool.id}
              ctaLabel={copy.openToolCta}
            />
          ))}
        </div>
      )}
    </section>
  );
}
