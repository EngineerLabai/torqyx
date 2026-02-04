import WebPageJsonLd from "@/components/seo/WebPageJsonLd";
import ChangelogSection from "@/sections/home/ChangelogSection";
import HeroSection from "@/sections/home/HeroSection";
import UseCasesSection from "@/sections/home/UseCasesSection";
import PopularToolsSection from "@/sections/home/PopularToolsSection";
import { getBrandCopy } from "@/config/brand";
import { getLatestChangelogEntry } from "@/utils/changelog";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: brandContent.siteName,
    description: brandContent.description,
    path: "/",
    locale,
    openGraph: {
      siteName: brandContent.siteName,
    },
  });
}

export default async function Home() {
  const locale = await getLocaleFromCookies();
  const latestChangelog = await getLatestChangelogEntry();
  return (
    <main className="relative min-h-screen">
      <WebPageJsonLd />
      <HeroSection locale={locale} />
      <PopularToolsSection locale={locale} />
      <UseCasesSection locale={locale} />
      <ChangelogSection locale={locale} latest={latestChangelog} />
    </main>
  );
}
