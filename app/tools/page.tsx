import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import ToolLibrary from "@/components/tools/ToolLibrary";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.tools;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.badge} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/tools",
    locale,
  });
}

type ToolsIndexPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function ToolsIndexPage({ searchParams }: ToolsIndexPageProps) {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.tools;

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc="/illustrations/tools-hero.png"
        imageAlt={copy.imageAlt}
      />

      <ToolLibrary locale={locale} searchParams={searchParams} />
    </PageShell>
  );
}
