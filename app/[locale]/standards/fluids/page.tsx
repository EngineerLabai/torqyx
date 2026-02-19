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
    title: "Akışkanlar | Standartlar",
    description: "Reynolds, sürtünme katsayısı, Darcy basınç düşümü ve pompa gücü mini araçları.",
  },
  en: {
    title: "Fluids | Standards",
    description: "Mini tools for Reynolds, friction factor, Darcy pressure drop, and pump power.",
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = SEO_COPY[locale];
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/standards/fluids",
    locale,
  });
}

export default async function FluidsStandardsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const heroImage = getHeroImageSrc("tools");
  return <Client locale={locale} heroImage={heroImage} />;
}
