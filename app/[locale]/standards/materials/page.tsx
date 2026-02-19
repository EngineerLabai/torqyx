import Client from "./Client";
import { getHeroImageSrc } from "@/lib/assets";
import { buildPageMetadata } from "@/utils/metadata";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

const SEO_COPY: Record<Locale, { title: string; description: string }> = {
  tr: {
    title: "Malzemeler | Standartlar",
    description: "Pratik malzeme tablosu, arama, karşılaştırma ve tipik mühendislik özellikleri.",
  },
  en: {
    title: "Materials | Standards",
    description: "Practical material table with search, compare, and typical engineering properties.",
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = SEO_COPY[locale];
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/standards/materials",
    locale,
  });
}

export default async function MaterialsStandardsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const heroImage = getHeroImageSrc("tools");
  return <Client locale={locale} heroImage={heroImage} />;
}
