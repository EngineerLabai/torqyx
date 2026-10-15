import ToolApplicationJsonLd from "@/components/seo/ToolApplicationJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import type { Locale } from "@/utils/locale";
import { buildToolJsonLd } from "@/utils/tool-seo";
import { CANONICAL_SITE_URL } from "@/utils/seo";

type ToolSeoProps = {
  toolId: string;
  locale: Locale;
};

/**
 * Emits the application entity and BreadcrumbList for rich search result snippets.
 * Visible how-to and FAQ content remains on the page.
 */
export default function ToolSeo({ toolId, locale }: ToolSeoProps) {
  const data = buildToolJsonLd(toolId, locale);
  const idPrefix = toolId.replace(/[^a-z0-9_-]+/gi, "-");

  const homeUrl = `${CANONICAL_SITE_URL}/${locale}`;
  const toolsUrl = `${CANONICAL_SITE_URL}/${locale}/tools`;
  const toolUrl = data.url;

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === "tr" ? "Ana Sayfa" : "Home",
        "item": homeUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locale === "tr" ? "Hesaplayıcılar" : "Tools",
        "item": toolsUrl,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.name,
        "item": toolUrl,
      },
    ],
  };

  return (
    <>
      <ToolApplicationJsonLd id={`${idPrefix}-webapp-jsonld`} data={data} schemaType="WebApplication" />
      <JsonLd id={`${idPrefix}-breadcrumb-jsonld`} data={breadcrumbData} />
    </>
  );
}
