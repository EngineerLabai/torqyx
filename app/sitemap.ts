import type { MetadataRoute } from "next";
import { getContentList } from "@/utils/content";
import { getCategoryIndex, getTagIndex } from "@/utils/taxonomy";
import { toolCatalog } from "@/tools/_shared/catalog";
import { SITE_URL } from "@/utils/seo";
import { withLocalePrefix } from "@/utils/locale-path";

const resolveUrl = (path: string) => new URL(path, SITE_URL).toString();
const locales = ["tr", "en"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blog, guides, glossary, tags, categories] = await Promise.all([
    getContentList("blog"),
    getContentList("guides"),
    getContentList("glossary"),
    getTagIndex(),
    getCategoryIndex(),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  const addEntry = (path: string, lastModified?: Date) => {
    locales.forEach((locale) => {
      entries.push({ url: resolveUrl(withLocalePrefix(path, locale)), lastModified });
    });
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
  ].forEach((path) => addEntry(path));

  blog.forEach((post) => {
    addEntry(`/blog/${post.slug}`, new Date(post.date));
  });

  guides.forEach((guide) => {
    addEntry(`/guides/${guide.slug}`, new Date(guide.date));
  });

  glossary.forEach((term) => {
    addEntry(`/glossary/${term.slug}`, new Date(term.date));
  });

  toolCatalog.forEach((tool) => {
    addEntry(tool.href);
  });

  tags.forEach((tag) => {
    addEntry(`/tags/${tag.slug}`);
  });

  categories.forEach((category) => {
    addEntry(`/categories/${category.slug}`);
  });

  return entries;
}
