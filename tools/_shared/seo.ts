import { toolCatalog } from "./catalog";
import { buildCanonical, SITE_URL } from "@/utils/seo";

export type ToolSeo = {
  name: string;
  title: string;
  description: string;
  href: string;
  canonical: string;
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

export function getToolSeo(toolPath: string): ToolSeo {
  const normalized = normalizePath(toolPath);
  const href = normalized ? `/tools/${normalized}` : "/tools";

  const byId = toolById.get(normalized);
  const byHref = toolByHref.get(href) ?? toolByHref.get(`/${normalized}`);
  const tool = byId ?? byHref ?? null;

  const name = tool?.title ?? titleize(normalized);
  const description =
    tool?.description ??
    "Mekanik hesaplama araci. Parametreleri gir, sonucu adim adim gor.";

  const canonical = buildCanonical(href) ?? new URL(href, SITE_URL).toString();

  return {
    name,
    title: `${name} | AI Engineers Lab`,
    description,
    href: tool?.href ?? href,
    canonical,
  };
}

export function buildToolSchema(toolPath: string) {
  const meta = getToolSeo(toolPath);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: meta.name,
    description: meta.description,
    applicationCategory: "Engineering Calculator",
    operatingSystem: "Web",
    inLanguage: "tr-TR",
    url: meta.canonical,
  };
}
