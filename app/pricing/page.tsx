import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { withLocalePrefix } from "@/utils/locale-path";

type PlanTone = "free" | "premium";

type PlanCardProps = {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  tone?: PlanTone;
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).pages.pricing;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/pricing",
    locale,
  });
}

export default async function PricingPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.pricing;
  const heroImage = getHeroImageSrc("premium");
  const toolsHref = withLocalePrefix("/tools", locale);
  const supportHref = withLocalePrefix("/support", locale);

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt={copy.title}
      >
        <Link
          href={toolsHref}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {copy.free.cta}
        </Link>
        <Link
          href={supportHref}
          className="rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100"
        >
          {copy.premium.cta}
        </Link>
      </PageHero>

      <section className="grid gap-4 lg:grid-cols-2">
        <PlanCard
          title={copy.free.title}
          subtitle={copy.free.subtitle}
          description={copy.free.description}
          features={copy.free.features}
          ctaLabel={copy.free.cta}
          ctaHref={toolsHref}
          tone="free"
        />
        <PlanCard
          title={copy.premium.title}
          subtitle={copy.premium.subtitle}
          description={copy.premium.description}
          features={copy.premium.features}
          ctaLabel={copy.premium.cta}
          ctaHref={supportHref}
          tone="premium"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
        {copy.note}
      </section>
    </PageShell>
  );
}

function PlanCard({
  title,
  subtitle,
  description,
  features,
  ctaLabel,
  ctaHref,
  tone = "free",
}: PlanCardProps) {
  const badgeClass =
    tone === "premium"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";
  const ctaClass =
    tone === "premium"
      ? "border-amber-200 bg-amber-100 text-amber-800 hover:border-amber-300 hover:bg-amber-200"
      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeClass}`}>
          {subtitle}
        </span>
      </div>
      <h2 className="mt-3 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>

      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
        {features.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`mt-5 inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition ${ctaClass}`}
      >
        {ctaLabel}
      </Link>
    </article>
  );
}
