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
    title: "Geçmeler | Standartlar",
    description: "Geçme seçim rehberi, boşluk/sıkılık hesaplayıcı ve pratik örnek sapma tablosu.",
  },
  en: {
    title: "Fits | Standards",
    description: "Fit selection guide, clearance/interference calculator, and practical example deviations.",
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = SEO_COPY[locale];
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/standards/fits",
    locale,
    useLocalizedCanonical: true,
  });
}

export default async function FitsStandardsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const heroImage = getHeroImageSrc("tools");
  return <Client locale={locale} heroImage={heroImage} />;
}

