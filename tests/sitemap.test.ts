import { beforeAll, describe, expect, it, vi } from "vitest";
import type { MetadataRoute } from "next";

vi.mock("server-only", () => ({}));

let entries: MetadataRoute.Sitemap;

beforeAll(async () => {
  const { default: buildSitemap } = await import("@/app/sitemap");
  entries = await buildSitemap();
});

describe("sitemap indexability policy", () => {
  it("excludes local user project records and publishes only the Turkish changelog", () => {
    const paths = entries.map((entry) => new URL(entry.url).pathname);

    expect(paths).not.toContain("/tr/projects");
    expect(paths).not.toContain("/en/projects");
    expect(paths.filter((path) => path.endsWith("/changelog"))).toEqual(["/tr/changelog"]);

    const changelog = entries.find((entry) => new URL(entry.url).pathname === "/tr/changelog");
    expect(changelog?.alternates?.languages).toEqual({
      tr: "https://torqyx.com/tr/changelog",
      "x-default": "https://torqyx.com/tr/changelog",
    });
  });

  it("emits only hreflang targets that are also canonical sitemap URLs", () => {
    const sitemapUrls = new Set(entries.map((entry) => entry.url));

    for (const entry of entries) {
      for (const alternate of Object.values(entry.alternates?.languages ?? {})) {
        expect(sitemapUrls.has(String(alternate)), `${entry.url} -> ${String(alternate)}`).toBe(true);
      }
    }
  });

  it("contains no duplicate canonical URLs", () => {
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("taxonomy quality gate", () => {
  it("keeps only tags and categories backed by visible indexable content or a tool", async () => {
    const [
      { getIndexableContentList },
      { getCategoryIndex, getTagIndex, isIndexableTaxonomyEntry, matchesSlug },
      { toolCatalog },
    ] =
      await Promise.all([
        import("@/utils/content"),
        import("@/utils/taxonomy"),
        import("@/tools/_shared/catalog"),
      ]);

    for (const locale of ["tr", "en"] as const) {
      const [blog, guides, glossary, tags, categories] = await Promise.all([
        getIndexableContentList("blog", { locale }),
        getIndexableContentList("guides", { locale }),
        getIndexableContentList("glossary", { locale }),
        getTagIndex(locale),
        getCategoryIndex(locale),
      ]);
      const content = [...blog, ...guides, ...glossary];

      for (const tag of tags) {
        const hasContent = content.some((item) => item.tags.some((value) => matchesSlug(value, tag.slug)));
        const hasTool = toolCatalog.some((tool) =>
          (tool.tags ?? []).some((value) => matchesSlug(value, tag.slug)),
        );
        expect(hasContent || hasTool, `${locale} tag ${tag.slug}`).toBe(true);
      }

      for (const category of categories) {
        const hasContent = content.some((item) => matchesSlug(item.category, category.slug));
        const hasTool = toolCatalog.some(
          (tool) => Boolean(tool.category) && matchesSlug(tool.category ?? "", category.slug),
        );
        expect(hasContent || hasTool, `${locale} category ${category.slug}`).toBe(true);
      }

      const sitemapPaths = entries
        .map((entry) => new URL(entry.url).pathname)
        .filter((path) => path.startsWith(`/${locale}/`));
      for (const tag of tags) {
        expect(sitemapPaths.includes(`/${locale}/tags/${tag.slug}`)).toBe(isIndexableTaxonomyEntry(tag));
      }
      for (const category of categories) {
        expect(sitemapPaths.includes(`/${locale}/categories/${category.slug}`)).toBe(
          isIndexableTaxonomyEntry(category),
        );
      }
    }
  });

  it("keeps generated glossary templates out of the sitemap while preserving navigable archives", async () => {
    const [{ getContentBySlug }, { getCategoryIndex, getNavigableCategoryIndex }] = await Promise.all([
      import("@/utils/content"),
      import("@/utils/taxonomy"),
    ]);
    const datum = await getContentBySlug("glossary", "datum", { locale: "en", includeDrafts: false });
    const sitemapPaths = entries.map((entry) => new URL(entry.url).pathname);
    const [indexableCategories, navigableCategories] = await Promise.all([
      getCategoryIndex("en"),
      getNavigableCategoryIndex("en"),
    ]);

    expect(datum).toBeTruthy();
    expect(sitemapPaths).not.toContain("/en/glossary");
    expect(sitemapPaths).not.toContain("/en/glossary/datum");
    expect(indexableCategories.some((entry) => entry.slug === "electrical")).toBe(false);
    expect(navigableCategories.some((entry) => entry.slug === "electrical")).toBe(true);
  });
});
