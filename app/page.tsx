import ParticleBackground from "@/components/effects/ParticleBackground";
import WebPageJsonLd from "@/components/seo/WebPageJsonLd";
import UpdatesBanner from "@/components/home/UpdatesBanner";
import AboutSection from "@/sections/home/AboutSection";
import CommentsSection from "@/sections/home/CommentsSection";
import HeroSection from "@/sections/home/HeroSection";
import UseCasesSection from "@/sections/home/UseCasesSection";
import RecentToolsStrip from "@/components/tools/RecentToolsStrip";
import { getLatestChangelogEntry } from "@/utils/changelog";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function Home() {
  const locale = await getLocaleFromCookies();
  const latestChangelog = await getLatestChangelogEntry();
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <WebPageJsonLd />
      <ParticleBackground />
      <HeroSection locale={locale} />
      <div className="px-4 md:px-10 lg:px-16">
        <UpdatesBanner
          latestVersion={latestChangelog?.version}
          latestDate={latestChangelog?.date}
          summary={latestChangelog?.description}
        />
        <RecentToolsStrip tone="dark" className="mx-auto w-full max-w-5xl" />
      </div>
      <AboutSection locale={locale} />
      <UseCasesSection locale={locale} />
      <CommentsSection locale={locale} />
    </main>
  );
}
