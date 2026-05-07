import { ShieldCheck, Star, Users } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import AuthModalTrigger from "@/components/auth/AuthModalTrigger";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";

type HeroSectionProps = {
  locale: Locale;
};

export default function HeroSection({ locale }: HeroSectionProps) {
  const brandContent = getBrandCopy(locale);
  const messages = getMessages(locale);
  const copy = messages.home.hero;
  const heroImage = "/images/home-hero.webp";

  return (
    <section id="home" className="w-full pb-10 pt-14 md:pt-20">
      <div className="site-container">
        <PageHero
          title={copy.headline}
          description={copy.subheadline}
          subtitle={copy.subtitle}
          eyebrow={copy.eyebrow ?? brandContent.siteName}
          imageSrc={heroImage}
          imageAlt="Torqyx Engineering - Home Hero"
          priority
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <AuthModalTrigger
                label={copy.ctaPrimary}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600"
              />
              <a
                href="#calculator-showcase"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                {copy.ctaSecondary}
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} className="text-gray-500" />
                <span>
                  <strong className="text-gray-900">{copy.stats.engineersCount}</strong> {copy.stats.engineersLabel}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldCheck size={16} className="text-gray-500" />
                <span>
                  {copy.stats.verifiedPrefix} <strong className="text-gray-900">{copy.stats.verifiedStrong}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star size={16} className="text-gray-500" />
                <span>
                  {copy.stats.cardPrefix} <strong className="text-gray-900">{copy.stats.cardStrong}</strong>
                </span>
              </div>
            </div>
          </div>
        </PageHero>
      </div>
    </section>
  );
}
