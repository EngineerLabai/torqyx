import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "@/utils/slugify";
import type { Locale } from "@/utils/locale";

const CHANGELOG_DIR = path.join(process.cwd(), "content", "changelog");
const CONTENT_EXTENSIONS = new Set([".mdx", ".md", ".json"]);

export type ChangelogBadge = "new" | "fixed" | "removed";

export type ChangelogEntry = {
  slug: string;
  version: string;
  date: string;
  tool: string;
  toolSlug: string;
  badge: ChangelogBadge;
  description: string;
  draft: boolean;
};

type ChangelogEntryInput = {
  version?: unknown;
  date?: unknown;
  tool?: unknown;
  title?: unknown;
  badge?: unknown;
  description?: unknown;
  draft?: unknown;
  addedTools?: unknown;
  fixes?: unknown;
  content?: string;
};

const parseChangelogFilename = (name: string) => {
  const match = /^(.*)\.(tr|en)\.(mdx|md|json)$/i.exec(name);
  if (!match) return null;
  return {
    locale: match[2] as Locale,
    extension: `.${match[3].toLowerCase()}`,
  };
};

const normalizeString = (value: unknown) => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const normalizeBadge = (value: unknown): ChangelogBadge | null => {
  const normalized = normalizeString(value)?.toLowerCase();
  if (!normalized) return null;
  if (normalized === "new" || normalized === "added" || normalized === "yeni") return "new";
  if (normalized === "fixed" || normalized === "fix" || normalized === "fixed-up" || normalized === "duzeltildi") {
    return "fixed";
  }
  if (normalized === "removed" || normalized === "kaldirildi") return "removed";
  return null;
};

const normalizeStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const ensureValidDate = (value: string, filePath: string) => {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`[changelog] date must be a valid ISO-like string in ${filePath}`);
  }
};

const normalizeDescription = (input: ChangelogEntryInput) => {
  const content = input.content?.trim() ?? "";
  if (content.length > 0) return content;

  const description = normalizeString(input.description);
  if (description) return description;

  const addedTools = normalizeStringArray(input.addedTools);
  const fixes = normalizeStringArray(input.fixes);
  const lines = [
    ...addedTools.map((item) => `- Added: ${item}`),
    ...fixes.map((item) => `- Fixed: ${item}`),
  ];
  return lines.join("\n");
};

const normalizeEntry = (
  input: ChangelogEntryInput,
  filePath: string,
  index: number,
  fileKey: string,
): ChangelogEntry => {
  const version = normalizeString(input.version);
  if (!version) {
    throw new Error(`[changelog] version is required in ${filePath} (entry ${index + 1})`);
  }

  const date = normalizeString(input.date);
  if (!date) {
    throw new Error(`[changelog] date is required in ${filePath} (entry ${index + 1})`);
  }
  ensureValidDate(date, filePath);

  const tool = normalizeString(input.tool) ?? normalizeString(input.title);
  if (!tool) {
    throw new Error(`[changelog] tool is required in ${filePath} (entry ${index + 1})`);
  }

  const description = normalizeDescription(input);
  if (!description) {
    throw new Error(`[changelog] description/content is required in ${filePath} (entry ${index + 1})`);
  }

  const fallbackBadge = (() => {
    const addedTools = normalizeStringArray(input.addedTools);
    const fixes = normalizeStringArray(input.fixes);
    if (addedTools.length > 0) return "new" as const;
    if (fixes.length > 0) return "fixed" as const;
    return "fixed" as const;
  })();
  const badge = normalizeBadge(input.badge) ?? fallbackBadge;
  const draft = typeof input.draft === "boolean" ? input.draft : false;
  const slug = slugify(`${date}-${version}-${tool}-${fileKey}-${index + 1}`);

  return {
    slug,
    version,
    date,
    tool,
    toolSlug: slugify(tool),
    badge,
    description,
    draft,
  };
};

const parseMarkdownEntries = async (filePath: string, fileKey: string): Promise<ChangelogEntry[]> => {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as Record<string, unknown>;

  return [
    normalizeEntry(
      {
        ...frontmatter,
        content,
      },
      filePath,
      0,
      fileKey,
    ),
  ];
};

const parseJsonEntries = async (filePath: string, fileKey: string): Promise<ChangelogEntry[]> => {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  const items = Array.isArray(parsed)
    ? parsed
    : typeof parsed === "object" && parsed !== null && Array.isArray((parsed as { entries?: unknown }).entries)
      ? (parsed as { entries: unknown[] }).entries
      : [parsed];

  return items.map((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`[changelog] each JSON item must be an object in ${filePath} (entry ${index + 1})`);
    }

    return normalizeEntry(item as ChangelogEntryInput, filePath, index, fileKey);
  });
};

const parseChangelogFile = async (filePath: string, extension: string, fileKey: string): Promise<ChangelogEntry[]> => {
  if (extension === ".json") {
    return parseJsonEntries(filePath, fileKey);
  }

  return parseMarkdownEntries(filePath, fileKey);
};

export const getChangelogEntries = async (
  locale: Locale,
  options: { includeDrafts?: boolean } = {},
) => {
  let files: Array<{ fullPath: string; extension: string; fileKey: string }> = [];

  try {
    const entries = await fs.readdir(CHANGELOG_DIR, { withFileTypes: true });
    files = entries
      .filter((entry) => entry.isFile() && CONTENT_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => ({ entry, parsed: parseChangelogFilename(entry.name) }))
      .filter((item): item is { entry: (typeof entries)[number]; parsed: { locale: Locale; extension: string } } =>
        Boolean(item.parsed && item.parsed.locale === locale),
      )
      .map((item) => ({
        fullPath: path.join(CHANGELOG_DIR, item.entry.name),
        extension: item.parsed.extension,
        fileKey: item.entry.name,
      }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [] as ChangelogEntry[];
    }
    throw error;
  }

  const nested = await Promise.all(
    files.map((file) => parseChangelogFile(file.fullPath, file.extension, file.fileKey)),
  );
  const allEntries = nested.flat();

  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  const filtered = includeDrafts ? allEntries : allEntries.filter((item) => !item.draft);

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getLatestChangelogEntry = async (locale: Locale) => {
  const entries = await getChangelogEntries(locale);
  return entries[0] ?? null;
};
