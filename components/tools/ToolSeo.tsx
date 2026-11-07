import ToolApplicationJsonLd from "@/components/seo/ToolApplicationJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import type { Locale } from "@/utils/locale";
import { buildToolJsonLd } from "@/utils/tool-seo";
import { CANONICAL_SITE_URL } from "@/utils/seo";
import { getCategoryForToolId } from "@/data/tool-categories";

type ToolSeoProps = {
  toolId: string;
  locale: Locale;
};

/**
 * Emits the application entity and BreadcrumbList for rich search result snippets.
 * BreadcrumbList follows 4-level hierarchy: Home > Calculators > Category > Tool.
 */
export default function ToolSeo({ toolId, locale }: ToolSeoProps) {
  const data = buildToolJsonLd(toolId, locale);
  const idPrefix = toolId.replace(/[^a-z0-9_-]+/gi, "-");
  const category = getCategoryForToolId(toolId);

  const homeUrl = `${CANONICAL_SITE_URL}/${locale}`;
  const toolsUrl = `${CANONICAL_SITE_URL}/${locale}/tools`;
  const toolUrl = data.url;

  const homeName = locale === "tr" ? "Ana Sayfa" : "Home";
  const toolsName = locale === "tr" ? "Hesaplayıcılar" : "Calculators";

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeName,
      item: homeUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: toolsName,
      item: toolsUrl,
    },
  ];

  if (category) {
    itemListElement.push({
      "@type": "ListItem",
      position: 3,
      name: category.title[locale],
      item: `${CANONICAL_SITE_URL}/${locale}/tools/${category.slug}`,
    });
    itemListElement.push({
      "@type": "ListItem",
      position: 4,
      name: data.name,
      item: toolUrl,
    });
  } else {
    itemListElement.push({
      "@type": "ListItem",
      position: 3,
      name: data.name,
      item: toolUrl,
    });
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <>
      <ToolApplicationJsonLd id={`${idPrefix}-webapp-jsonld`} data={data} schemaType="WebApplication" />
      <JsonLd id={`${idPrefix}-breadcrumb-jsonld`} data={breadcrumbData} />
    </>
  );
}
