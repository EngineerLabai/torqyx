import type { MetadataRoute } from "next";
import { getContentList } from "@/utils/content";
import { getCategoryIndex, getTagIndex } from "@/utils/taxonomy";
import { toolCatalog } from "@/tools/_shared/catalog";
import { standardsManifest } from "@/data/standards";
import { SITE_URL } from "@/utils/seo";
import { withLocalePrefix } from "@/utils/locale-path";

const resolveUrl = (path: string) => new URL(path, SITE_URL).toString();
const locales = ["tr", "en"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const addEntry = (path: string, locale: (typeof locales)[number], lastModified?: Date) => {
    entries.push({ url: resolveUrl(withLocalePrefix(path, locale)), lastModified });
  };

  [
    "/",
    "/dashboard",
    "/request-tool",
    "/changelog",
    "/tools",
    "/blog",
    "/guides",
    "/glossary",
    "/premium",
    "/login",
    "/qa",
    "/community",
    "/support",
    "/iletisim",
    "/gizlilik",
    "/cerez-politikasi",
    "/kullanim-sartlari",
    "/hakkinda",
    "/standards",
    "/project-hub",
    "/project-hub/devreye-alma",
    "/project-hub/part-tracking",
    "/project-hub/project-tools",
    "/project-hub/rfq",
    "/quality-tools",
    "/quality-tools/5n1k",
    "/quality-tools/5why",
    "/quality-tools/8d",
    "/quality-tools/kaizen",
    "/quality-tools/poka-yoke",
    "/fixture-tools",
    "/fixture-tools/locating",
    "/fixture-tools/clamping",
    "/fixture-tools/base-plate",
  ].forEach((path) => {
    locales.forEach((locale) => addEntry(path, locale));
  });

  for (const locale of locales) {
    const [blog, guides, glossary, tags, categories] = await Promise.all([
      getContentList("blog", { locale }),
      getContentList("guides", { locale }),
      getContentList("glossary", { locale }),
      getTagIndex(locale),
      getCategoryIndex(locale),
    ]);

    blog.forEach((post) => {
      addEntry(`/blog/${post.slug}`, locale, new Date(post.date));
    });

    guides.forEach((guide) => {
      addEntry(`/guides/${guide.slug}`, locale, new Date(guide.date));
    });

    glossary.forEach((term) => {
      addEntry(`/glossary/${term.slug}`, locale, new Date(term.date));
    });

    toolCatalog.forEach((tool) => {
      addEntry(tool.href, locale);
    });

    standardsManifest.categories.forEach((category) => {
      addEntry(`/standards/${category.slug}`, locale);
    });

    tags.forEach((tag) => {
      addEntry(`/tags/${tag.slug}`, locale);
    });

    categories.forEach((category) => {
      addEntry(`/categories/${category.slug}`, locale);
    });
  }

  return entries;
}
