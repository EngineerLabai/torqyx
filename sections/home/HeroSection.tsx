import Link from "next/link";
import { CheckCircle2, LockKeyhole, Users } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { getBrandCopy } from "@/config/brand";
import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";

type HeroSectionProps = {
  locale: Locale;
};

export default function HeroSection({ locale }: HeroSectionProps) {
  const brandContent = getBrandCopy(locale);
  const messages = getMessages(locale);
  const copy = messages.home.hero;
  const heroImage = "/images/home-hero.webp";
  const toolsHref = withLocalePrefix("/tools", locale);

  return (
    <section id="home" className="w-full pb-10 pt-14 md:pt-20">
      <div className="site-container">
        <h1 className="sr-only">{copy.seoH1}</h1>
        <PageHero
          title={copy.headline}
          description={copy.subheadline}
          subtitle={copy.subtitle}
          eyebrow={copy.eyebrow ?? brandContent.siteName}
          imageSrc={heroImage}
          imageAlt="Torqyx Engineering - Home Hero"
          headingLevel="h2"
          priority
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Link
                href={toolsHref}
                className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-90"
              >
                {copy.ctaPrimary}
              </Link>
              <a
                href="#calculator-showcase"
                className="inline-flex items-center justify-center rounded-md border border-brand bg-transparent px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
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
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>
                  {copy.stats.verifiedPrefix} <strong className="text-gray-900">{copy.stats.verifiedStrong}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LockKeyhole size={16} className="text-gray-500" />
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
