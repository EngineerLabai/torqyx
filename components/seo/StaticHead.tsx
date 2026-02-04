import type { Locale } from "@/utils/locale";
import { DEFAULT_OG_IMAGE_META, buildLanguageAlternates, buildLocalizedCanonical } from "@/utils/seo";

type StaticHeadProps = {
  title: string;
  description: string;
  path: string;
  locale: Locale;
};

export default function StaticHead({ title, description, path, locale }: StaticHeadProps) {
  const canonical = buildLocalizedCanonical(path, locale);
  const alternates = buildLanguageAlternates(path);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="tr" href={alternates.tr} />
      <link rel="alternate" hrefLang="en" href={alternates.en} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={locale === "tr" ? "tr_TR" : "en_US"} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE_META.url} />
      <meta property="og:image:width" content={String(DEFAULT_OG_IMAGE_META.width)} />
      <meta property="og:image:height" content={String(DEFAULT_OG_IMAGE_META.height)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE_META.url} />
    </>
  );
}
