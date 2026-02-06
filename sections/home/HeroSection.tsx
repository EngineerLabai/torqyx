import PageHero from "@/components/layout/PageHero";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";

type HeroSectionProps = {
  locale: Locale;
};

export default function HeroSection({ locale }: HeroSectionProps) {
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).home.hero;
  const toolsHref = withLocalePrefix("/tools", locale);
  const sanityHref = withLocalePrefix("/tools/sanity-check", locale);
  const heroImage = getHeroImageSrc("home");
  return (
    <section id="home" className="px-4 pb-10 pt-14 md:px-10 md:pt-20 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <PageHero
          title={copy.title}
          description={copy.description}
          subtitle={copy.subtitle}
          eyebrow={brandContent.siteName}
          imageSrc={heroImage}
          imageAlt={copy.imageAlt}
          priority
        >
          <a
            href={toolsHref}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            {copy.ctaPrimary}
          </a>
          <a
            href={sanityHref}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            {copy.ctaSecondary}
          </a>
        </PageHero>
      </div>
    </section>
  );
}
