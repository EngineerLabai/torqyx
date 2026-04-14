import { getLocaleFromCookies } from "@/utils/locale-server";
import { DEFAULT_OG_IMAGE_META } from "@/utils/seo";
import { buildToolSchema, getToolSeo } from "@/tools/_shared/seo";

const toolPath = "hydraulic-cylinder";

export default async function Head() {
  const locale = await getLocaleFromCookies();
  const meta = getToolSeo(toolPath, locale);
  const schema = buildToolSchema(toolPath, locale);

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      <link rel="alternate" hrefLang="tr" href={meta.alternates.tr} />
      <link rel="alternate" hrefLang="en" href={meta.alternates.en} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:locale" content={locale === "tr" ? "tr_TR" : "en_US"} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE_META.url} />
      <meta property="og:image:width" content={String(DEFAULT_OG_IMAGE_META.width)} />
      <meta property="og:image:height" content={String(DEFAULT_OG_IMAGE_META.height)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE_META.url} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
