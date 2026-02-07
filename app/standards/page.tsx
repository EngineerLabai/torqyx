import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { standardsManifest } from "@/data/standards";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { withLocalePrefix } from "@/utils/locale-path";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.standards;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/standards",
    locale,
  });
}

export default async function StandardsLandingPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.standards;
  const heroImage = getHeroImageSrc("tools");

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt={copy.imageAlt}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.categoriesTitle}</h2>
          <p className="text-sm text-slate-600">{copy.categoriesDescription}</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {standardsManifest.categories.map((category) => (
            <Link
              key={category.id}
              href={withLocalePrefix(`/standards/${category.slug}`, locale)}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-white"
            >
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">{copy.categoryBadge}</div>
                <h3 className="text-base font-semibold text-slate-900">{category.title[locale]}</h3>
                <p className="text-sm text-slate-600">{category.description[locale]}</p>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
                {copy.categoryCta}
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
