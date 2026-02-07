import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import StandardsCategoryView from "@/components/standards/StandardsCategory";
import { getStandardsCategory, getTablesForCategory } from "@/data/standards";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata({ params }: { params: { category: string } }) {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.standards;
  const category = getStandardsCategory(params.category);

  if (!category) {
    return buildPageMetadata({
      title: copy.title,
      description: copy.description,
      path: "/standards",
      locale,
    });
  }

  return buildPageMetadata({
    title: `${category.title[locale]} | ${copy.title}`,
    description: category.description[locale],
    path: `/standards/${category.slug}`,
    locale,
  });
}

export default async function StandardsCategoryPage({ params }: { params: { category: string } }) {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.standards;
  const category = getStandardsCategory(params.category);
  if (!category) notFound();

  const heroImage = getHeroImageSrc("tools");
  const tables = getTablesForCategory(category);

  return (
    <PageShell>
      <PageHero
        title={category.title[locale]}
        description={category.description[locale]}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt={copy.imageAlt}
      />

      <StandardsCategoryView
        category={category}
        tables={tables}
        locale={locale}
        copy={copy.categoryPage}
      />
    </PageShell>
  );
}
