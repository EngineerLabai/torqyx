import Client from "./Client";
import { RFQ_COPY } from "./copy";
import { getHeroImageSrc } from "@/lib/assets";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";
import { INDEXING_CONFIG } from "@/config/indexing";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = RFQ_COPY[locale].seo;
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/project-hub/rfq",
    locale,
    useLocalizedCanonical: true,
    robots: INDEXING_CONFIG.indexProjectHub ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default async function RfqPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const heroImage = getHeroImageSrc("projectHub") || getHeroImageSrc("tools");
  return <Client locale={locale} heroImage={heroImage} />;
}

