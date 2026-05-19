import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import UpgradePlanViewTracker from "@/components/analytics/UpgradePlanViewTracker";
import TrackedUpgradeLink from "@/components/analytics/TrackedUpgradeLink";
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
  ctaNote?: string;
  tone?: PlanTone;
  upgradeSource?: string;
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
  const supportHref = `${withLocalePrefix("/support", locale)}#support-form`;

  return (
    <PageShell>
      <UpgradePlanViewTracker plan="pro" source="pricing_page" />
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Premium Hero"
      >
        <Link
          href={toolsHref}
          className="rounded-md border border-brand bg-transparent px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
        >
          {copy.free.cta}
        </Link>
        <TrackedUpgradeLink
          plan="pro"
          source="pricing_hero"
          href={supportHref}
          className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-90"
        >
          {copy.premium.cta}
        </TrackedUpgradeLink>
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
          ctaNote={copy.premium.ctaNote}
          tone="premium"
          upgradeSource="pricing_plan_card"
        />
      </section>

      <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
        <p>{copy.note}</p>
        <p className="font-semibold text-slate-800">{copy.guarantee}</p>
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
  ctaNote,
  tone = "free",
  upgradeSource,
}: PlanCardProps) {
  const badgeClass =
    tone === "premium"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";
  const ctaClass =
    tone === "premium"
      ? "border-brand bg-brand text-white hover:brightness-90"
      : "border-brand bg-transparent text-brand hover:bg-brand hover:text-white";

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

      {upgradeSource ? (
        <TrackedUpgradeLink
          href={ctaHref}
          plan="pro"
          source={upgradeSource}
          className={`mt-5 inline-flex items-center justify-center rounded-md border px-6 py-3 text-xs font-semibold transition ${ctaClass}`}
        >
          {ctaLabel}
        </TrackedUpgradeLink>
      ) : (
        <Link
          href={ctaHref}
          className={`mt-5 inline-flex items-center justify-center rounded-md border px-6 py-3 text-xs font-semibold transition ${ctaClass}`}
        >
          {ctaLabel}
        </Link>
      )}
      {ctaNote ? <p className="mt-3 text-xs leading-relaxed text-slate-500">{ctaNote}</p> : null}
    </article>
  );
}
