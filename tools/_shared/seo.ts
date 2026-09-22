import { getToolCopy, toolCatalog } from "./catalog";
import { getBrandCopy } from "@/config/brand";
import type { WebApplicationSchemaInput } from "@/types/structured-data";
import type { Locale } from "@/utils/locale";
import { DEFAULT_LOCALE } from "@/utils/locale";
import { buildLanguageAlternates, buildLocalizedCanonical } from "@/utils/seo";

export type ToolSeo = {
  name: string;
  title: string;
  description: string;
  href: string;
  canonical: string;
  alternates: {
    tr: string;
    en: string;
    "x-default": string;
  };
  featureList: string[];
};

const toolById = new Map(toolCatalog.map((tool) => [tool.id, tool]));
const toolByHref = new Map(toolCatalog.map((tool) => [tool.href, tool]));

const normalizePath = (value: string) =>
  value.replace(/^\/+/, "").replace(/^tools\//, "").replace(/\/$/, "");

const titleize = (value: string) => {
  if (!value) return "Tool";
  const last = value.split("/").filter(Boolean).slice(-1)[0] ?? value;
  return last
    .split(/[-_\s]+/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
};

const buildFeatureList = (toolId: string, locale: Locale) => {
  const normalized = normalizePath(toolId);
  const href = normalized ? `/tools/${normalized}` : "/tools";
  const tool =
    toolById.get(normalized) ??
    toolByHref.get(href) ??
    toolByHref.get(`/${normalized}`) ??
    null;

  const features = new Set<string>();
  features.add("Deterministic engineering calculations");

  if (tool?.type === "guide") {
    features.add(locale === "tr" ? "Mühendislik referans rehberi" : "Engineering reference guidance");
  }

  if (tool?.category) {
    features.add(`${tool.category} workflows`);
  }

  if (tool?.tags?.length) {
    tool.tags.forEach((tag) => features.add(`Supports ${tag} analysis`));
  }

  if (tool?.validationStandard) {
    features.add(`Reference baseline: ${tool.validationStandard}`);
  }

  return Array.from(features);
};

export function getToolSeo(toolPath: string, locale: Locale = DEFAULT_LOCALE): ToolSeo {
  const normalized = normalizePath(toolPath);
  const href = normalized ? `/tools/${normalized}` : "/tools";
  const tool = toolById.get(normalized) ?? toolByHref.get(href) ?? toolByHref.get(`/${normalized}`) ?? null;

  const toolCopy = tool ? getToolCopy(tool, locale) : null;
  const name = toolCopy?.title ?? tool?.title ?? titleize(normalized);
  const description =
    toolCopy?.description ??
    tool?.description ??
    (locale === "tr"
      ? "Mekanik hesaplama aracı. Parametreleri girin ve sonucu adım adım inceleyin."
      : "Engineering calculator. Enter parameters and review step-by-step results.");

  const brandName = getBrandCopy(locale).siteName;
  const suffix = locale === "tr" ? "Hesaplayıcı" : "Calculator";
  const title = tool?.id === "belt-length" ? name : `${name} ${suffix} | ${brandName}`;
  const canonical = buildLocalizedCanonical(tool?.href ?? href, locale);
  const alternates = buildLanguageAlternates(tool?.href ?? href);

  return {
    name,
    title,
    description,
    href: tool?.href ?? href,
    canonical,
    alternates,
    featureList: buildFeatureList(normalized, locale),
  };
}

export function buildToolApplicationSchema(
  toolPath: string,
  locale: Locale = DEFAULT_LOCALE,
): WebApplicationSchemaInput {
  const meta = getToolSeo(toolPath, locale);
  const normalized = normalizePath(toolPath);
  const tool = toolById.get(normalized) ?? toolByHref.get(meta.href) ?? null;
  const applicationCategory = tool?.type === "guide" ? "ReferenceApplication" : "UtilitiesApplication";

  return {
    name: meta.name,
    description: meta.description,
    applicationCategory,
    applicationSubCategory: tool?.category === "Mechanical" ? "Mechanical engineering utility" : "Engineering utility",
    operatingSystem: "Web",
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    url: meta.canonical,
    featureList: meta.featureList,
  };
}

export function buildToolSchema(toolPath: string, locale: Locale = DEFAULT_LOCALE) {
  const application = buildToolApplicationSchema(toolPath, locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        ...application,
      },
    ],
  };
}
