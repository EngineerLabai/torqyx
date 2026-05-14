import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import ToolLibraryLazy from "@/components/tools/ToolLibraryLazy";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.tools;
  const brandContent = getBrandCopy(locale);
  const title = locale === "tr" ? "Mühendislik Hesaplayıcıları" : "Engineering Calculators";
  const description =
    locale === "tr"
      ? "Cıvata, kuvvet, tork, malzeme ve daha fazlası. Tüm hesaplayıcılar ISO/DIN referanslı, adım adım doğrulanmış sonuçlarla."
      : copy.description;

  return buildPageMetadata({
    title,
    description,
    path: "/tools",
    locale,
    openGraph: {
      siteName: brandContent.siteName,
    },
  });
}

type ToolsIndexPageProps = {
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
};

export default async function ToolsIndexPage({ searchParams }: ToolsIndexPageProps) {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.tools;
  const heroImage = "/images/hero-background.webp";
  const resolvedSearchParams = (await searchParams) ?? undefined;

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Tool Library"
        priority
      />

      <ToolLibraryLazy locale={locale} searchParams={resolvedSearchParams} />
    </PageShell>
  );
}
