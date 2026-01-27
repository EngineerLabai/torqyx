import "server-only";
import { slugify } from "@/utils/slugify";
import { getContentList } from "@/utils/content";
import { toolCatalog } from "@/tools/_shared/catalog";

export type TaxonomyEntry = {
  slug: string;
  label: string;
  count: number;
};

const upsertEntry = (map: Map<string, TaxonomyEntry>, label: string) => {
  const slug = slugify(label);
  if (!slug) return;
  const existing = map.get(slug);
  if (existing) {
    existing.count += 1;
    return;
  }
  map.set(slug, { slug, label, count: 1 });
};

export const getTagIndex = async () => {
  const [blog, guides] = await Promise.all([
    getContentList("blog"),
    getContentList("guides"),
  ]);

  const map = new Map<string, TaxonomyEntry>();
  blog.forEach((item) => item.tags.forEach((tag) => upsertEntry(map, tag)));
  guides.forEach((item) => item.tags.forEach((tag) => upsertEntry(map, tag)));
  toolCatalog.forEach((tool) => (tool.tags ?? []).forEach((tag) => upsertEntry(map, tag)));

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "tr-TR"));
};

export const getCategoryIndex = async () => {
  const [blog, guides] = await Promise.all([
    getContentList("blog"),
    getContentList("guides"),
  ]);

  const map = new Map<string, TaxonomyEntry>();
  blog.forEach((item) => upsertEntry(map, item.category));
  guides.forEach((item) => upsertEntry(map, item.category));
  toolCatalog.forEach((tool) => {
    if (tool.category) upsertEntry(map, tool.category);
  });

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "tr-TR"));
};

export const resolveLabelBySlug = (slug: string, entries: TaxonomyEntry[]) => {
  return entries.find((entry) => entry.slug === slug)?.label ?? null;
};

export const matchesSlug = (value: string, slug: string) => slugify(value) === slug;
