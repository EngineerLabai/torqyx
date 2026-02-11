import Client from "./Client";
import { REVISION_COPY } from "./copy";
import { getHeroImageSrc } from "@/lib/assets";
import { buildPageMetadata } from "@/utils/metadata";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";

type PageProps = {
  params: { locale: string };
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

export async function generateMetadata({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const seo = REVISION_COPY[locale].seo;
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/project-hub/part-tracking",
    locale,
  });
}

export default function PartTrackingPage({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const heroImage = getHeroImageSrc("projectHub") || getHeroImageSrc("tools");
  return <Client locale={locale} heroImage={heroImage} />;
}
