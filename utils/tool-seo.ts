import type { Metadata } from "next";
import type { WebApplicationSchemaInput } from "@/types/structured-data";
import type { Locale } from "@/utils/locale";
import { getBrandCopy } from "@/config/brand";
import { buildPageMetadata } from "@/utils/metadata";
import { buildLocalizedCanonical, CANONICAL_SITE_URL, SITE_URL } from "@/utils/seo";
import { getToolCopy, toolCatalog, type ToolCatalogItem } from "@/tools/_shared/catalog";
import { buildHowToSchema, type ToolConfig } from "@/utils/howto-schema";
import { getToolPageTool } from "@/tools/tool-page-tools";

const normalize = (value: string) => value.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

type ToolSeoPayload = {
  tool: ToolCatalogItem | null;
  title: string;
  description: string;
  path: string;
  canonical: string | undefined;
  featureList: string[];
};

const resolveTool = (toolKey: string): { tool: ToolCatalogItem | null; path: string } => {
  const normalized = normalize(toolKey);
  const candidates = [
    normalized.startsWith("tools/") ? `/${normalized}` : `/tools/${normalized}`,
    `/${normalized}`,
  ];

  const tool =
    toolCatalog.find((item) => item.id === normalized) ??
    toolCatalog.find((item) => candidates.includes(item.href)) ??
    toolCatalog.find((item) => normalize(item.href) === normalized) ??
    null;

  const path = tool?.href ?? candidates[0];

  return { tool, path };
};

const buildFeatureList = (tool: ToolCatalogItem | null) => {
  const features = new Set<string>();
  features.add("Deterministic engineering calculations");

  if (tool?.category) {
    features.add(`${tool.category} workflows`);
  }

  if (tool?.tags?.length) {
    tool.tags.forEach((tag) => features.add(`Supports ${tag} analysis`));
  }

  if (tool?.validationStandard) {
    features.add(`Validation baseline: ${tool.validationStandard}`);
  }

  return Array.from(features);
};

const hasCalculatorWord = (value: string, locale: Locale) => {
  const normalized = value.toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US");
  return locale === "tr"
    ? /hesap|hesaplayıcı|kalkülatör/.test(normalized)
    : /calculator|calculation|converter|selector|sizing/.test(normalized);
};

const buildSeoTitle = (tool: ToolCatalogItem | null, name: string, brandName: string, locale: Locale) => {
  if (!tool) return brandName;
  if (tool.id === "belt-length") return name;

  if (tool.type === "guide") {
    const guideWord = locale === "tr" ? "Rehberi" : "Guide";
    return name.toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US").includes(guideWord.toLocaleLowerCase())
      ? name
      : `${name} ${guideWord}`;
  }

  if (tool.type === "bundle") {
    return locale === "tr" ? `${name} Araçları` : `${name} Tools`;
  }

  if (hasCalculatorWord(name, locale)) return name;
  return locale === "tr" ? `${name} Hesaplayıcı` : `${name} Calculator`;
};

const buildSeoDescription = (
  tool: ToolCatalogItem | null,
  description: string,
  brandTagline: string,
  locale: Locale,
) => {
  if (!tool) return brandTagline;

  const support =
    locale === "tr"
      ? " Formüller, birim kontrolü ve ilgili mühendislik hesaplayıcılarıyla hızlı sonuç alın."
      : " Get fast results with formulas, unit checks, and related engineering calculators.";

  const normalized = description.replace(/\s+/g, " ").trim();
  if (normalized.length >= 120) {
    return normalized;
  }
  return `${normalized}${support}`;
};

export const buildToolSeo = (toolKey: string, locale: Locale): ToolSeoPayload => {
  const { tool, path } = resolveTool(toolKey);
  const brand = getBrandCopy(locale);

  const toolCopy = tool ? getToolCopy(tool, locale) : null;
  const title = buildSeoTitle(tool, toolCopy?.title ?? brand.siteName, brand.siteName, locale);
  const description = buildSeoDescription(tool, toolCopy?.description ?? brand.tagline, brand.tagline, locale);
  const canonical = buildLocalizedCanonical(path, locale);

  return {
    tool,
    title,
    description,
    path,
    canonical,
    featureList: buildFeatureList(tool),
  };
};

export const buildToolMetadata = (toolKey: string, locale: Locale): Metadata => {
  const seo = buildToolSeo(toolKey, locale);
  const toolCopy = seo.tool ? getToolCopy(seo.tool, locale) : null;
  const toolName = toolCopy?.title ?? seo.title;
  const canonicalUrl = seo.canonical ?? new URL(seo.path, CANONICAL_SITE_URL).toString();
  const socialTitle = seo.tool?.id === "belt-length" ? toolName : `${toolName} | TORQYX`;

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
    locale,
    openGraph: {
      title: socialTitle,
      description: seo.description,
      url: canonicalUrl,
    },
    twitter: {
      title: socialTitle,
      description: seo.description,
    },
    absoluteTitle: seo.tool?.id === "belt-length",
  });
};

export const buildToolJsonLd = (toolKey: string, locale: Locale): WebApplicationSchemaInput => {
  const seo = buildToolSeo(toolKey, locale);
  const toolCopy = seo.tool ? getToolCopy(seo.tool, locale) : null;

  return {
    name: toolCopy?.title ?? seo.title,
    description: seo.description,
    url: seo.canonical ?? new URL(seo.path, SITE_URL).toString(),
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Web",
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    featureList: seo.featureList,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
};

/**
 * Tool için HowTo JSON-LD schema üretir
 */
export const buildToolHowToJsonLd = (toolKey: string, locale: Locale) => {
  const toolPageTool = getToolPageTool(toolKey);
  const catalogTool = toolCatalog.find(t => t.id === toolKey);

  if (!toolPageTool || !catalogTool) {
    return null;
  }

  // ToolConfig oluştur
  const toolConfig: ToolConfig = {
    ...toolPageTool,
    id: catalogTool.id,
    title: catalogTool.title,
    description: catalogTool.description,
  };

  return buildHowToSchema(toolConfig, locale);
};
