import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import { getHeroImageSrc } from "@/lib/assets";
import { getContentList } from "@/utils/content";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { formatMessage, getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { buildLocalizedCanonical } from "@/utils/seo";
import { withLocalePrefix } from "@/utils/locale-path";

const formatDate = (value: string, locale: "tr" | "en") =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const termCount = (await getContentList("glossary", { locale })).length;
  const title =
    locale === "tr"
      ? "Mühendislik Sözlüğü - Teknik Terimler ve Tanımlar"
      : "Engineering Glossary - Technical Terms and Definitions";
  const description =
    locale === "tr"
      ? `${termCount} teknik terimi; tork, gerilme, tolerans, malzeme ve akışkanlar için kısa tanımlar ve mühendislik hesaplayıcılarıyla keşfedin.`
      : `Explore ${termCount} technical terms for torque, stress, tolerances, materials, and fluids with concise definitions and engineering calculators.`;

  return buildPageMetadata({
    title: `${title} | ${brandContent.siteName}`,
    description,
    path: "/glossary",
    locale,
  });
}

export default async function GlossaryIndexPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.glossary;
  const heroImage = getHeroImageSrc("glossary");
  const terms = await getContentList("glossary", { locale });
  const glossaryUrl = buildLocalizedCanonical("/glossary", locale);
  const glossaryJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        name: copy.title,
        description: copy.description,
        url: glossaryUrl,
        inLanguage: locale === "tr" ? "tr-TR" : "en-US",
        hasDefinedTerm: terms.slice(0, 50).map((term) => ({
          "@type": "DefinedTerm",
          name: term.title,
          description: term.description,
          url: buildLocalizedCanonical(`/glossary/${term.slug}`, locale),
        })),
      },
      {
        "@type": "CollectionPage",
        name: copy.title,
        description: copy.description,
        url: glossaryUrl,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: terms.length,
          itemListElement: terms.slice(0, 50).map((term, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: term.title,
            url: buildLocalizedCanonical(`/glossary/${term.slug}`, locale),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "tr" ? "Ana sayfa" : "Home",
            item: buildLocalizedCanonical("/", locale),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.badge,
            item: glossaryUrl,
          },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={glossaryJsonLd} />
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Glossary Hero"
      />

      <section className="grid gap-4">
        {terms.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            {copy.empty}
          </div>
        ) : (
          terms.map((term) => (
            <Link
              key={term.slug}
              href={withLocalePrefix(`/glossary/${term.slug}`, locale)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-950">{term.title}</h2>
                  <p className="text-sm text-slate-600">{term.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                  {term.category}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>{formatDate(term.date, locale)}</span>
                <span>|</span>
                <span>{formatMessage(copy.readingTime, { count: term.readingTimeMinutes })}</span>
                {term.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        )}
      </section>
    </PageShell>
  );
}
