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
  const guideCount = (await getContentList("guides", { locale })).length;
  const title =
    locale === "tr"
      ? "Mühendislik Rehberleri - Malzeme, Standart ve Üretim"
      : "Engineering Guides - Materials, Standards and Manufacturing";
  const description =
    locale === "tr"
      ? `${guideCount} pratik mühendislik rehberiyle malzeme seçimi, tolerans, akışkanlar ve üretim kararlarını hesaplayıcılarla doğrulayın.`
      : `Validate material selection, tolerances, fluids, and manufacturing decisions with ${guideCount} practical engineering guides and calculators.`;

  return buildPageMetadata({
    title: `${title} | ${brandContent.siteName}`,
    description,
    path: "/guides",
    locale,
  });
}

export default async function GuidesIndexPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.guides;
  const heroImage = getHeroImageSrc("guides");
  const guides = await getContentList("guides", { locale });
  const guidesUrl = buildLocalizedCanonical("/guides", locale);
  const guidesJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: copy.title,
        description: copy.description,
        url: guidesUrl,
        inLanguage: locale === "tr" ? "tr-TR" : "en-US",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: guides.length,
          itemListElement: guides.slice(0, 24).map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guide.title,
            url: buildLocalizedCanonical(`/guides/${guide.slug}`, locale),
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
            item: guidesUrl,
          },
        ],
      },
    ],
  };
  const grouped = guides.reduce<Record<string, typeof guides>>((acc, guide) => {
    const key = guide.category || copy.fallbackCategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(guide);
    return acc;
  }, {});
  const categories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, locale === "en" ? "en-US" : "tr-TR"),
  );

  return (
    <PageShell>
      <JsonLd data={guidesJsonLd} />
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Guides Hero"
      />

      <section className="space-y-8">
        {guides.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            {copy.empty}
          </div>
        ) : (
          categories.map((category) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {category}
                </span>
                <span className="text-xs text-slate-400">
                  {formatMessage(copy.countLabel, { count: grouped[category].length })}
                </span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {grouped[category].map((guide) => (
                  <Link
                    key={guide.slug}
                    href={withLocalePrefix(`/guides/${guide.slug}`, locale)}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <h2 className="text-lg font-semibold text-slate-900 group-hover:text-slate-950">{guide.title}</h2>
                      <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">{guide.description}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>{formatDate(guide.date, locale)}</span>
                      <span>|</span>
                      <span>{formatMessage(copy.readingTime, { count: guide.readingTimeMinutes })}</span>
                      {guide.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </PageShell>
  );
}
