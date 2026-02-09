import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "../../utils/locale";
import { toolCatalog, getToolCopy } from "../../tools/_shared/catalog";
import { standardsManifest, standardsTables, type StandardsCategory } from "../../data/standards";
import materialsData from "../../data/reference/materials.json";
import threadsData from "../../data/reference/threads.json";
import frictionData from "../../data/reference/friction.json";
import fitsData from "../../data/reference/fits.json";
import unitsData from "../../data/reference/units.json";
import { withLocalePrefix } from "../../utils/locale-path";
import { buildSearchText, type SearchIndexData, type SearchIndexItem } from "../../utils/search-index";
import { ACTIVE_TOOL_DOCS } from "../tool-docs/registry";
import { toolDocStandardSchema } from "../tool-docs/schema";
import { getMessages } from "../../utils/messages";

type LocalizedText = { tr: string; en: string };

type ReferenceSection = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  columns: Array<{ key: string; label: LocalizedText }>;
  rows: Array<Record<string, unknown>>;
  note?: LocalizedText;
};

type BuildIndexOptions = {
  outputDir?: string;
  locales?: Locale[];
};

const LOCALES: Locale[] = ["tr", "en"];
const CONTENT_ROOT = path.join(process.cwd(), "content");
const CONTENT_DIRS = {
  blog: "blog",
  guides: "guides",
  glossary: "glossary",
} as const;
const CONTENT_EXTENSIONS = new Set([".mdx", ".md"]);

const referenceSections: ReferenceSection[] = [
  materialsData,
  threadsData,
  frictionData,
  fitsData,
  unitsData,
];

const STANDARD_TERMS: Record<Locale, string[]> = {
  tr: ["standart", "standartlar", "standard", "standards"],
  en: ["standard", "standards"],
};

const isLocalized = (value: unknown): value is LocalizedText =>
  Boolean(value && typeof value === "object" && "tr" in value && "en" in value);

const getLocalized = (value: unknown, locale: Locale) => {
  if (value === null || value === undefined) return "";
  if (isLocalized(value)) return value[locale];
  return String(value);
};

const buildKeywords = (...values: Array<string | string[] | null | undefined>) => {
  const flattened = values.flatMap((value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return [value];
  });
  return Array.from(new Set(flattened.map((value) => String(value)).filter(Boolean)));
};

const buildReferenceItems = (locale: Locale) => {
  const items: SearchIndexItem[] = [];
  for (const section of referenceSections) {
    const sectionTitle = section.title[locale];
    for (const row of section.rows) {
      const rowValues = section.columns.map((column) => getLocalized(row[column.key], locale));
      const rowTitle = rowValues[0] || sectionTitle;
      const keywords = buildKeywords(
        sectionTitle,
        rowTitle,
        rowValues,
        section.description?.[locale],
        section.note?.[locale],
      );
      items.push({
        id: `reference:${section.id}:${rowTitle}`,
        type: "reference",
        title: rowTitle,
        description: sectionTitle,
        href: withLocalePrefix(`/reference#${section.id}`, locale),
        keywords,
        searchText: buildSearchText(sectionTitle, rowTitle, keywords.join(" ")),
      });
    }
  }
  return items;
};

const buildStandardsHubItems = (locale: Locale) => {
  const items: SearchIndexItem[] = [];
  const messages = getMessages(locale);
  const standardsCopy = messages.pages.standards;
  const hubTitle = standardsCopy.title ?? standardsCopy.badge ?? "Standards";
  const hubKeywords = buildKeywords(
    STANDARD_TERMS[locale],
    hubTitle,
    standardsCopy.description,
    standardsCopy.categoriesDescription,
  );
  items.push({
    id: "standards:hub",
    type: "standard",
    title: hubTitle,
    description: standardsCopy.description,
    href: withLocalePrefix("/standards", locale),
    keywords: hubKeywords,
    searchText: buildSearchText(hubTitle, hubKeywords.join(" ")),
  });

  standardsManifest.categories.forEach((category) => {
    const title = category.title[locale];
    const description = category.description[locale];
    const keywords = buildKeywords(STANDARD_TERMS[locale], title, description);
    items.push({
      id: `standards:category:${category.slug}`,
      type: "standard",
      title,
      description,
      href: withLocalePrefix(`/standards/${category.slug}`, locale),
      keywords,
      searchText: buildSearchText(title, description, keywords.join(" ")),
    });
  });

  return items;
};

const buildStandardsItems = (locale: Locale) => {
  const items: SearchIndexItem[] = [];
  const tableCategoryMap = new Map<string, StandardsCategory>();
  for (const category of standardsManifest.categories) {
    for (const tableId of category.tables) {
      tableCategoryMap.set(tableId, category);
    }
  }

  Object.entries(standardsTables).forEach(([tableId, table]) => {
    const category = tableCategoryMap.get(tableId);
    const categorySlug = category?.slug ?? standardsManifest.categories[0]?.slug ?? "standards";
    const categoryTitle = category?.title?.[locale] ?? "";
    const tableTitle = table.title[locale];
    const rows = table.rows;

    rows.forEach((row) => {
      const rowValues = table.columns.map((column) => getLocalized(row[column.key], locale));
      const rowTitle = rowValues[0] || tableTitle;
      const keywords = buildKeywords(
        STANDARD_TERMS[locale],
        tableTitle,
        categoryTitle,
        rowTitle,
        rowValues,
        table.description?.[locale],
        table.note?.[locale],
      );
      items.push({
        id: `standards:${table.id}:${rowTitle}`,
        type: "standard",
        title: rowTitle,
        description: `${tableTitle}${categoryTitle ? ` · ${categoryTitle}` : ""}`,
        href: withLocalePrefix(`/standards/${categorySlug}#${table.id}`, locale),
        keywords,
        searchText: buildSearchText(tableTitle, categoryTitle, rowTitle, keywords.join(" ")),
      });
    });
  });

  return items;
};

const buildToolItems = (locale: Locale) => {
  return toolCatalog.map((tool) => {
    const copy = getToolCopy(tool, locale);
    const tags = tool.tags ?? [];
    const localeTitles = { tr: tool.title, en: tool.titleEn ?? tool.title };
    return {
      id: `tool:${tool.id}`,
      type: "tool",
      title: copy.title,
      description: copy.description,
      href: withLocalePrefix(tool.href, locale),
      tags,
      localeTitles,
      searchText: buildSearchText(
        copy.title,
        copy.description,
        tool.id,
        tags.join(" "),
        tool.category ?? "",
        tool.type,
        ...Object.values(localeTitles),
      ),
    } satisfies SearchIndexItem;
  });
};

type ContentSummary = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
};

const parseContentFilename = (name: string) => {
  const match = /^(.*)\.(tr|en)(\.(?:mdx|md))$/i.exec(name);
  if (!match) return null;
  return { slug: match[1], locale: match[2] as Locale };
};

const readContentList = async (type: keyof typeof CONTENT_DIRS, locale: Locale): Promise<ContentSummary[]> => {
  const dir = path.join(CONTENT_ROOT, CONTENT_DIRS[type]);
  let entries: Array<ContentSummary | null> = [];

  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    const paths = files
      .filter((entry) => entry.isFile() && CONTENT_EXTENSIONS.has(path.extname(entry.name)))
      .map((entry) => ({ entry, parsed: parseContentFilename(entry.name) }))
      .filter((item) => item.parsed && item.parsed.locale === locale)
      .map((item) => ({ path: path.join(dir, item.entry.name), slug: item.parsed!.slug }));

    entries = await Promise.all(
      paths.map(async ({ path: filePath, slug }) => {
        const raw = await fs.readFile(filePath, "utf8");
        const { data } = matter(raw);
        const title = typeof data.title === "string" ? data.title.trim() : "";
        const description = typeof data.description === "string" ? data.description.trim() : "";
        const tags = Array.isArray(data.tags) ? data.tags.map((tag: string) => String(tag)) : [];
        const category = typeof data.category === "string" ? data.category.trim() : "";
        const draft = data.draft === true;
        if (!title || !description || draft) return null;

        return {
          slug,
          title,
          description,
          tags,
          category,
        };
      }),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  return entries.filter((entry): entry is ContentSummary => Boolean(entry));
};

const buildContentItems = async (locale: Locale) => {
  const items: SearchIndexItem[] = [];
  const addItems = (type: "blog" | "guide" | "glossary", list: ContentSummary[], basePath: string) => {
    list.forEach((entry) => {
      items.push({
        id: `${type}:${entry.slug}`,
        type,
        title: entry.title,
        description: entry.description,
        href: withLocalePrefix(`${basePath}/${entry.slug}`, locale),
        tags: entry.tags,
        searchText: buildSearchText(entry.title, entry.description, entry.tags.join(" "), entry.category),
      });
    });
  };

  const [blog, guides, glossary] = await Promise.all([
    readContentList("blog", locale),
    readContentList("guides", locale),
    readContentList("glossary", locale),
  ]);

  addItems("blog", blog, "/blog");
  addItems("guide", guides, "/guides");
  addItems("glossary", glossary, "/glossary");
  return items;
};

const validateStandardsManifest = () => {
  const missing: string[] = [];
  standardsManifest.categories.forEach((category) => {
    category.tables.forEach((tableId) => {
      if (!standardsTables[tableId]) {
        missing.push(`${category.slug} -> ${tableId}`);
      }
    });
  });
  if (missing.length) {
    throw new Error(`[standards] Missing table definitions:\n${missing.map((value) => ` - ${value}`).join("\n")}`);
  }
};

const readToolDocStandard = async (toolId: string, locale: Locale) => {
  const filePath = path.join(process.cwd(), "content", "tools", `${toolId}.${locale}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = toolDocStandardSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(`[tool-docs] Invalid standard doc for ${toolId}.${locale}.json`);
  }
  return parsed.data;
};

const validateToolDocs = async () => {
  const missing: string[] = [];
  for (const toolId of ACTIVE_TOOL_DOCS) {
    for (const locale of LOCALES) {
      try {
        await readToolDocStandard(toolId, locale);
      } catch {
        missing.push(`${toolId} (${locale})`);
      }
    }
  }

  if (missing.length) {
    throw new Error(`[tool-docs] Missing standard docs:\n${missing.map((value) => ` - ${value}`).join("\n")}`);
  }
};

export const buildSearchIndexData = async (locale: Locale) => {
  const updatedAt = new Date().toISOString();
  const contentItems = await buildContentItems(locale);

  const items: SearchIndexItem[] = [
    ...buildToolItems(locale),
    ...buildStandardsHubItems(locale),
    ...buildReferenceItems(locale),
    ...buildStandardsItems(locale),
    ...contentItems,
  ];

  const index: SearchIndexData = {
    locale,
    updatedAt,
    items,
  };

  return index;
};

export const buildSearchIndexFiles = async (options: BuildIndexOptions = {}) => {
  const outputDir = options.outputDir ?? path.join(process.cwd(), "public");
  const locales = options.locales ?? LOCALES;

  validateStandardsManifest();
  await validateToolDocs();
  await fs.mkdir(outputDir, { recursive: true });

  for (const locale of locales) {
    const index = await buildSearchIndexData(locale);
    const outputPath = path.join(outputDir, `search-index.${locale}.json`);
    await fs.writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  }

  console.log(`[search-index] Generated search index for ${locales.join(", ")}`);
};
