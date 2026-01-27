import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { extractToc } from "@/utils/content";

export type ToolExampleItem = {
  title: string;
  description?: string;
  inputs?: Record<string, string>;
  outputs?: Record<string, string>;
  notes?: string[];
};

export type ToolExamplesData =
  | { kind: "mdx"; source: string }
  | { kind: "json"; items: ToolExampleItem[] };

const TOOL_CONTENT_ROOT = path.join(process.cwd(), "content", "tools");

const REQUIRED_EXPLANATION_SECTIONS = [
  "Formuller",
  "Degisken aciklamalari",
  "Birimler",
  "Kullanim senaryolari",
  "Dogrulama ve uyari notlari",
];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const resolveDocPath = (slug: string, filename: string) => {
  const safeSlug = slug.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (safeSlug.includes("..")) return null;

  const fullPath = path.resolve(TOOL_CONTENT_ROOT, safeSlug, filename);
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

const validateExplanationSections = (content: string, sourcePath: string) => {
  const headings = new Set(extractToc(content).map((item) => normalizeText(item.text)));
  const missing = REQUIRED_EXPLANATION_SECTIONS.filter(
    (section) => !headings.has(normalizeText(section)),
  );

  if (missing.length > 0) {
    throw new Error(
      `[content] Tool explanation must include sections (${missing.join(", ")}) in ${sourcePath}`,
    );
  }
};

const ensureExampleShape = (value: unknown): ToolExampleItem[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      if (typeof record.title !== "string" || record.title.trim().length === 0) return null;

      const inputs = record.inputs && typeof record.inputs === "object" ? (record.inputs as Record<string, unknown>) : null;
      const outputs = record.outputs && typeof record.outputs === "object" ? (record.outputs as Record<string, unknown>) : null;
      const notes = Array.isArray(record.notes)
        ? record.notes.filter((note) => typeof note === "string")
        : undefined;

      const stringifyMap = (map: Record<string, unknown> | null | undefined) => {
        if (!map) return undefined;
        const entries = Object.entries(map).filter(([, value]) => value !== undefined);
        if (entries.length === 0) return undefined;
        return entries.reduce<Record<string, string>>((acc, [key, value]) => {
          if (value === null) return acc;
          acc[key] = String(value);
          return acc;
        }, {});
      };

      return {
        title: record.title.trim(),
        description: typeof record.description === "string" ? record.description : undefined,
        inputs: stringifyMap(inputs),
        outputs: stringifyMap(outputs),
        notes: notes && notes.length > 0 ? notes : undefined,
      } satisfies ToolExampleItem;
    })
    .filter(Boolean) as ToolExampleItem[];
};

export const getToolExplanation = async (slug: string) => {
  const filePath = resolveDocPath(slug, "explanation.mdx");
  const content = await readFileIfExists(filePath);
  if (!content || !filePath) return null;
  validateExplanationSections(content, filePath);
  return content;
};

export const getToolExamples = async (slug: string): Promise<ToolExamplesData | null> => {
  const mdxPath = resolveDocPath(slug, "examples.mdx");
  const mdxContent = await readFileIfExists(mdxPath);
  if (mdxContent) {
    return { kind: "mdx", source: mdxContent };
  }

  const jsonPath = resolveDocPath(slug, "examples.json");
  const jsonContent = await readFileIfExists(jsonPath);
  if (!jsonContent) return null;

  try {
    const parsed = JSON.parse(jsonContent);
    const items = ensureExampleShape(parsed);
    return { kind: "json", items };
  } catch {
    return { kind: "json", items: [] };
  }
};

export const getToolDocs = async (slug: string) => {
  const [explanation, examples] = await Promise.all([
    getToolExplanation(slug),
    getToolExamples(slug),
  ]);

  return { explanation, examples };
};
