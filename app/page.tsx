import WebPageJsonLd from "@/components/seo/WebPageJsonLd";
import HeroSection from "@/sections/home/HeroSection";
import PopularToolsSection from "@/sections/home/PopularToolsSection";
import PricingTeaserSection from "@/sections/home/PricingTeaserSection";
import TrustSection from "@/sections/home/TrustSection";
import ValuePropsSection from "@/sections/home/ValuePropsSection";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).home.seo;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/",
    locale,
    openGraph: {
      siteName: brandContent.siteName,
    },
  });
}

export default async function Home() {
  const locale = await getLocaleFromCookies();
  return (
    <main className="relative min-h-screen">
      <WebPageJsonLd />
      <HeroSection locale={locale} />
      <ValuePropsSection locale={locale} />
      <PopularToolsSection locale={locale} />
      <PricingTeaserSection locale={locale} />
      <TrustSection locale={locale} />
    </main>
  );
}
