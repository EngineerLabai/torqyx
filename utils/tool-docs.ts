import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

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
};

const TOOL_CONTENT_ROOT = path.join(process.cwd(), "content", "tools");

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const resolveDocFilePath = (slug: string) => {
  const safeSlug = slug.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!safeSlug || safeSlug.includes("..")) return null;

  const fullPath = path.resolve(TOOL_CONTENT_ROOT, `${safeSlug}.mdx`);
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

export const getToolDocs = async (slug: string): Promise<ToolDocs> => {
  const filePath = resolveDocFilePath(slug);
  const content = await readFileIfExists(filePath);
  if (!content) {
    return { hasDocs: false, explanation: null, examples: null };
  }

  const sections = parseSections(content);
  const hasSections = Boolean(sections.explanation || sections.examples);
  return {
    hasDocs: hasSections,
    explanation: sections.explanation,
    examples: sections.examples,
  };
};
