import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { Locale } from "@/utils/locale";
import { getRelatedForTool } from "@/utils/related-items";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import type { ToolDocsResponse, ToolDocExampleItem } from "@/lib/toolDocs/types";

type ToolDocMeta = Record<string, unknown>;

export type ToolDocSource = {
  mdxSource: string | null;
  meta: ToolDocMeta;
  examples: string | ToolDocExampleItem[] | null;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "tools");
const CONTENT_EXTENSIONS = [".mdx", ".md"];

const normalizeSlug = (slug: string) => slug.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

const resolveDocPath = (relativePath: string) => {
  const safePath = relativePath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!safePath || safePath.includes("..")) return null;
  const fullPath = path.resolve(CONTENT_ROOT, safePath);
  if (!fullPath.startsWith(CONTENT_ROOT)) return null;
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

const pickFirstFile = async (candidates: string[]) => {
  for (const candidate of candidates) {
    const resolved = resolveDocPath(candidate);
    const content = await readFileIfExists(resolved);
    if (content) {
      return { content, resolvedPath: resolved };
    }
  }
  return null;
};

const buildFileCandidates = (slug: string, locale?: Locale) => {
  const safeSlug = normalizeSlug(slug);
  if (!safeSlug || safeSlug.includes("..")) return [] as string[];

  const candidates: string[] = [];
  for (const ext of CONTENT_EXTENSIONS) {
    if (locale) {
      candidates.push(`${safeSlug}.${locale}${ext}`);
      candidates.push(`${safeSlug}/${locale}${ext}`);
    }
    candidates.push(`${safeSlug}${ext}`);
  }
  return candidates;
};

const buildSectionCandidates = (slug: string, section: "explanation" | "examples", locale?: Locale) => {
  const safeSlug = normalizeSlug(slug);
  if (!safeSlug || safeSlug.includes("..")) return [] as string[];

  const candidates: string[] = [];
  for (const ext of CONTENT_EXTENSIONS) {
    if (locale) {
      candidates.push(`${safeSlug}/${section}.${locale}${ext}`);
      candidates.push(`${safeSlug}/${section}${ext}`);
    } else {
      candidates.push(`${safeSlug}/${section}${ext}`);
    }
  }
  return candidates;
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[ıİ]/g, "i")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const EXPLANATION_TITLES = new Set([
  "aciklama",
  "hesaplama aciklamasi",
  "explanation",
  "calculation explanation",
]);

const EXAMPLES_TITLES = new Set(["ornekler", "ornek", "examples", "example"]);

const parseSections = (content: string) => {
  const lines = content.split(/\r?\n/);
  let inCodeBlock = false;
  const headings: Array<{ index: number; level: number; normalized: string }> = [];

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

const normalizeExamples = (value: unknown): ToolDocExampleItem[] | null => {
  if (!Array.isArray(value)) return null;
  const items = value.filter((item) => item && typeof item === "object") as ToolDocExampleItem[];
  if (items.length === 0) return null;
  return items;
};

export const loadToolDoc = async ({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}): Promise<ToolDocSource | null> => {
  const safeSlug = normalizeSlug(slug);
  if (!safeSlug || safeSlug.includes("..")) return null;

  const mainFile = await pickFirstFile(buildFileCandidates(safeSlug, locale));
  let meta: ToolDocMeta = {};
  let explanation: string | null = null;
  let examples: string | null = null;
  let examplesFromMeta: ToolDocExampleItem[] | null = null;

  if (mainFile) {
    const parsed = matter(mainFile.content);
    meta = parsed.data ?? {};
    examplesFromMeta = normalizeExamples(parsed.data?.examples);
    const sections = parseSections(parsed.content);
    if (!sections.explanation && !sections.examples) {
      explanation = parsed.content.trim() || null;
    } else {
      explanation = sections.explanation;
      examples = sections.examples;
    }
  }

  const explanationFile = await pickFirstFile(buildSectionCandidates(safeSlug, "explanation", locale));
  if (explanationFile) {
    const parsed = matter(explanationFile.content);
    if (!Object.keys(meta).length) {
      meta = parsed.data ?? {};
      examplesFromMeta = normalizeExamples(parsed.data?.examples);
    }
    explanation = parsed.content.trim() || null;
  }

  const examplesFile = await pickFirstFile(buildSectionCandidates(safeSlug, "examples", locale));
  if (examplesFile) {
    const parsed = matter(examplesFile.content);
    if (!Object.keys(meta).length) {
      meta = parsed.data ?? {};
      examplesFromMeta = normalizeExamples(parsed.data?.examples);
    }
    examples = parsed.content.trim() || null;
  }

  const hasExamples = Boolean(examples) || Boolean(examplesFromMeta);
  const hasExplanation = Boolean(explanation);
  if (!hasExplanation && !hasExamples) return null;

  return {
    mdxSource: explanation,
    meta,
    examples: examples ?? examplesFromMeta ?? null,
  };
};

const serializeMdx = async (source: string) =>
  serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    },
  });

const getToolBySlug = (slug: string) => {
  const normalized = normalizeSlug(slug);
  return toolCatalog.find((tool) => tool.href.replace(/^\/tools\//, "") === normalized) ?? null;
};

export const getToolDocsResponse = async (slug: string, locale: Locale): Promise<ToolDocsResponse> => {
  const doc = await loadToolDoc({ slug, locale });
  const tool = getToolBySlug(slug);
  const related = tool ? await getRelatedForTool(tool, { locale }) : { guides: [], glossary: [] };

  if (!doc) {
    return {
      tool: tool ? { id: tool.id, title: getToolCopy(tool, locale).title, tags: tool.tags ?? [] } : null,
      hasDocs: false,
      standard: null,
      explanation: null,
      examples: null,
      related,
    };
  }

  const explanation = doc.mdxSource ? await serializeMdx(doc.mdxSource) : null;
  let examples: ToolDocsResponse["examples"] = null;

  if (Array.isArray(doc.examples)) {
    examples = { kind: "json", items: doc.examples };
  } else if (typeof doc.examples === "string") {
    examples = { kind: "mdx", source: await serializeMdx(doc.examples) };
  }

  const hasDocs = Boolean(explanation) || Boolean(examples);

  return {
    tool: tool ? { id: tool.id, title: getToolCopy(tool, locale).title, tags: tool.tags ?? [] } : null,
    hasDocs,
    standard: null,
    explanation,
    examples,
    related,
  };
};
