import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";

type FeaturedGuidesSectionProps = {
  locale: Locale;
};

const FEATURED_GUIDE_SLUGS = [
  "kama-tasarimi-101",
  "kiris-egilme-ve-sehim-hesabi-euler-bernoulli",
  "tolerans-zinciri-analizi-kotu-durum-ve-rss",
  "makine-ogesi-omru-yorulma-rehberi",
  "rulman-secimi-icin-hizli-rehber",
  "akiskan-dinamigi-temelleri-boru-kanal-akisi",
] as const;

export default function FeaturedGuidesSection({ locale }: FeaturedGuidesSectionProps) {
  const copy = getMessages(locale).home.featuredGuides;
  const guides = FEATURED_GUIDE_SLUGS.map((slug, i) => ({
    slug,
    title: copy.items[i].title,
    description: copy.items[i].description,
  }));
  const allGuidesHref = withLocalePrefix("/guides", locale);

  return (
    <section id="featured-guides" className="w-full py-12">
      <div className="site-container space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={withLocalePrefix(`/guides/${guide.slug}`, locale)}
              aria-label={`${guide.title} — ${copy.readMore}`}
              className="group flex min-h-[180px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-brand">
                  <BookOpen size={19} />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-950">
                  {guide.title}
                </h3>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{guide.description}</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand">
                  {copy.readMore}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href={allGuidesHref}
          className="inline-flex items-center justify-center rounded-md border border-brand bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand transition hover:bg-brand hover:text-white"
        >
          {copy.cta}
        </Link>
      </div>
    </section>
  );
}
