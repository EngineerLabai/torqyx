import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import { getContentList } from "@/utils/content";
import { DEFAULT_OG_IMAGE_META, buildCanonical } from "@/utils/seo";

type BlogIndexPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const ITEMS_PER_PAGE = 12;

const BLOG_DESCRIPTION = "Manual hesaplama, gorsel analiz ve metodik notlar icin kisa icerikler.";
const BLOG_CANONICAL = buildCanonical("/blog");

export const metadata: Metadata = {
  title: "Blog",
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: BLOG_CANONICAL ?? "/blog",
  },
  openGraph: {
    title: "Blog",
    description: BLOG_DESCRIPTION,
    type: "website",
    url: BLOG_CANONICAL ?? "/blog",
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: BLOG_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_META.url],
  },
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));

const getParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const uniqueSorted = (items: string[]) =>
  Array.from(new Set(items)).sort((a, b) => a.localeCompare(b, "tr-TR"));

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const posts = await getContentList("blog");

  const searchText = getParam(searchParams?.q)?.trim() ?? "";
  const activeTag = getParam(searchParams?.tag)?.trim() ?? "";
  const activeCategory = getParam(searchParams?.category)?.trim() ?? "";

  const normalizedQuery = normalizeText(searchText);
  const normalizedTag = normalizeText(activeTag);
  const normalizedCategory = normalizeText(activeCategory);

  const filteredPosts = posts.filter((post) => {
    const matchesQuery = normalizedQuery
      ? normalizeText([post.title, post.description, post.tags.join(" "), post.category].join(" ")).includes(
          normalizedQuery,
        )
      : true;

    const matchesTag = normalizedTag
      ? post.tags.some((tag) => normalizeText(tag) === normalizedTag)
      : true;

    const matchesCategory = normalizedCategory
      ? normalizeText(post.category) === normalizedCategory
      : true;

    return matchesQuery && matchesTag && matchesCategory;
  });

  const totalItems = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const pageParam = Number.parseInt(getParam(searchParams?.page) ?? "1", 10);
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const categories = uniqueSorted(posts.map((post) => post.category));
  const tags = uniqueSorted(posts.flatMap((post) => post.tags));

  const applyParam = (params: URLSearchParams, key: string, value?: string) => {
    if (!value || (key === "page" && value === "1")) {
      params.delete(key);
      return;
    }
    params.set(key, value);
  };

  const buildQuery = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    applyParam(params, "q", searchText || undefined);
    applyParam(params, "tag", activeTag || undefined);
    applyParam(params, "category", activeCategory || undefined);
    applyParam(params, "page", safePage > 1 ? String(safePage) : undefined);

    Object.entries(updates).forEach(([key, value]) => applyParam(params, key, value));

    const query = params.toString();
    return query ? `?${query}` : "";
  };

  const hasActiveFilters = Boolean(searchText || activeTag || activeCategory);
  const showingStart = totalItems === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const chipBase =
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold transition md:text-xs";
  const chipActive = "border-emerald-300 bg-emerald-50 text-emerald-700";
  const chipInactive = "border-slate-200 bg-white text-slate-600 hover:border-slate-300";

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <svg
                className="hero-illustration text-emerald-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
                <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 md:text-xs">
                <span className="font-semibold">Blog</span>
              </div>
            </div>
            <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">
              Hesaplama ve analiz odakli paylasimlar
            </h1>
            <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
              Manual hesaplama, gorsel analiz ve metodik notlar icin kisa icerikler.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <form action="/blog" method="get" className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Arama
              </label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchText}
                  placeholder="Baslik, tag veya kategori..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Ara
                </button>
              </div>
              {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
              {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
              {searchText ? (
                <Link
                  href={`/blog${buildQuery({ q: undefined, page: undefined })}`}
                  className="inline-flex text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Aramayi temizle
                </Link>
              ) : null}
            </form>

            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kategoriler</div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/blog${buildQuery({ category: undefined, page: undefined })}`}
                  className={`${chipBase} ${activeCategory ? chipInactive : chipActive}`}
                >
                  Tum kategoriler
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog${buildQuery({ category, page: undefined })}`}
                    className={`${chipBase} ${normalizeText(category) === normalizedCategory ? chipActive : chipInactive}`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tagler</div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/blog${buildQuery({ tag: undefined, page: undefined })}`}
                className={`${chipBase} ${activeTag ? chipInactive : chipActive}`}
              >
                Tum tagler
              </Link>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog${buildQuery({ tag, page: undefined })}`}
                  className={`${chipBase} ${normalizeText(tag) === normalizedTag ? chipActive : chipInactive}`}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span>
              {showingStart}-{showingEnd} / {totalItems} yazi
            </span>
            <span>|</span>
            <span>
              Sayfa {safePage} / {totalPages}
            </span>
            {hasActiveFilters ? (
              <Link href="/blog" className="text-emerald-700 hover:underline">
                Tum filtreleri temizle
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {pageItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            Aradigin kriterlere uygun yazi bulunamadi.
          </div>
        ) : (
          pageItems.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-slate-950 md:text-xl">
                    {post.title}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{post.description}</p>
                </div>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {post.category}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>{formatDate(post.date)}</span>
                <span>|</span>
                <span>{post.readingTimeMinutes} dk okuma</span>
                {post.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        )}
      </section>

      {totalPages > 1 ? (
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm" aria-label="Pagination">
          <Link
            href={`/blog${buildQuery({ page: safePage > 1 ? String(safePage - 1) : undefined })}`}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              safePage > 1
                ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                : "pointer-events-none border-slate-100 bg-slate-50 text-slate-400"
            }`}
          >
            Onceki
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Link
                key={page}
                href={`/blog${buildQuery({ page: String(page) })}`}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  page === safePage
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
          <Link
            href={`/blog${buildQuery({ page: safePage < totalPages ? String(safePage + 1) : undefined })}`}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              safePage < totalPages
                ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                : "pointer-events-none border-slate-100 bg-slate-50 text-slate-400"
            }`}
          >
            Sonraki
          </Link>
        </nav>
      ) : null}
    </PageShell>
  );
}
