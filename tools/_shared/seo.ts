import { getToolCopy, toolCatalog } from "./catalog";
import { getBrandCopy } from "@/config/brand";
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
  };
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

export function getToolSeo(toolPath: string, locale: Locale = DEFAULT_LOCALE): ToolSeo {
  const normalized = normalizePath(toolPath);
  const href = normalized ? `/tools/${normalized}` : "/tools";

  const byId = toolById.get(normalized);
  const byHref = toolByHref.get(href) ?? toolByHref.get(`/${normalized}`);
  const tool = byId ?? byHref ?? null;

  const toolCopy = tool ? getToolCopy(tool, locale) : null;
  const name = toolCopy?.title ?? tool?.title ?? titleize(normalized);
  const description =
    toolCopy?.description ??
    tool?.description ??
    (locale === "tr"
      ? "Mekanik hesaplama aracı. Parametreleri gir, sonucu adım adım gör."
      : "Engineering calculator. Enter parameters and review step-by-step results.");

  const brandName = getBrandCopy(locale).siteName;
  const suffix = locale === "tr" ? "Hesaplayıcı" : "Calculator";
  const title = `${name} ${suffix} | ${brandName}`;

  const canonical = buildLocalizedCanonical(tool?.href ?? href, locale);
  const alternates = buildLanguageAlternates(tool?.href ?? href);

  return {
    name,
    title,
    description,
    href: tool?.href ?? href,
    canonical,
    alternates,
  };
}

export function buildToolSchema(toolPath: string, locale: Locale = DEFAULT_LOCALE) {
  const meta = getToolSeo(toolPath, locale);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: meta.name,
    description: meta.description,
    applicationCategory: "Engineering Calculator",
    operatingSystem: "Web",
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    url: meta.canonical,
  };
}
