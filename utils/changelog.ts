import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "@/utils/slugify";

const CHANGELOG_DIR = path.join(process.cwd(), "content", "changelog");

export type ChangelogEntry = {
  slug: string;
  version: string;
  title: string;
  description: string;
  date: string;
  addedTools: string[];
  fixes: string[];
  draft: boolean;
  content: string;
};

const parseChangelogFile = async (filePath: string): Promise<ChangelogEntry> => {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as Record<string, unknown>;

  const required = ["version", "title", "description", "date"];
  const missing = required.filter((field) => frontmatter[field] === undefined);
  if (missing.length > 0) {
    throw new Error(`[changelog] Missing fields (${missing.join(", ")}) in ${filePath}`);
  }

  if (typeof frontmatter.version !== "string" || frontmatter.version.trim().length === 0) {
    throw new Error(`[changelog] version must be a string in ${filePath}`);
  }
  if (typeof frontmatter.title !== "string" || frontmatter.title.trim().length === 0) {
    throw new Error(`[changelog] title must be a string in ${filePath}`);
  }
  if (typeof frontmatter.description !== "string" || frontmatter.description.trim().length === 0) {
    throw new Error(`[changelog] description must be a string in ${filePath}`);
  }
  if (typeof frontmatter.date !== "string" || Number.isNaN(Date.parse(frontmatter.date))) {
    throw new Error(`[changelog] date must be a valid string in ${filePath}`);
  }

  const addedTools = Array.isArray(frontmatter.addedTools)
    ? frontmatter.addedTools.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];
  const fixes = Array.isArray(frontmatter.fixes)
    ? frontmatter.fixes.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];
  const draft = typeof frontmatter.draft === "boolean" ? frontmatter.draft : false;

  return {
    slug: slugify(frontmatter.version.trim()),
    version: frontmatter.version.trim(),
    title: frontmatter.title.trim(),
    description: frontmatter.description.trim(),
    date: frontmatter.date,
    addedTools,
    fixes,
    draft,
    content,
  };
};

export const getChangelogEntries = async (options: { includeDrafts?: boolean } = {}) => {
  let files: string[] = [];
  try {
    const entries = await fs.readdir(CHANGELOG_DIR, { withFileTypes: true });
    files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).map((entry) => path.join(CHANGELOG_DIR, entry.name));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const items = await Promise.all(files.map((file) => parseChangelogFile(file)));
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  const filtered = includeDrafts ? items : items.filter((item) => !item.draft);

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getLatestChangelogEntry = async () => {
  const entries = await getChangelogEntries();
  return entries[0] ?? null;
};
