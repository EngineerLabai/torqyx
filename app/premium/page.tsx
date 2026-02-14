import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import PremiumCTA from "@/components/premium/PremiumCTA";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).pages.premium;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/premium",
    locale,
  });
}

export default async function PremiumPage() {
  const locale = await getLocaleFromCookies();
  const messages = getMessages(locale);
  const copy = messages.pages.premium;
  const heroImage = getHeroImageSrc("premium");

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt={copy.imageAlt}
      />
      <PremiumCTA variant="full" copy={messages.components.premiumCTA} />
    </PageShell>
  );
}
