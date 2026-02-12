import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import { getBrandCopy } from "@/config/brand";
import { buildPageMetadata } from "@/utils/metadata";
import { buildLocalizedCanonical, SITE_URL } from "@/utils/seo";
import { getToolCopy, toolCatalog, type ToolCatalogItem } from "@/tools/_shared/catalog";

const normalize = (value: string) => value.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

type ToolSeoPayload = {
  tool: ToolCatalogItem | null;
  title: string;
  description: string;
  path: string;
  canonical: string | undefined;
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

export const buildToolSeo = (toolKey: string, locale: Locale): ToolSeoPayload => {
  const { tool, path } = resolveTool(toolKey);
  const brand = getBrandCopy(locale);

  const toolCopy = tool ? getToolCopy(tool, locale) : null;
  const title = toolCopy?.title ? `${toolCopy.title} | ${brand.siteName}` : brand.siteName;
  const description = toolCopy?.description ?? brand.tagline;
  const canonical = buildLocalizedCanonical(path, locale);

  return {
    tool,
    title,
    description,
    path,
    canonical,
  };
};

export const buildToolMetadata = (toolKey: string, locale: Locale): Metadata => {
  const seo = buildToolSeo(toolKey, locale);
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
    locale,
  });
};

export const buildToolJsonLd = (toolKey: string, locale: Locale) => {
  const seo = buildToolSeo(toolKey, locale);
  const toolCopy = seo.tool ? getToolCopy(seo.tool, locale) : null;

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolCopy?.title ?? seo.title,
    description: seo.description,
    url: seo.canonical ?? new URL(seo.path, SITE_URL).toString(),
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Web",
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
  };
};
