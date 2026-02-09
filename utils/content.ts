import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { Locale } from "@/utils/locale";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const CONTENT_DIRS = {
  blog: "blog",
  guides: "guides",
  glossary: "glossary",
  qa: "qa",
} as const;

const CONTENT_EXTENSIONS = new Set([".mdx", ".md"]);
const LOCALES: Locale[] = ["tr", "en"];

export type ContentType = keyof typeof CONTENT_DIRS;

export type ContentFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  draft: boolean;
  readingTime?: number | string;
  canonical?: string;
};

export type ContentItem = {
  slug: string;
  type: ContentType;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  draft: boolean;
  readingTimeMinutes: number;
  canonical?: string;
  content: string;
};

export type ContentListItem = Omit<ContentItem, "content">;

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

type ParsedContentItem = ContentItem & { sourcePath: string };

type ContentQueryOptions = {
  includeDrafts?: boolean;
  locale?: Locale;
};

const REQUIRED_FIELDS: (keyof ContentFrontmatter)[] = [
  "title",
  "description",
  "date",
  "tags",
  "category",
  "draft",
];

const WORDS_PER_MINUTE = 200;

const getContentDirectory = (type: ContentType) => path.join(CONTENT_ROOT, CONTENT_DIRS[type]);

const parseContentFilename = (name: string) => {
  const match = /^(.*)\.(tr|en)(\.(?:mdx|md))$/i.exec(name);
  if (!match) return null;
  const slug = match[1];
  const locale = match[2] as Locale;
  const extension = match[3];
  return { slug, locale, extension };
};

const estimateReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.round(words / WORDS_PER_MINUTE);
  return Math.max(1, minutes || 1);
};

const normalizeReadingTime = (value: unknown, content: string) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.round(value));
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return Math.max(1, Math.round(parsed));
    }
  }

  return estimateReadingTime(content);
};

const stripMarkdown = (value: string) => {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/ı/g, "i")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const extractToc = (content: string, minLevel = 2, maxLevel = 4): TocItem[] => {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  const lines = content.split(/\r?\n/);
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,4})\s+(.+)$/.exec(line);
    if (!match) continue;

    const level = match[1].length;
    if (level < minLevel || level > maxLevel) continue;

    let text = match[2].trim().replace(/\s+#*$/, "");
    text = stripMarkdown(text);
    if (!text) continue;

    items.push({
      id: slugger.slug(text),
      text,
      level,
    });
  }

  return items;
};

const GUIDE_REQUIRED_SECTIONS = [
  "Problem / Amac",
  "Varsayimlar",
  "Adim adim yontem",
  "Sik hatalar",
  "Ilgili hesaplayicilar",
];

const ensureGuideSections = (content: string, sourcePath: string) => {
  const toc = extractToc(content, 2, 4);
  const headings = new Set(toc.map((item) => normalizeText(item.text)));
  const missing = GUIDE_REQUIRED_SECTIONS.filter((section) => !headings.has(normalizeText(section)));

  if (missing.length > 0) {
    throw new Error(
      `[content] Guides must include sections (${missing.join(", ")}) in ${sourcePath}`,
    );
  }
};

const validateFrontmatter = (data: Record<string, unknown>, sourcePath: string): ContentFrontmatter => {
  const missing = REQUIRED_FIELDS.filter((field) => data[field] === undefined);
  if (missing.length > 0) {
    throw new Error(
      `[content] Missing frontmatter fields (${missing.join(", ")}) in ${sourcePath}`,
    );
  }

  const errors: string[] = [];

  if (typeof data.title !== "string" || data.title.trim().length === 0) {
    errors.push("title must be a non-empty string");
  }
  if (typeof data.description !== "string" || data.description.trim().length === 0) {
    errors.push("description must be a non-empty string");
  }
  if (typeof data.date !== "string" || Number.isNaN(Date.parse(data.date))) {
    errors.push("date must be a valid date string");
  }
  if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string")) {
    errors.push("tags must be an array of strings");
  }
  if (typeof data.category !== "string" || data.category.trim().length === 0) {
    errors.push("category must be a non-empty string");
  }
  if (typeof data.draft !== "boolean") {
    errors.push("draft must be boolean");
  }
  if (data.readingTime !== undefined && typeof data.readingTime !== "number" && typeof data.readingTime !== "string") {
    errors.push("readingTime must be a number or string when provided");
  }
  if (data.canonical !== undefined && typeof data.canonical !== "string") {
    errors.push("canonical must be a string when provided");
  }

  if (errors.length > 0) {
    throw new Error(`[content] Invalid frontmatter in ${sourcePath}: ${errors.join("; ")}`);
  }

  const frontmatter = data as ContentFrontmatter;

  return {
    title: frontmatter.title.trim(),
    description: frontmatter.description.trim(),
    date: frontmatter.date,
    tags: frontmatter.tags.map((tag) => tag.trim()).filter(Boolean),
    category: frontmatter.category.trim(),
    draft: frontmatter.draft,
    readingTime: frontmatter.readingTime,
    canonical: frontmatter.canonical,
  };
};

const readContentFiles = async (type: ContentType, locale?: Locale) => {
  const dir = getContentDirectory(type);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && CONTENT_EXTENSIONS.has(path.extname(entry.name)))
      .map((entry) => {
        const parsed = parseContentFilename(entry.name);
        if (!parsed) return null;
        if (locale && parsed.locale !== locale) return null;
        return {
          ...parsed,
          path: path.join(dir, entry.name),
        };
      })
      .filter((entry): entry is { slug: string; locale: Locale; extension: string; path: string } => Boolean(entry));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const ensureUniqueSlugs = (items: ParsedContentItem[], type: ContentType, locale: Locale) => {
  const seen = new Map<string, string>();
  for (const item of items) {
    const existing = seen.get(item.slug);
    if (existing) {
      throw new Error(
        `[content] Duplicate slug "${item.slug}" in ${type} (${locale}): ${existing} and ${item.sourcePath}`,
      );
    }
    seen.set(item.slug, item.sourcePath);
  }
};

const parseContentFile = async (sourcePath: string, type: ContentType, slug: string): Promise<ParsedContentItem> => {
  const raw = await fs.readFile(sourcePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = validateFrontmatter(data as Record<string, unknown>, sourcePath);

  if (type === "guides") {
    ensureGuideSections(content, sourcePath);
  }

  const readingTimeMinutes = normalizeReadingTime(frontmatter.readingTime, content);

  return {
    slug,
    type,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    tags: frontmatter.tags,
    category: frontmatter.category,
    draft: frontmatter.draft,
    readingTimeMinutes,
    canonical: frontmatter.canonical,
    content,
    sourcePath,
  };
};

const resolveContentPath = async (type: ContentType, slug: string, locale: Locale) => {
  const dir = getContentDirectory(type);
  for (const extension of CONTENT_EXTENSIONS) {
    const filePath = path.join(dir, `${slug}.${locale}${extension}`);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      // ignore
    }
  }
  return null;
};

export const getContentItems = async (type: ContentType, options: ContentQueryOptions = {}) => {
  const locale = options.locale ?? "tr";
  const files = await readContentFiles(type, locale);
  const items = await Promise.all(
    files.map((file) => parseContentFile(file.path, type, file.slug)),
  );
  ensureUniqueSlugs(items, type, locale);

  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  const filtered = includeDrafts ? items : items.filter((item) => !item.draft);

  return filtered
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ sourcePath, ...item }) => item);
};

export const getContentList = async (type: ContentType, options: ContentQueryOptions = {}) => {
  const items = await getContentItems(type, options);
  return items.map(({ content, ...item }) => item);
};

export const getContentBySlug = async (type: ContentType, slug: string, options: ContentQueryOptions = {}) => {
  const locale = options.locale ?? "tr";
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  const resolvedPath = await resolveContentPath(type, slug, locale);
  if (!resolvedPath) return null;

  const item = await parseContentFile(resolvedPath, type, slug);
  if (!includeDrafts && item.draft) return null;
  return item;
};

export const getContentSlugs = async (type: ContentType) => {
  const entries = await Promise.all(LOCALES.map((locale) => readContentFiles(type, locale)));
  const slugs = new Set(entries.flat().map((entry) => entry.slug));
  return Array.from(slugs.values());
};

export const getContentLocaleAvailability = async (type: ContentType, slug: string) => {
  const availability: Record<Locale, boolean> = { tr: false, en: false };
  await Promise.all(
    LOCALES.map(async (locale) => {
      const found = await resolveContentPath(type, slug, locale);
      availability[locale] = Boolean(found);
    }),
  );
  return availability;
};
