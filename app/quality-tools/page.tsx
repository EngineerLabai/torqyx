import Link from "next/link";
import Hero from "@/components/Hero";
import { QualityToolStatusBadge } from "@/components/quality-tools/QualityToolStatusBadge";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import {
  getQualityToolsRegistry,
  getQualityToolStatusLabel,
  isQualityToolStatusActive,
  type QualityToolLevel,
} from "@/data/quality-tools/registry";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

type QualityToolsPageProps = {
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
};

type QualityToolsTab = "active" | "planned";

const getParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

const resolveTab = (value?: string): QualityToolsTab => {
  if (value === "planned") return "planned";
  return "active";
};

const buildTabHref = (basePath: string, tab: QualityToolsTab) =>
  tab === "active" ? basePath : `${basePath}?tab=planned`;

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.qualityTools;
  const brandContent = getBrandCopy(locale);
  const title = locale === "tr" ? "Kalite ve Doğrulama Süreci" : copy.badge;
  const description =
    locale === "tr"
      ? "Hesaplayıcılarımız nasıl doğrulanır? Standart referanslar, test süreçleri ve kalite güvencesi hakkında bilgi al."
      : copy.description;

  return buildPageMetadata({
    title,
    description,
    path: "/quality-tools",
    locale,
    openGraph: {
      siteName: brandContent.siteName,
    },
  });
}

export default async function QualityToolsPage({ searchParams }: QualityToolsPageProps) {
  const locale = await getLocaleFromCookies();
  const tools = getQualityToolsRegistry(locale);
  const copy = getMessages(locale).pages.qualityTools;
  const heroImage = getHeroImageSrc("qualityTools");
  const basePath = withLocalePrefix("/quality-tools", locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const tab = resolveTab(getParam(resolvedSearchParams.tab));
  const activeTools = tools.filter((tool) => isQualityToolStatusActive(tool.status));
  const plannedTools = tools.filter((tool) => tool.status === "planned");
  const visibleTools = tab === "planned" ? plannedTools : activeTools;

  const tabBase = "rounded-full border px-3 py-1 text-[11px] font-semibold transition md:text-xs";
  const tabActive = "border-slate-900 bg-slate-900 text-white";
  const tabInactive = "border-slate-200 bg-white text-slate-600 hover:border-slate-300";
  const activeTabLabel = locale === "tr" ? "Kullanıma Açık" : "Available Now";
  const plannedTabLabel = getQualityToolStatusLabel(locale, "planned");
  const footerActiveLabel = locale === "tr" ? "Araç kullanıma açık." : "Tool is available now.";
  const footerPlannedLabel = locale === "tr" ? "Bu araç yakında yayınlanacak." : "This tool will be released soon.";
  const emptyLabel =
    locale === "tr"
      ? "Bu görünümde listelenecek araç bulunmuyor."
      : "There are no tools to list in this view.";

  return (
    <PageShell>
      <Hero
        title={copy.title}
        subtitle={copy.description}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Quality Tools Hero"
      />

      <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] text-sky-700 md:text-xs">
            <span className="font-semibold">{copy.badge}</span>
          </div>

          <div className="inline-flex items-center gap-2">
            <Link
              href={buildTabHref(basePath, "active")}
              className={`${tabBase} ${tab === "active" ? tabActive : tabInactive}`}
            >
              {activeTabLabel} ({activeTools.length})
            </Link>
            <Link
              href={buildTabHref(basePath, "planned")}
              className={`${tabBase} ${tab === "planned" ? tabActive : tabInactive}`}
            >
              {plannedTabLabel} ({plannedTools.length})
            </Link>
          </div>
        </div>
      </section>

      <section className="grid w-full min-w-0 gap-4 md:grid-cols-2">
        {visibleTools.length === 0 && (
          <article className="rounded-3xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-sm md:col-span-2">
            {emptyLabel}
          </article>
        )}

        {visibleTools.map((tool) => {
          const canOpenTool = Boolean(tool.href && isQualityToolStatusActive(tool.status));
          const buttonLabel = canOpenTool ? copy.openTool : getQualityToolStatusLabel(locale, tool.status);
          const href = tool.href ? withLocalePrefix(tool.href, locale) : undefined;

          return (
            <article
              key={tool.id}
              className="flex h-full min-w-0 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 text-xs shadow-sm hover:border-slate-300 hover:shadow-md"
            >
              <div className="space-y-2">
                <header className="flex min-w-0 items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="inline-flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                        {tool.label}
                      </span>
                      <h3 className="text-sm font-semibold leading-snug text-slate-900 break-words">{tool.title}</h3>
                    </div>
                    <QualityToolStatusBadge locale={locale} status={tool.status} />
                  </div>
                </header>

                <p className="text-[11px] leading-relaxed text-slate-700 break-words">{tool.description}</p>

                <div>
                  <p className="mb-1 text-[11px] font-semibold text-slate-800">{copy.typical}</p>
                  <ul className="list-inside list-disc space-y-1 text-[11px] text-slate-700">
                    {tool.useCases.slice(0, 2).map((u) => (
                      <li key={u} className="break-words">
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  <LevelBadge level={tool.level} basicLabel={copy.basic} advancedLabel={copy.advanced} />
                </div>
              </div>

              <footer className="mt-3 flex min-w-0 items-center justify-between gap-2 text-[11px] text-slate-500">
                <span className="min-w-0 break-words">{canOpenTool ? footerActiveLabel : footerPlannedLabel}</span>

                {canOpenTool && href ? (
                  <Link
                    href={href}
                    className="shrink-0 rounded-full bg-sky-600 px-3 py-1 text-[10px] font-semibold text-white hover:bg-sky-500"
                  >
                    {buttonLabel}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="shrink-0 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-500"
                  >
                    {buttonLabel}
                  </button>
                )}
              </footer>
            </article>
          );
        })}
      </section>
    </PageShell>
  );
}

function LevelBadge({
  level,
  basicLabel,
  advancedLabel,
}: {
  level: QualityToolLevel;
  basicLabel: string;
  advancedLabel: string;
}) {
  if (level === "basic") {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
        {basicLabel}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
      {advancedLabel}
    </span>
  );
}
