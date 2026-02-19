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
    title: "Metrik Dişler | Standartlar",
    description:
      "Coarse/fine özet, tap drill mini aracı, clearance tablosu ve thread engagement rehberi.",
  },
  en: {
    title: "Metric Threads | Standards",
    description:
      "Coarse/fine notes, tap drill mini tool, practical clearance table, and engagement guidance.",
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = SEO_COPY[locale];
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/standards/threads",
    locale,
  });
}

export default async function ThreadsStandardsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const heroImage = getHeroImageSrc("tools");
  return <Client locale={locale} heroImage={heroImage} />;
}
