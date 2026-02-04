import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import { DEFAULT_OG_IMAGE_META, buildLanguageAlternates, buildLocalizedCanonical } from "@/utils/seo";

type PageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  locale: Locale;
  type?: "website" | "article";
  keywords?: string[];
  image?: typeof DEFAULT_OG_IMAGE_META;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
};

export const buildPageMetadata = ({
  title,
  description,
  path,
  locale,
  type = "website",
  keywords,
  image,
  openGraph,
  twitter,
}: PageMetadataOptions): Metadata => {
  const canonical = buildLocalizedCanonical(path, locale);
  const alternates = {
    canonical,
    languages: buildLanguageAlternates(path),
  };
  const resolvedImage = image ?? DEFAULT_OG_IMAGE_META;
  const openGraphMeta: Metadata["openGraph"] = {
    title,
    description,
    type,
    url: canonical,
    images: [resolvedImage],
    locale: locale === "tr" ? "tr_TR" : "en_US",
    ...openGraph,
  };
  const twitterMeta: Metadata["twitter"] = {
    card: "summary_large_image",
    title,
    description,
    images: [resolvedImage.url],
    ...twitter,
  };

  return {
    title,
    description,
    keywords,
    alternates,
    openGraph: openGraphMeta,
    twitter: twitterMeta,
  };
};
