import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { TocItem } from "@/utils/content";
import { extractToc } from "@/utils/content";
import type { Locale } from "@/utils/locale";
import { getToolCopy, toolCatalog, type ToolCatalogItem } from "@/tools/_shared/catalog";

const CONTENT_ROOT = path.join(process.cwd(), "content", "tools");
const DEFAULT_RELATED_LIMIT = 4;
const DEFAULT_DATE = "2026-03-07";

export type ToolGuideRelatedTool = {
  id: string;
  href: string;
  guideHref: string;
  title: string;
  description: string;
};

export type ToolGuideDocument = {
  slug: string;
  locale: Locale;
  tool: ToolCatalogItem;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  standards: string[];
  content: string;
  toc: TocItem[];
  source: "file" | "fallback";
  relatedTools: ToolGuideRelatedTool[];
};

type ToolGuideFrontmatter = {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  updatedAt?: unknown;
  standards?: unknown;
  relatedTools?: unknown;
};

const normalizePathToken = (value: string) => value.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTokenSet = (value: string) =>
  new Set(
    normalizeText(value)
      .split(" ")
      .map((token) => token.trim())
      .filter((token) => token.length >= 2),
  );

const toSlugTokenSet = (slug: string) =>
  new Set(
    slug
      .split(/[/-]+/g)
      .map((token) => normalizeText(token))
      .filter((token) => token.length >= 2),
  );

const intersectCount = (left: Set<string>, right: Set<string>) => {
  let count = 0;
  for (const value of left) {
    if (right.has(value)) count += 1;
  }
  return count;
};

const asOptionalString = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const asStringArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }
  const maybeString = asOptionalString(value);
  if (!maybeString) return [] as string[];
  return maybeString
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const resolveToolFromSlug = (slug: string) => {
  const normalized = normalizePathToken(slug);
  if (!normalized || normalized.includes("..")) return null;
  const normalizedHref = `/tools/${normalized}`;
  return (
    toolCatalog.find((tool) => tool.id === normalized) ??
    toolCatalog.find((tool) => normalizePathToken(tool.href) === normalizePathToken(normalizedHref)) ??
    toolCatalog.find((tool) => normalizePathToken(tool.href.replace(/^\/tools\//, "")) === normalized) ??
    null
  );
};

const buildGuideFileCandidates = (slug: string, locale: Locale) => {
  const safeSlug = normalizePathToken(slug);
  if (!safeSlug || safeSlug.includes("..")) return [] as string[];

  return [
    `${safeSlug}/guide.${locale}.mdx`,
    `${safeSlug}/guide.${locale}.md`,
    `${safeSlug}/guide.mdx`,
    `${safeSlug}/guide.md`,
  ];
};

const readFirstExistingFile = async (candidates: string[]) => {
  for (const candidate of candidates) {
    const fullPath = path.resolve(CONTENT_ROOT, candidate);
    if (!fullPath.startsWith(CONTENT_ROOT)) {
      continue;
    }
    try {
      const source = await fs.readFile(fullPath, "utf8");
      return source;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }

  return null;
};

const toIsoDate = (value: unknown, fallback: string) => {
  const maybeString = asOptionalString(value);
  if (!maybeString) return fallback;
  const parsed = new Date(maybeString);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
};

const buildFallbackGuideContent = (tool: ToolCatalogItem, locale: Locale) => {
  const copy = getToolCopy(tool, locale);
  const toolName = copy.title;
  const standard = tool.validationStandard || "ISO / DIN / VDI";

  if (locale === "en") {
    return `## Problem Definition

${toolName} is used to reduce manual errors and speed up engineering decision making when repeated calculations are needed.

## Formula Explanation

Step-by-step flow:

1. Define all inputs and units.
2. Convert units to a consistent basis.
3. Apply the core equation in sequence.
4. Validate the output range and boundary conditions.

Visual flow (placeholder):

\`\`\`text
Input -> Unit Check -> Formula -> Validation -> Decision
\`\`\`

## Worked Example

Use a realistic sample input set and walk through each step to verify intermediate values before final output.

## Common Mistakes

- Mixing unit systems (mm vs m, bar vs Pa)
- Ignoring boundary conditions
- Rounding too early in intermediate steps

## Relevant Standards (ISO/DIN/VDI)

Reference baseline: ${standard}

## Related Tools

Use the related tool links below to continue with upstream or downstream checks.
`;
  }

  return `## Problem Tanimi

${toolName} tekrarlayan muhendislik hesaplarinda hiz ve tutarlilik saglamak icin kullanilir.

## Formul Aciklamasi

Adim adim akis:

1. Giris degerlerini ve birimleri tanimla.
2. Tum birimleri ayni sistemde normalize et.
3. Ana formul adimlarini sirayla uygula.
4. Sonucu sinir kosullari ve mantik kontrolu ile dogrula.

Gorsel akis (placeholder):

\`\`\`text
Girdi -> Birim Kontrol -> Formul -> Dogrulama -> Karar
\`\`\`

## Ornek Cozum

Gercekci bir deger seti ile ara adimlari gostererek nihai sonucu hesapla.

## Sik Yapilan Hatalar

- Birim donusumunu atlamak
- Sinir kosullarini goz ardi etmek
- Ara adimlarda erken yuvarlama yapmak

## Ilgili Standart Referansi (ISO/DIN/VDI)

Temel referans: ${standard}

## Ilgili Araclar

Asagidaki ilgili arac linkleri ile bagli hesap kontrollerine devam edebilirsin.
`;
};

const buildGuideHref = (toolHref: string) => `${toolHref.replace(/\/+$/g, "")}/guide`;

const scoreRelatedTool = (
  baseTool: ToolCatalogItem,
  baseSlug: string,
  candidate: ToolCatalogItem,
  manualBoost: Set<string>,
) => {
  let score = 0;

  if (baseTool.category && candidate.category && baseTool.category === candidate.category) {
    score += 3;
  }

  const baseTags = new Set((baseTool.tags ?? []).map((item) => normalizeText(item)));
  const candidateTags = new Set((candidate.tags ?? []).map((item) => normalizeText(item)));
  score += intersectCount(baseTags, candidateTags) * 2;

  const baseSlugTokens = toSlugTokenSet(baseSlug);
  const candidateSlug = normalizePathToken(candidate.href.replace(/^\/tools\//, ""));
  const candidateSlugTokens = toSlugTokenSet(candidateSlug);
  score += intersectCount(baseSlugTokens, candidateSlugTokens) * 2;

  const baseTitleTokens = toTokenSet(baseTool.title);
  const candidateTitleTokens = toTokenSet(candidate.title);
  score += intersectCount(baseTitleTokens, candidateTitleTokens);

  if (manualBoost.has(candidate.id) || manualBoost.has(candidateSlug)) {
    score += 5;
  }

  return score;
};

const buildRelatedTools = (
  tool: ToolCatalogItem,
  slug: string,
  locale: Locale,
  manualRelated: string[],
  limit = DEFAULT_RELATED_LIMIT,
): ToolGuideRelatedTool[] => {
  const manualBoost = new Set(manualRelated.map((item) => normalizePathToken(item)));

  return toolCatalog
    .filter((candidate) => candidate.id !== tool.id)
    .map((candidate) => {
      const score = scoreRelatedTool(tool, slug, candidate, manualBoost);
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.candidate.id.localeCompare(b.candidate.id);
    })
    .slice(0, limit)
    .map((entry) => {
      const copy = getToolCopy(entry.candidate, locale);
      return {
        id: entry.candidate.id,
        href: entry.candidate.href,
        guideHref: buildGuideHref(entry.candidate.href),
        title: copy.title,
        description: copy.description,
      };
    });
};

const parseGuideSource = (
  source: string,
  fallbackTool: ToolCatalogItem,
  locale: Locale,
): {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  standards: string[];
  content: string;
  manualRelated: string[];
} => {
  const parsed = matter(source);
  const meta = (parsed.data ?? {}) as ToolGuideFrontmatter;
  const fallbackCopy = getToolCopy(fallbackTool, locale);
  const publishedFallback = fallbackTool.lastUpdated
    ? new Date(fallbackTool.lastUpdated).toISOString()
    : new Date(DEFAULT_DATE).toISOString();

  return {
    title:
      asOptionalString(meta.title) ??
      (locale === "en" ? `${fallbackCopy.title}: How to Use Guide` : `${fallbackCopy.title}: Nasil Kullanilir Rehberi`),
    description:
      asOptionalString(meta.description) ??
      (locale === "en"
        ? `${fallbackCopy.description} Step-by-step method, examples, common mistakes, standards, and related tools.`
        : `${fallbackCopy.description} Adim adim yontem, ornek cozum, sik hatalar, standartlar ve ilgili araclar.`),
    datePublished: toIsoDate(meta.date, publishedFallback),
    dateModified: toIsoDate(meta.updatedAt, publishedFallback),
    standards: asStringArray(meta.standards).length > 0 ? asStringArray(meta.standards) : [fallbackTool.validationStandard],
    content: parsed.content.trim(),
    manualRelated: asStringArray(meta.relatedTools),
  };
};

export const getToolGuideBySlug = async ({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}): Promise<ToolGuideDocument | null> => {
  const normalizedSlug = normalizePathToken(slug);
  if (!normalizedSlug || normalizedSlug.includes("..")) return null;

  const tool = resolveToolFromSlug(normalizedSlug);
  if (!tool) return null;

  const source = await readFirstExistingFile(buildGuideFileCandidates(normalizedSlug, locale));
  const parsed = source
    ? parseGuideSource(source, tool, locale)
    : parseGuideSource(buildFallbackGuideContent(tool, locale), tool, locale);

  const relatedTools = buildRelatedTools(tool, normalizedSlug, locale, parsed.manualRelated);
  const toc = extractToc(parsed.content, 2, 4);

  return {
    slug: normalizedSlug,
    locale,
    tool,
    title: parsed.title,
    description: parsed.description,
    datePublished: parsed.datePublished,
    dateModified: parsed.dateModified,
    standards: parsed.standards,
    content: parsed.content,
    toc,
    source: source ? "file" : "fallback",
    relatedTools,
  };
};

export const toToolSlugFromPathParts = (parts: string[]) =>
  normalizePathToken(parts.filter(Boolean).join("/"));

