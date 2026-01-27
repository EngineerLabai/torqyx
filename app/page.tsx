import ParticleBackground from "@/components/effects/ParticleBackground";
import WebPageJsonLd from "@/components/seo/WebPageJsonLd";
import AboutSection from "@/sections/home/AboutSection";
import CommentsSection from "@/sections/home/CommentsSection";
import HeroSection from "@/sections/home/HeroSection";
import HomeNavigation from "@/sections/home/HomeNavigation";
import UseCasesSection from "@/sections/home/UseCasesSection";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function Home() {
  const locale = await getLocaleFromCookies();
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <WebPageJsonLd />
      <ParticleBackground />
      <HomeNavigation />
      <HeroSection locale={locale} />
      <AboutSection locale={locale} />
      <UseCasesSection locale={locale} />
      <CommentsSection locale={locale} />
    </main>
  );
}
