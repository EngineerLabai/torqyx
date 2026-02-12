import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import ProjectsClient from "@/components/projects/ProjectsClient";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

type PageProps = {
  params: { locale: string };
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

export async function generateMetadata({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const copy = getMessages(locale).pages.projects;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/projects",
    locale,
  });
}

export default function ProjectsPage({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const copy = getMessages(locale).pages.projects;
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

      <ProjectsClient />
    </PageShell>
  );
}
