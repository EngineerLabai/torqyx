import "server-only";
import { getContentList, type ContentListItem } from "@/utils/content";
import { getToolCopy, toolCatalog, type ToolCatalogItem } from "@/tools/_shared/catalog";
import type { Locale } from "@/utils/locale";

export type RelatedBase = {
  title: string;
  tags?: string[];
  category?: string;
};

type RelatedCandidate = {
  title: string;
  tags?: string[];
  category?: string;
  date?: string;
};

type ScoredItem<T> = T & { score: number };

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTokens = (value: string) =>
  normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);

const hasTitleOverlap = (a: string, b: string) => {
  const tokensA = toTokens(a);
  const tokensB = new Set(toTokens(b));
  return tokensA.some((token) => tokensB.has(token));
};

const scoreCandidate = (base: RelatedBase, candidate: RelatedCandidate) => {
  let score = 0;

  const baseTags = new Set((base.tags ?? []).map(normalizeText).filter(Boolean));
  const candidateTags = candidate.tags ?? [];
  candidateTags.forEach((tag) => {
    if (baseTags.has(normalizeText(tag))) {
      score += 3;
    }
  });

  if (base.category && candidate.category) {
    const baseCategory = normalizeText(base.category);
    const candidateCategory = normalizeText(candidate.category);
    if (baseCategory && candidateCategory && baseCategory === candidateCategory) {
      score += 2;
    }
  }

  if (hasTitleOverlap(base.title, candidate.title)) {
    score += 1;
  }

  return score;
};

const sortByScore = <T extends RelatedCandidate>(items: ScoredItem<T>[], locale: Locale) => {
  return [...items].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;
    return a.title.localeCompare(b.title, locale === "en" ? "en-US" : "tr-TR");
  });
};

export const rankRelatedItems = <T extends RelatedCandidate>(
  base: RelatedBase,
  candidates: T[],
  locale: Locale,
) => {
  const scored = candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(base, candidate),
    }))
    .filter((item) => item.score > 0);

  return sortByScore(scored, locale);
};

const takeTop = <T extends RelatedCandidate>(items: ScoredItem<T>[], limit: number) =>
  items.slice(0, limit).map(({ score, ...rest }) => rest);

export const getRelatedForBlogPost = (
  post: ContentListItem,
  allPosts: ContentListItem[],
  options: { postLimit?: number; toolLimit?: number; locale?: Locale } = {},
) => {
  const locale = options.locale ?? "tr";
  const base: RelatedBase = {
    title: post.title,
    tags: post.tags,
    category: post.category,
  };

  const postLimit = options.postLimit ?? 3;
  const toolLimit = options.toolLimit ?? 4;

  const relatedPosts = rankRelatedItems(
    base,
    allPosts.filter((item) => item.slug !== post.slug),
    locale,
  );

  const relatedTools = rankRelatedItems(
    base,
    toolCatalog.map((tool) => {
      const copy = getToolCopy(tool, locale);
      return {
        title: copy.title,
        description: copy.description,
        category: tool.category,
        tags: tool.tags ?? [],
        href: tool.href,
        id: tool.id,
      };
    }),
    locale,
  );

  return {
    relatedPosts: takeTop(relatedPosts, postLimit),
    relatedTools: takeTop(relatedTools, toolLimit),
  };
};

export const getRelatedForTool = async (
  tool: ToolCatalogItem,
  options: { guideLimit?: number; glossaryLimit?: number; locale?: Locale } = {},
) => {
  const locale = options.locale ?? "tr";
  const [guides, glossary] = await Promise.all([
    getContentList("guides"),
    getContentList("glossary"),
  ]);

  const toolCopy = getToolCopy(tool, locale);
  const base: RelatedBase = {
    title: toolCopy.title,
    tags: tool.tags ?? [],
    category: tool.category,
  };

  const guideLimit = options.guideLimit ?? 4;
  const glossaryLimit = options.glossaryLimit ?? 4;

  const relatedGuides = rankRelatedItems(base, guides, locale);
  const relatedGlossary = rankRelatedItems(base, glossary, locale);

  return {
    guides: takeTop(relatedGuides, guideLimit),
    glossary: takeTop(relatedGlossary, glossaryLimit),
  };
};
