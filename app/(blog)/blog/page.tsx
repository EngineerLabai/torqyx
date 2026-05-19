import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getHeroImageSrc } from "@/lib/assets";
import { getContentList } from "@/utils/content";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { formatMessage, getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { withLocalePrefix } from "@/utils/locale-path";

type BlogIndexPageProps = {
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.blog;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/blog",
    locale,
  });
}

const getParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/ı/g, "i")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const uniqueSorted = (items: string[], locale: "tr" | "en") =>
  Array.from(new Set(items)).sort((a, b) => a.localeCompare(b, locale === "en" ? "en-US" : "tr-TR"));

const formatDate = (value: string, locale: "tr" | "en") =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.blog;
  const heroImage = getHeroImageSrc("blog");
  const posts = await getContentList("blog", { locale });
  const basePath = withLocalePrefix("/blog", locale);
  const resolvedSearchParams = (await searchParams) ?? undefined;

  const activeCategory = getParam(resolvedSearchParams?.category)?.trim() ?? "";
  const normalizedCategory = normalizeText(activeCategory);
  const categories = uniqueSorted(posts.map((post) => post.category), locale);
  const visiblePosts = activeCategory
    ? posts.filter((post) => normalizeText(post.category) === normalizedCategory)
    : posts;

  const applyParam = (params: URLSearchParams, key: string, value?: string) => {
    if (!value) {
      params.delete(key);
      return;
    }
    params.set(key, value);
  };

  const buildQuery = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    applyParam(params, "category", activeCategory || undefined);

    Object.entries(updates).forEach(([key, value]) => applyParam(params, key, value));

    const query = params.toString();
    return query ? `?${query}` : "";
  };

  const chipBase =
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold transition md:text-xs";
  const chipActive = "border-brand bg-brand/10 text-brand";
  const chipInactive = "border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand";

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Blog Hero"
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.categoriesTitle}</div>
              <div className="flex flex-wrap gap-2">
                <Link href={basePath} className={`${chipBase} ${activeCategory ? chipInactive : chipActive}`}>
                  {copy.allCategories}
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`${basePath}${buildQuery({ category })}`}
                    className={`${chipBase} ${normalizeText(category) === normalizedCategory ? chipActive : chipInactive}`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            {activeCategory ? (
              <Link href={basePath} className="text-brand hover:underline">
                {copy.clearFilters}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post) => (
            <Link
              key={post.slug}
              href={withLocalePrefix(`/blog/${post.slug}`, locale)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="rounded-full bg-brand/10 px-2 py-0.5 font-semibold text-brand">{post.category}</span>
                <span>{formatDate(post.date, locale)}</span>
                <span>|</span>
                <span>{formatMessage(copy.readingTime, { count: post.readingTimeMinutes })}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900 group-hover:text-brand">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm md:col-span-2">
            {copy.empty}
          </div>
        )}
      </section>
    </PageShell>
  );
}
