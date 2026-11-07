import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ActionCard from "@/components/ui/ActionCard";
import JsonLd from "@/components/seo/JsonLd";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { CANONICAL_SITE_URL } from "@/utils/seo";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import {
  getCategoryBySlug,
  type CategorySlug,
} from "@/data/tool-categories";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

type CategoryPageShellProps = {
  categorySlug: CategorySlug;
};

export default async function CategoryPageShell({ categorySlug }: CategoryPageShellProps) {
  const locale = await getLocaleFromCookies();
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const title = category.title[locale];
  const intro = category.introHtml[locale];
  const tools = category.toolIds
    .map((id) => toolCatalog.find((tool) => tool.id === id))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  const homeHref = withLocalePrefix("/", locale);
  const toolsHref = withLocalePrefix("/tools", locale);
  const homeLabel = locale === "tr" ? "Ana Sayfa" : "Home";
  const toolsLabel = locale === "tr" ? "Hesaplayıcılar" : "Calculators";
  const categoryUrl = `${CANONICAL_SITE_URL}/${locale}/tools/${category.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: `${CANONICAL_SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: toolsLabel,
        item: `${CANONICAL_SITE_URL}/${locale}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: categoryUrl,
      },
    ],
  };

  const toolsHeading = locale === "tr" ? "Kategorideki Hesaplayıcılar" : "Calculators in this Category";
  const toolsDescription =
    locale === "tr"
      ? `${title} alanında kullanabileceğiniz doğrulanmış mühendislik araçları.`
      : `Verified engineering calculators available in ${title}.`;
  const openLabel = locale === "tr" ? "Hesaplayıcıyı Aç" : "Open Calculator";

  return (
    <PageShell>
      <JsonLd id={`category-${category.slug}-breadcrumb`} data={breadcrumbJsonLd} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link href={homeHref} className="transition-colors hover:text-slate-900">
          {homeLabel}
        </Link>
        <ChevronRight size={12} className="text-slate-400" />
        <Link href={toolsHref} className="transition-colors hover:text-slate-900">
          {toolsLabel}
        </Link>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="font-semibold text-slate-900" aria-current="page">
          {title}
        </span>
      </nav>

      {/* Category Hero & Intro (300+ Words Original Technical Text) */}
      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <header className="space-y-3 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            {intro.eyebrow}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {intro.heading}
          </h1>
          <p className="text-sm leading-relaxed text-slate-700 md:text-base">
            {intro.lead}
          </p>
        </header>

        {/* Technical Deep Dive Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {intro.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition-colors hover:border-slate-200"
            >
              <h2 className="text-base font-semibold text-slate-900">
                {section.title}
              </h2>
              <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                {section.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* Tools List in this Category */}
      <section className="mt-8 space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">{toolsHeading}</h2>
          <p className="text-sm text-slate-600">{toolsDescription}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const toolCopy = getToolCopy(tool, locale);
            return (
              <ActionCard
                key={tool.id}
                title={toolCopy.title}
                description={toolCopy.description}
                href={withLocalePrefix(tool.href, locale)}
                toolId={tool.id}
                ctaLabel={openLabel}
              />
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
