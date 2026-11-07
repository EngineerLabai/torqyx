import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import MaterialsLibraryClientLazy from "@/components/materials/MaterialsLibraryClientLazy";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { materials } from "@/src/data/materials";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";
import { INDEXING_CONFIG } from "@/config/indexing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getMessages(locale).pages.materials;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/materials",
    locale,
    useLocalizedCanonical: true,
      robots: INDEXING_CONFIG.indexMaterialsList ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default async function MaterialsLibraryPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getMessages(locale).pages.materials;
  const heroImage = getHeroImageSrc("tools");

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt={copy.imageAlt}
      />

      <MaterialsLibraryClientLazy materials={materials} locale={locale} />
    </PageShell>
  );
}

