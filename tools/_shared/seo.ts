import fs from "node:fs";
import path from "node:path";
import { getToolCopy, toolCatalog } from "./catalog";
import { getBrandCopy } from "@/config/brand";
import type { HowToSchemaInput, WebApplicationSchemaInput } from "@/types/structured-data";
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
  howToSteps: string[];
};

const toolById = new Map(toolCatalog.map((tool) => [tool.id, tool]));
const toolByHref = new Map(toolCatalog.map((tool) => [tool.href, tool]));
const TOOL_CONTENT_ROOT = path.join(/* turbopackIgnore: true */ process.cwd(), "content", "tools");

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
    features.add(`Validation baseline: ${tool.validationStandard}`);
  }

  return Array.from(features);
};

const getToolHowToStepsFromContent = (toolPath: string, locale: Locale) => {
  const normalized = normalizePath(toolPath);
  if (!normalized || normalized.includes("..")) return [] as string[];

  const candidates = [
    path.join(TOOL_CONTENT_ROOT, `${normalized}.${locale}.json`),
    path.join(TOOL_CONTENT_ROOT, `${normalized}.json`),
  ];

  for (const candidate of candidates) {
    try {
      if (!candidate.startsWith(TOOL_CONTENT_ROOT)) continue;
      const raw = fs.readFileSync(candidate, "utf8");
      const parsed = JSON.parse(raw) as { howTo?: unknown };
      if (!Array.isArray(parsed.howTo)) continue;
      const steps = parsed.howTo
        .map((step) => (typeof step === "string" ? step.trim() : ""))
        .filter((step) => step.length > 0);
      if (steps.length > 0) return steps;
    } catch {
      continue;
    }
  }

  return [];
};

const buildFallbackHowToSteps = (
  tool: (typeof toolCatalog)[number] | null,
  name: string,
  locale: Locale,
) => {
  const type = tool?.type ?? "calculator";

  if (locale === "en") {
    if (type === "guide") {
      return [
        `Open the ${name} reference page.`,
        "Select the relevant material, standard, or engineering condition.",
        "Compare assumptions, limits, and related calculator links before applying the result.",
      ];
    }

    if (type === "bundle") {
      return [
        `Open the ${name} tool bundle.`,
        "Choose the calculator or workflow that matches the engineering problem.",
        "Enter consistent units, review assumptions, and continue with related checks if needed.",
      ];
    }

    return [
      `Open the ${name} calculator.`,
      "Enter the required input values with consistent engineering units.",
      "Review the calculated result, assumptions, references, and related validation notes.",
    ];
  }

  if (type === "guide") {
    return [
      `${name} referans sayfasini acin.`,
      "Ilgili malzeme, standart veya muhendislik kosulunu secin.",
      "Sonucu uygulamadan once varsayimlari, sinirlari ve ilgili hesaplayici baglantilarini karsilastirin.",
    ];
  }

  if (type === "bundle") {
    return [
      `${name} arac grubunu acin.`,
      "Muhendislik problemine uygun hesaplayiciyi veya is akisini secin.",
      "Birimleri tutarli girin, varsayimlari inceleyin ve gerekirse ilgili kontrollerle devam edin.",
    ];
  }

  return [
    `${name} hesaplayicisini acin.`,
    "Gerekli girdi degerlerini tutarli muhendislik birimleriyle girin.",
    "Hesaplanan sonucu, varsayimlari, referanslari ve dogrulama notlarini inceleyin.",
  ];
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
      ? "Mekanik hesaplama araci. Parametreleri gir, sonucu adim adim gor."
      : "Engineering calculator. Enter parameters and review step-by-step results.");

  const brandName = getBrandCopy(locale).siteName;
  const suffix = locale === "tr" ? "Hesaplayici" : "Calculator";
  const title = `${name} ${suffix} | ${brandName}`;

  const canonical = buildLocalizedCanonical(tool?.href ?? href, locale);
  const alternates = buildLanguageAlternates(tool?.href ?? href);

  const contentHowToSteps = getToolHowToStepsFromContent(normalized, locale);

  return {
    name,
    title,
    description,
    href: tool?.href ?? href,
    canonical,
    alternates,
    featureList: buildFeatureList(normalized, locale),
    howToSteps: contentHowToSteps.length > 0 ? contentHowToSteps : buildFallbackHowToSteps(tool, name, locale),
  };
}

export function buildToolApplicationSchema(toolPath: string, locale: Locale = DEFAULT_LOCALE): WebApplicationSchemaInput {
  const meta = getToolSeo(toolPath, locale);

  return {
    name: meta.name,
    description: meta.description,
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Web",
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    url: meta.canonical,
    featureList: meta.featureList,
  };
}

export function buildToolHowToSchema(toolPath: string, locale: Locale = DEFAULT_LOCALE): HowToSchemaInput | null {
  const meta = getToolSeo(toolPath, locale);
  if (meta.howToSteps.length === 0) return null;

  return {
    name: locale === "tr" ? `${meta.name} kullanım adımları` : `${meta.name} usage steps`,
    description: meta.description,
    url: meta.canonical,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    step: meta.howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step,
      text: step,
      url: meta.canonical,
    })),
  };
}

export function buildToolSchema(toolPath: string, locale: Locale = DEFAULT_LOCALE) {
  const application = buildToolApplicationSchema(toolPath, locale);
  const howTo = buildToolHowToSchema(toolPath, locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        ...application,
      },
      ...(howTo
        ? [
            {
              "@type": "HowTo",
              ...howTo,
            },
          ]
        : []),
    ],
  };
}
