import type { Locale } from "@/utils/locale";
import { BRAND_TAGLINE } from "@/utils/brand";

type HeroSectionProps = {
  locale: Locale;
};

export default function HeroSection({ locale }: HeroSectionProps) {
  const copy =
    locale === "en"
      ? {
          kicker: "ENGINEERS LAB",
          title: "Clear, fast, and reliable mechanical calculations.",
          lead: BRAND_TAGLINE,
          ctaPrimary: "Go to Calculators",
          ctaSecondary: "Explore Tools",
          valueKicker: "Methodology",
          valueText:
            "Step through formulas and checklists with visual support. Manual calculations keep the flow transparent and repeatable.",
        }
      : {
          kicker: "MUHENDISLER LAB",
          title: "Net, hizli ve guvenilir mekanik hesaplar.",
          lead: BRAND_TAGLINE,
          ctaPrimary: "Hesaplayicilara Git",
          ctaSecondary: "Araclari Kesfet",
          valueKicker: "Metodoloji",
          valueText:
            "Formuller, kontrol listeleri ve gorsel destekle adim adim ilerle. Manuel hesapla akisi net ve tekrarlanabilir tut.",
        };
  return (
    <section
      id="home"
      className="relative flex flex-col justify-center px-4 pb-12 pt-24 md:px-10 md:pb-16 lg:px-16"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-start gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          {copy.kicker}
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
          {copy.title}
        </h1>
        <p className="text-base text-slate-300 sm:text-lg">
          {copy.lead}
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/tools"
            className="inline-flex items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-500/30"
          >
            {copy.ctaPrimary}
          </a>
          <a
            href="/project-hub"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
          >
            {copy.ctaSecondary}
          </a>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-black/50 p-5 text-sm text-slate-300 shadow-[8px_8px_0px_rgba(74,222,128,0.18)] backdrop-blur sm:text-base">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy.valueKicker}
          </div>
          {copy.valueText}
        </div>
      </div>
    </section>
  );
}
