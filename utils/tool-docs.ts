import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/utils/locale";
import { toolDocStandardSchema, type ToolDocStandard } from "@/lib/tool-docs/schema";

export type ToolExampleItem = {
  title: string;
  description?: string;
  inputs?: Record<string, string>;
  outputs?: Record<string, string>;
  notes?: string[];
};

export type ToolDocs = {
  hasDocs: boolean;
  explanation: string | null;
  examples: string | null;
  standard: ToolDocStandard | null;
};

const TOOL_CONTENT_ROOT = path.join(process.cwd(), "content", "tools");

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/ı/g, "i")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const resolveDocFilePath = (relativePath: string) => {
  const safePath = relativePath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!safePath || safePath.includes("..")) return null;

  const fullPath = path.resolve(TOOL_CONTENT_ROOT, safePath);
  if (!fullPath.startsWith(TOOL_CONTENT_ROOT)) return null;
  return fullPath;
};

const readFileIfExists = async (filePath: string | null) => {
  if (!filePath) return null;
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
};

const buildCandidates = (slug: string, locale?: Locale, extension = "mdx") => {
  const safeSlug = slug.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!safeSlug || safeSlug.includes("..")) return [];

  const candidates: string[] = [];
  if (locale) {
    candidates.push(`${safeSlug}.${locale}.${extension}`);
  }
  candidates.push(`${safeSlug}.${extension}`);
  return candidates;
};

const readFirstAvailable = async (slug: string, locale?: Locale, extension = "mdx") => {
  const candidates = buildCandidates(slug, locale, extension)
    .map(resolveDocFilePath)
    .filter((value): value is string => Boolean(value));

  for (const filePath of candidates) {
    const content = await readFileIfExists(filePath);
    if (content) return content;
  }

  return null;
};

const readToolDocStandard = async (slug: string, locale?: Locale): Promise<ToolDocStandard | null> => {
  const content = await readFirstAvailable(slug, locale, "json");
  if (!content) return null;

  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch {
    throw new Error(`[tool-docs] Invalid JSON for ${slug} (${locale ?? "default"}).`);
  }

  const parsed = toolDocStandardSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(`[tool-docs] Invalid standard doc for ${slug} (${locale ?? "default"}): ${issues}`);
  }

  return parsed.data;
};

const EXPLANATION_TITLES = new Set([
  "aciklama",
  "hesaplama aciklamasi",
  "explanation",
  "calculation explanation",
]);

const EXAMPLES_TITLES = new Set([
  "ornekler",
  "ornek",
  "examples",
  "example",
]);

const parseSections = (content: string) => {
  const lines = content.split(/\r?\n/);
  let inCodeBlock = false;
  const headings: Array<{ index: number; level: number; title: string; normalized: string }> = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      return;
    }
    if (inCodeBlock) return;

    const match = /^(#{1,4})\s+(.+)$/.exec(line);
    if (!match) return;

    const level = match[1].length;
    const rawTitle = match[2].trim().replace(/\s+#*$/, "");
    headings.push({
      index,
      level,
      title: rawTitle,
      normalized: normalizeText(rawTitle),
    });
  });

  const topLevel = headings.filter((heading) => heading.level === 1);
  const markers = topLevel.length > 0 ? topLevel : headings.filter((heading) => heading.level === 2);

  const result: { explanation: string | null; examples: string | null } = {
    explanation: null,
    examples: null,
  };

  markers.forEach((marker, idx) => {
    const next = markers.slice(idx + 1).find((heading) => heading.level <= marker.level);
    const end = next ? next.index : lines.length;
    const body = lines.slice(marker.index + 1, end).join("\n").trim();
    if (!body) return;

    if (EXPLANATION_TITLES.has(marker.normalized)) {
      result.explanation = body;
    }

    if (EXAMPLES_TITLES.has(marker.normalized)) {
      result.examples = body;
    }
  });

  return result;
};

export const getToolDocs = async (slug: string, locale?: Locale): Promise<ToolDocs> => {
  const standard = await readToolDocStandard(slug, locale);
  if (standard) {
    return {
      hasDocs: true,
      explanation: null,
      examples: null,
      standard,
    };
  }

  const content = await readFirstAvailable(slug, locale);
  if (!content) {
    return { hasDocs: false, explanation: null, examples: null, standard: null };
  }

  const sections = parseSections(content);
  const hasSections = Boolean(sections.explanation || sections.examples);
  return {
    hasDocs: hasSections,
    explanation: sections.explanation,
    examples: sections.examples,
    standard: null,
  };
};

export const getToolDocStandard = async (slug: string, locale?: Locale) => readToolDocStandard(slug, locale);
