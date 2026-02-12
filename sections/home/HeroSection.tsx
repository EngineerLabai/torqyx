import { ShieldCheck, Users } from "lucide-react";
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
  const copy = getMessages(locale).home.hero;
  const heroImage = getHeroImageSrc("home");
  return (
    <section id="home" className="px-4 pb-10 pt-14 md:px-10 md:pt-20 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <PageHero
          title={copy.headline}
          description={copy.subheadline}
          subtitle={copy.subtitle}
          eyebrow={copy.eyebrow ?? brandContent.siteName}
          imageSrc={heroImage}
          imageAlt={copy.imageAlt}
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

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                <Users size={14} />
                {copy.socialProof}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                <ShieldCheck size={14} className="text-emerald-600" />
                {copy.trustBadge}
              </span>
            </div>

            {copy.supportNote ? <p className="text-xs text-slate-500">{copy.supportNote}</p> : null}
          </div>
        </PageHero>
      </div>
    </section>
  );
}
