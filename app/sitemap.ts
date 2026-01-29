import type { MetadataRoute } from "next";
import { getContentList } from "@/utils/content";
import { getCategoryIndex, getTagIndex } from "@/utils/taxonomy";
import { toolCatalog } from "@/tools/_shared/catalog";
import { SITE_URL } from "@/utils/seo";

const resolveUrl = (path: string) => new URL(path, SITE_URL).toString();

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
    entries.push({ url: resolveUrl(path), lastModified });
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
    "/forum",
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
    entries.push({
      url: resolveUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
    });
  });

  guides.forEach((guide) => {
    entries.push({
      url: resolveUrl(`/guides/${guide.slug}`),
      lastModified: new Date(guide.date),
    });
  });

  glossary.forEach((term) => {
    entries.push({
      url: resolveUrl(`/glossary/${term.slug}`),
      lastModified: new Date(term.date),
    });
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
