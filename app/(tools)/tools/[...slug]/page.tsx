import Link from "next/link";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import ReportPageShell from "@/components/tools/ReportPageShell";
import ToolTrustPanel from "@/components/tools/ToolTrustPanel";
import ReportActions from "@/components/tools/report/ReportActions";
import { getBrandCopy } from "@/config/brand";
import { getToolGuideBySlug } from "@/lib/tool-guides";
import EngineeringDiagram, {
  type BoltDiagramParams,
  type GearDiagramParams,
  type PipeDiagramParams,
} from "@/src/components/visuals/EngineeringDiagram";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { decodeToolState } from "@/utils/tool-share";
import { resolveLocalizedValue } from "@/utils/locale-values";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildPageMetadata } from "@/utils/metadata";
import { buildCanonical, buildLanguageAlternates, buildLocalizedCanonical, CANONICAL_SITE_URL, SITE_URL } from "@/utils/seo";
import { toolRegistry, type ToolChartConfig } from "@/tools/registry";
import { toolCatalog, getToolCopy } from "@/tools/_shared/catalog";
import { getToolPageTool } from "@/tools/tool-page-tools";
import { getReportTool } from "@/tools/report-tools";
import type { ToolReference } from "@/tools/_shared/types";

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

type ReportRow = { label: string; value: string };
type ReportDiagram =
  | { type: "bolt"; params: BoltDiagramParams }
  | { type: "pipe"; params: PipeDiagramParams }
  | { type: "gear"; params: GearDiagramParams };

type ReportData = {
  title: string;
  description?: string;
  inputs: ReportRow[];
  results: ReportRow[];
  formula?: string;
  assumptions?: string[];
  references?: ToolReference[];
  chartConfig?: ToolChartConfig | null;
  toolHref: string;
  diagram?: ReportDiagram;
};

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const ReportChart = dynamic(() => import("@/components/tools/report/ReportChart"), {
  loading: () => <div className="h-64 w-full rounded-lg border border-slate-200 bg-slate-50" />,
});

const getParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value ?? "");
const normalizePathToken = (value: string) => value.replace(/[-_/]+/g, " ").trim();
const toTitleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

type GuideCopy = {
  badge: string;
  backToTool: string;
  tocTitle: string;
  tocEmpty: string;
  standardsTitle: string;
  relatedTitle: string;
  relatedDescription: string;
  openTool: string;
  openGuide: string;
  breadcrumbHome: string;
  breadcrumbTools: string;
  readGuide: string;
};

const getGuideCopy = (locale: "tr" | "en"): GuideCopy => {
  if (locale === "en") {
    return {
      badge: "Tool Guide",
      backToTool: "Back to tool",
      tocTitle: "Contents",
      tocEmpty: "No heading detected yet.",
      standardsTitle: "Relevant Standards",
      relatedTitle: "Related Tools",
      relatedDescription: "Automatic suggestions based on slug, category, and shared tags.",
      openTool: "Open tool",
      openGuide: "How to use",
      breadcrumbHome: "Home",
      breadcrumbTools: "Tools",
      readGuide: "Guide",
    };
  }

  return {
    badge: "Arac Rehberi",
    backToTool: "Araca don",
    tocTitle: "Icindekiler",
    tocEmpty: "Henuz baslik bulunmuyor.",
    standardsTitle: "Ilgili Standartlar",
    relatedTitle: "Ilgili Araclar",
    relatedDescription: "Slug, kategori ve ortak etiketlere gore otomatik oneriler.",
    openTool: "Araci ac",
    openGuide: "Nasil kullanilir",
    breadcrumbHome: "Ana sayfa",
    breadcrumbTools: "Araclar",
    readGuide: "Rehber",
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { slug } = await params;
  const slugParts = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const normalizedSlug = slugParts.filter(Boolean).join("/");
  const path = normalizedSlug ? `/tools/${normalizedSlug}` : "/tools";
  const isReportRoute = slugParts.at(-1) === "report";
  const isGuideRoute = slugParts.at(-1) === "guide";
  const toolSlug = isReportRoute || isGuideRoute ? slugParts.slice(0, -1).join("/") : normalizedSlug;

  if (isGuideRoute && toolSlug) {
    const guide = await getToolGuideBySlug({ slug: toolSlug, locale });
    if (!guide) {
      return buildPageMetadata({
        title: locale === "tr" ? "Rehber bulunamadi" : "Guide not found",
        description:
          locale === "tr"
            ? "Istenen arac rehberi bulunamadi."
            : "The requested tool guide could not be found.",
        path,
        locale,
        type: "article",
      });
    }

    return buildPageMetadata({
      title: guide.title,
      description: guide.description,
      path,
      locale,
      type: "article",
      keywords: [...(guide.tool.tags ?? []), "guide", "how-to"],
      alternatesLanguages: buildLanguageAlternates(`/tools/${guide.slug}/guide`),
      openGraph: {
        type: "article",
        publishedTime: guide.datePublished,
        modifiedTime: guide.dateModified,
        tags: guide.tool.tags ?? [],
      },
    });
  }

  const toolPath = toolSlug ? `/tools/${toolSlug}` : "/tools";
  const tool =
    toolCatalog.find((item) => item.id === toolSlug) ??
    toolCatalog.find((item) => item.href === toolPath) ??
    toolCatalog.find((item) => item.href.replace(/^\/+|\/+$/g, "") === toolSlug) ??
    null;
  const toolTitle = tool ? getToolCopy(tool, locale).title : toTitleCase(normalizePathToken(toolSlug || "tool report"));
  const title = isReportRoute
    ? locale === "tr"
      ? `${toolTitle} Raporu`
      : `${toolTitle} Report`
    : toolTitle;
  const description = isReportRoute
    ? locale === "tr"
      ? `${toolTitle} sonucunu teknik olarak incelemek, paylaşmak ve doğrulamak için hazırlanan mühendislik hesaplayıcıları rapor sayfası.`
      : `${toolTitle} report page for engineering calculators output, designed for technical validation, collaboration, and structured result sharing.`
    : locale === "tr"
      ? `${toolTitle} için mühendislik hesaplayıcıları içeriğini, girdileri ve sonuç yorumlarını teknik açıklamalarla sunan araç sayfası.`
      : `${toolTitle} tool page for engineering calculators, presenting inputs, outputs, and technical interpretation guidance in one workflow.`;

  const canonicalUrl = buildCanonical(path) ?? `${CANONICAL_SITE_URL}${path}`;

  return buildPageMetadata({
    title,
    description,
    path,
    locale,
    openGraph: {
      title: `${toolTitle} | TORQYX`,
      description,
      url: canonicalUrl,
    },
    twitter: {
      title: `${toolTitle} | TORQYX`,
      description,
    },
  });
}

export default async function ToolReportRoute({ params, searchParams }: PageProps) {
  const locale = await getLocaleFromCookies();
  const messages = getMessages(locale);
  const copy = messages.components.toolReport;
  const common = messages.common;
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const slugParts = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const isReportRoute = slugParts.at(-1) === "report";
  const isGuideRoute = slugParts.at(-1) === "guide";
  const toolSlug = isReportRoute || isGuideRoute ? slugParts.slice(0, -1).join("/") : "";

  if (isGuideRoute && toolSlug) {
    const guide = await getToolGuideBySlug({ slug: toolSlug, locale });
    if (!guide) {
      return (
        <PageShell>
          <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
            {copy.missing}
          </section>
        </PageShell>
      );
    }

    const guideCopy = getGuideCopy(locale);
    const canonical = buildLocalizedCanonical(`/tools/${guide.slug}/guide`, locale);
    const toolHref = withLocalePrefix(guide.tool.href, locale);
    const listHref = withLocalePrefix("/tools", locale);
    const brand = getBrandCopy(locale);
    const logoUrl = new URL("/images/logo.png", SITE_URL).toString();

    const articleJsonLd = {
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: guide.datePublished,
      dateModified: guide.dateModified,
      inLanguage: locale === "tr" ? "tr-TR" : "en-US",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
      author: {
        "@type": "Organization",
        name: brand.siteName,
      },
      publisher: {
        "@type": "Organization",
        name: brand.siteName,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
      image: [logoUrl],
    };

    const breadcrumbJsonLd = {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: guideCopy.breadcrumbHome,
          item: buildLocalizedCanonical("/", locale),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: guideCopy.breadcrumbTools,
          item: buildLocalizedCanonical("/tools", locale),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: guide.tool.title,
          item: buildLocalizedCanonical(guide.tool.href, locale),
        },
        {
          "@type": "ListItem",
          position: 4,
          name: guideCopy.readGuide,
          item: canonical,
        },
      ],
    };

    return (
      <PageShell>
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [articleJsonLd, breadcrumbJsonLd] }} />
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <Link href={toolHref} className="text-xs font-semibold text-sky-700 hover:underline">
              {guideCopy.backToTool}
            </Link>
            <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
              {guideCopy.badge}
            </span>
            <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              {guide.title}
            </h1>
            <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{guide.description}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-8 mdx-content">
              <section className="space-y-4">
                <MDXRenderer source={guide.content} locale={locale} />
              </section>

              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-semibold text-slate-900">{guideCopy.standardsTitle}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {guide.standards.map((standard) => (
                    <span
                      key={standard}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {standard}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{guideCopy.relatedTitle}</h2>
                <p className="mt-1 text-sm text-slate-600">{guideCopy.relatedDescription}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {guide.relatedTools.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          href={withLocalePrefix(item.href, locale)}
                          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {guideCopy.openTool}
                        </Link>
                        <Link
                          href={withLocalePrefix(item.guideHref, locale)}
                          className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                        >
                          {guideCopy.openGuide}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm lg:sticky lg:top-24">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {guideCopy.tocTitle}
                </div>
                {guide.toc.length === 0 ? (
                  <p className="text-xs text-slate-500">{guideCopy.tocEmpty}</p>
                ) : (
                  <ul className="space-y-2 text-xs text-slate-600">
                    {guide.toc.map((item) => (
                      <li
                        key={item.id}
                        className={item.level === 3 ? "pl-4" : item.level === 4 ? "pl-7" : "pl-0"}
                      >
                        <a href={`#${item.id}`} className="hover:text-sky-700">
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 border-t border-slate-200 pt-3">
                  <Link href={listHref} className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                    {guideCopy.breadcrumbTools}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </PageShell>
    );
  }

  const shared = decodeToolState<Record<string, string | number>>(getParam(resolvedSearchParams.input) || null);
  const reportData = isReportRoute && toolSlug ? buildReportData(toolSlug, shared ?? {}, locale, common) : null;

  if (!reportData) {
    return (
      <PageShell>
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          {copy.missing}
        </section>
      </PageShell>
    );
  }

  const today = new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", DATE_FORMAT);
  const pdfTitle = `${reportData.title} - ${copy.title}`;
  const diagramTitle = locale === "tr" ? "Teknik Diyagram" : "Engineering Diagram";

  return (
    <PageShell className="report-page">
      <ReportPageShell>
        <section id="report-area" className="space-y-4">
          <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">{copy.title}</p>
                <h1 className="text-lg font-semibold text-slate-900">{reportData.title}</h1>
                {reportData.description ? (
                  <p className="text-xs text-slate-600">{reportData.description}</p>
                ) : null}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-[11px] text-slate-500">
                <span className="block font-semibold text-slate-700">{copy.dateLabel}</span>
                <span className="block">{today}</span>
              </div>
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.inputs}</h2>
              <div className="space-y-2">
                {reportData.inputs.map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-[11px] text-slate-600">{row.label}</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.results}</h2>
              {reportData.results.length > 0 ? (
                <div className="space-y-2">
                  {reportData.results.map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                      <span className="text-[11px] text-slate-600">{row.label}</span>
                      <span className="font-mono text-[11px] font-semibold text-slate-900">{row.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">{copy.missing}</p>
              )}
            </div>
          </section>

          {reportData.diagram ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
              <h2 className="mb-2 text-sm font-semibold text-slate-900">{diagramTitle}</h2>
              <EngineeringDiagram
                type={reportData.diagram.type}
                params={reportData.diagram.params}
                locale={locale}
                className="h-auto w-full"
              />
            </section>
          ) : null}

          {reportData.chartConfig ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
              <h2 className="mb-2 text-sm font-semibold text-slate-900">{messages.components.genericToolPage.chart}</h2>
              <ReportChart config={reportData.chartConfig} />
            </section>
          ) : null}

          <ToolTrustPanel
            formula={reportData.formula}
            assumptions={reportData.assumptions}
            references={reportData.references}
          />

          <ReportActions
            printLabel={copy.print}
            downloadPdfLabel={copy.downloadPdf}
            backLabel={copy.back}
            toolHref={reportData.toolHref}
            pdfTitle={pdfTitle}
          />
        </section>
      </ReportPageShell>
    </PageShell>
  );
}

function buildReportData(
  slug: string,
  shared: Record<string, string | number>,
  locale: "tr" | "en",
  common: { yes: string; no: string },
): ReportData | null {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  if (!normalized) return null;

  const toolPath = `/tools/${normalized}`;
  const catalogItem = toolCatalog.find((tool) => tool.href === toolPath || tool.id === normalized) ?? null;
  const catalogCopy = catalogItem ? getToolCopy(catalogItem, locale) : null;
  const localizedToolHref = withLocalePrefix(catalogItem?.href ?? toolPath, locale);

  const genericTool = toolRegistry.find((tool) => tool.id === normalized) ?? null;
  if (genericTool) {
    const defaults = genericTool.inputs.reduce<Record<string, string | number>>((acc, input) => {
      acc[input.key] = input.default;
      return acc;
    }, {});
    const merged = mergeSharedValues(defaults, shared);

    const inputs = genericTool.inputs.map((input) => {
      const raw = merged[input.key];
      const label = input.unit ? `${input.label} (${input.unit})` : input.label;
      const value = formatValue(raw, locale, common, input.unit);
      return { label, value };
    });

    const calcInputs = genericTool.inputs.reduce<Record<string, unknown>>((acc, input) => {
      const raw = merged[input.key];
      if (input.type === "select") {
        acc[input.key] = raw;
      } else {
        const fallback = Number(input.default);
        const num = Number(raw);
        acc[input.key] = Number.isFinite(num) ? num : fallback;
      }
      return acc;
    }, {});

    const results = safeCalculate(() => genericTool.calculate(calcInputs as never));
    const resultRows = buildResultRows(results, locale, common);
    const chartConfig = genericTool.chartConfig
      ? safeCalculate(() => genericTool.chartConfig?.(results as never, calcInputs as never))
      : null;

    return {
      title: catalogCopy?.title ?? genericTool.title,
      description: catalogCopy?.description ?? genericTool.description,
      inputs,
      results: resultRows,
      formula: resolveLocalizedValue(genericTool.formula, locale) ?? genericTool.formulaDisplay,
      assumptions: resolveLocalizedValue(genericTool.assumptions, locale),
      references: resolveLocalizedValue(genericTool.references, locale),
      chartConfig: chartConfig ?? null,
      toolHref: localizedToolHref,
    };
  }

  const pageTool = getToolPageTool(normalized);
  if (pageTool) {
    const initial = pageTool.initialInput as Record<string, unknown>;
    const merged = mergeSharedValues(initial, shared);
    const inputs = pageTool.inputMeta
      ? pageTool.inputMeta.map((meta) => {
          const raw = merged[meta.key];
          const label = meta.unit ? `${meta.label} (${meta.unit})` : meta.label;
          return { label, value: formatValue(raw, locale, common, meta.unit) };
        })
      : Object.entries(merged).map(([key, value]) => ({
          label: formatKey(key),
          value: formatValue(value, locale, common),
        }));

    const results = safeCalculate(() => pageTool.calculate(merged as never));
    const resultRows = buildResultRows(results, locale, common);
    const diagram = buildDiagramConfig(normalized, merged);

    return {
      title: catalogCopy?.title ?? pageTool.title,
      description: catalogCopy?.description ?? pageTool.description,
      inputs,
      results: resultRows,
      formula: resolveLocalizedValue(pageTool.formula, locale),
      assumptions: resolveLocalizedValue(pageTool.assumptions, locale),
      references: resolveLocalizedValue(pageTool.references, locale),
      diagram,
      toolHref: localizedToolHref,
    };
  }

  const reportTool = getReportTool(normalized);
  if (reportTool) {
    const defaults = reportTool.inputs.reduce<Record<string, string>>((acc, input) => {
      acc[input.key] = input.default;
      return acc;
    }, {});
    const merged = mergeSharedValues(defaults, shared, true);

    const inputs = reportTool.inputs.map((input) => {
      const label = resolveLocalizedValue(input.label, locale) ?? input.key;
      const value = formatValue(merged[input.key], locale, common, input.unit);
      return { label: input.unit ? `${label} (${input.unit})` : label, value };
    });

    const results = safeCalculate(() => reportTool.calculate(merged));
    const resultRows = buildResultRows(results, locale, common);

    return {
      title: resolveLocalizedValue(reportTool.title, locale) ?? catalogCopy?.title ?? normalized,
      description: resolveLocalizedValue(reportTool.description, locale) ?? catalogCopy?.description,
      inputs,
      results: resultRows,
      formula: resolveLocalizedValue(reportTool.formula, locale),
      assumptions: resolveLocalizedValue(reportTool.assumptions, locale),
      references: resolveLocalizedValue(reportTool.references, locale),
      toolHref: localizedToolHref,
    };
  }

  return null;
}

function buildDiagramConfig(toolId: string, inputs: Record<string, unknown>): ReportDiagram | undefined {
  const toNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  if (toolId === "bolt-calculator") {
    return {
      type: "bolt",
      params: {
        diameter: toNumber(inputs.d) ?? undefined,
        pitch: toNumber(inputs.P) ?? undefined,
        showGrid: true,
      },
    };
  }

  if (toolId === "pipe-pressure-loss") {
    return {
      type: "pipe",
      params: {
        diameter: toNumber(inputs.diameter) ?? undefined,
        length: toNumber(inputs.length) ?? undefined,
        flow: toNumber(inputs.flow) ?? undefined,
        showGrid: true,
      },
    };
  }

  return undefined;
}

function mergeSharedValues<T extends Record<string, unknown>>(
  base: T,
  shared: Record<string, string | number>,
  forceString = false,
) {
  const next = { ...base } as Record<string, unknown>;
  Object.entries(shared).forEach(([key, value]) => {
    if (key in next) {
      next[key] = forceString ? String(value) : value;
    }
  });
  return next as T;
}

function buildResultRows(results: unknown, locale: "tr" | "en", common: { yes: string; no: string }) {
  if (!results || typeof results !== "object") return [] as ReportRow[];
  return Object.entries(results)
    .filter(([, value]) => isPrimitive(value))
    .map(([key, value]) => ({ label: formatKey(key), value: formatValue(value, locale, common) }));
}

function safeCalculate<T>(fn: () => T) {
  try {
    return fn();
  } catch {
    return null;
  }
}

function isPrimitive(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function formatKey(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value: unknown, locale: "tr" | "en", common: { yes: string; no: string }, unit?: string) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? common.yes : common.no;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "-";
    return `${formatNumber(value, locale)}${unit ? ` ${unit}` : ""}`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return "-";
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return `${formatNumber(parsed, locale)}${unit ? ` ${unit}` : ""}`;
    }
    return `${value}${unit ? ` ${unit}` : ""}`;
  }

  return String(value);
}

function formatNumber(value: number, locale: "tr" | "en") {
  return value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
    maximumFractionDigits: 4,
  });
}
