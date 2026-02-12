import CommunityWaitlistForm from "@/components/community/CommunityWaitlistForm";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";
import { getMessages } from "@/utils/messages";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).pages.communityComingSoon;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/community",
    locale,
  });
}

export default async function CommunityPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.communityComingSoon;
  const heroImage = getHeroImageSrc("community");

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt={copy.title}
      >
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
          {copy.statusTitle}
        </span>
      </PageHero>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{copy.roadmapIntro}</p>
            <h2 className="text-lg font-semibold text-slate-900">{copy.roadmapTitle}</h2>
            <p className="text-sm text-slate-600">{copy.statusBody}</p>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {copy.roadmapItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <CommunityWaitlistForm copy={copy.waitlist} />
        </div>
      </section>
    </PageShell>
  );
}
