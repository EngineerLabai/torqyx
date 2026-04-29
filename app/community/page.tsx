import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import QaBoard from "@/components/community/QaBoard";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).components.qaBoard;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/community",
    locale,
  });
}

export default async function CommunityPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).components.qaBoard;
  const heroImage = getHeroImageSrc("community");

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Community Hero"
      />
      <QaBoard />
    </PageShell>
  );
}
