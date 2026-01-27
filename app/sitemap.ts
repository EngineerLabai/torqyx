import type { MetadataRoute } from "next";
import { getContentList } from "@/utils/content";
import { getTagIndex } from "@/utils/taxonomy";
import { toolCatalog } from "@/tools/_shared/catalog";
import { SITE_URL } from "@/utils/seo";

const resolveUrl = (path: string) => new URL(path, SITE_URL).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blog, guides, glossary, tags] = await Promise.all([
    getContentList("blog"),
    getContentList("guides"),
    getContentList("glossary"),
    getTagIndex(),
  ]);

  const entries: MetadataRoute.Sitemap = [
    { url: resolveUrl("/") },
    { url: resolveUrl("/tools") },
    { url: resolveUrl("/blog") },
    { url: resolveUrl("/guides") },
    { url: resolveUrl("/glossary") },
  ];

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
    entries.push({
      url: resolveUrl(tool.href),
    });
  });

  tags.forEach((tag) => {
    entries.push({
      url: resolveUrl(`/tags/${tag.slug}`),
    });
  });

  return entries;
}
