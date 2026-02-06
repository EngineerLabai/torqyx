import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import DashboardClient from "@/components/tools/DashboardClient";
import AuthGate from "@/components/auth/AuthGate";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).components.dashboard;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/dashboard",
    locale,
  });
}

export default async function DashboardPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).components.dashboard;

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={HERO_PLACEHOLDER}
        imageAlt={copy.imageAlt}
      />
      <AuthGate>
        <DashboardClient />
      </AuthGate>
    </PageShell>
  );
}
