import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import ReferenceCenter from "@/components/reference/ReferenceCenter";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.reference;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/reference",
    locale,
  });
}

export default async function ReferencePage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.reference;
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

      <ReferenceCenter />
    </PageShell>
  );
}
