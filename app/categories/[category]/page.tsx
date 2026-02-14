import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ActionCard from "@/components/ui/ActionCard";
import { getContentList } from "@/utils/content";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { formatMessage, getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { getCategoryIndex, matchesSlug, resolveLabelBySlug } from "@/utils/taxonomy";
import { slugify } from "@/utils/slugify";
import { buildLanguageAlternates } from "@/utils/seo";
import { withLocalePrefix } from "@/utils/locale-path";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";

const formatDate = (value: string, locale: "tr" | "en") =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const [trCategories, enCategories] = await Promise.all([
    getCategoryIndex("tr"),
    getCategoryIndex("en"),
  ]);
  const slugs = new Set([...trCategories, ...enCategories].map((category) => category.slug));
  return Array.from(slugs.values()).map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const { category: categoryParam } = await params;
  const [trCategories, enCategories] = await Promise.all([
    getCategoryIndex("tr"),
    getCategoryIndex("en"),
  ]);
  const categories = locale === "tr" ? trCategories : enCategories;
  const categorySlug = decodeURIComponent(categoryParam);
  const label = resolveLabelBySlug(categorySlug, categories) ?? categorySlug.replace(/-/g, " ");
  const titleBase = locale === "tr" ? `${label} kategorisi` : `${label} category`;
  const description =
    locale === "tr"
      ? `${label} kategorisine ait blog, rehber ve hesaplayici listesi.`
      : `Blog posts, guides, and calculators listed under ${label}.`;
  const hasTr = trCategories.some((entry) => entry.slug === categorySlug);
  const hasEn = enCategories.some((entry) => entry.slug === categorySlug);
  const alternatesLanguages = hasTr && hasEn ? buildLanguageAlternates(`/categories/${categorySlug}`) : null;

  return buildPageMetadata({
    title: `${titleBase} | ${brandContent.siteName}`,
    description,
    path: `/categories/${categorySlug}`,
    locale,
    alternatesLanguages,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const locale = await getLocaleFromCookies();
  const { category: categoryParam } = await params;
  const categorySlug = decodeURIComponent(categoryParam);
  const [blog, guides, categories] = await Promise.all([
    getContentList("blog", { locale }),
    getContentList("guides", { locale }),
    getCategoryIndex(locale),
  ]);
  const copy = getMessages(locale).pages.categories;

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
            <span className="font-semibold">{copy.badge}</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">{label}</h1>
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
            href: withLocalePrefix(`/blog/${item.slug}`, locale),
            title: item.title,
            description: item.description,
            category: item.category,
            date: formatDate(item.date, locale),
            readingTime: formatMessage(copy.readingTimeShort, { count: item.readingTimeMinutes }),
            tags: item.tags,
          }))}
          locale={locale}
        />

        <ContentSection
          title={copy.guidesTitle}
          description={copy.guidesDesc}
          copy={copy}
          items={guideMatches.map((item) => ({
            href: withLocalePrefix(`/guides/${item.slug}`, locale),
            title: item.title,
            description: item.description,
            category: item.category,
            date: formatDate(item.date, locale),
            readingTime: formatMessage(copy.readingTimeShort, { count: item.readingTimeMinutes }),
            tags: item.tags,
          }))}
          locale={locale}
        />

        <ToolSection tools={toolMatches} copy={copy} locale={locale} />
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
                  href={withLocalePrefix(`/tags/${tag.slug}`, locale)}
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
  locale,
}: {
  title: string;
  description: string;
  items: ContentItem[];
  copy: { contentEmpty: string; readCta: string };
  locale: "tr" | "en";
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
                  href={withLocalePrefix(`/categories/${slugify(item.category)}`, locale)}
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
                    href={withLocalePrefix(`/tags/${slugify(tag)}`, locale)}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href={item.href} className="text-xs font-semibold text-sky-700 hover:underline">
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

function ToolSection({
  tools,
  copy,
  locale,
}: {
  tools: typeof toolCatalog;
  copy: { toolsTitle: string; toolsDesc: string; toolsEmpty: string; openToolCta: string };
  locale: "tr" | "en";
}) {
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
          {tools.map((tool) => {
            const toolCopy = getToolCopy(tool, locale);
            return (
              <ActionCard
                key={tool.id}
                title={toolCopy.title}
                description={toolCopy.description}
                href={withLocalePrefix(tool.href, locale)}
                badge={tool.category}
                toolId={tool.id}
                ctaLabel={copy.openToolCta}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
