"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getBrandCopy } from "@/config/brand";
import { SITE_URL } from "@/utils/seo";

type WebPageJsonLdProps = {
  title?: string;
  description?: string;
  path?: string;
};

const toAbsoluteUrl = (path: string) => {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return SITE_URL;
  }
};

export default function WebPageJsonLd({ title, description, path }: WebPageJsonLdProps) {
  const { locale } = useLocale();
  const pathname = usePathname() ?? "/";
  const brandContent = useMemo(() => getBrandCopy(locale), [locale]);
  const pagePath = path ?? pathname;

  const data = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title ?? brandContent.siteName,
      description: description ?? brandContent.tagline,
      url: toAbsoluteUrl(pagePath),
      isPartOf: {
        "@type": "WebSite",
        name: brandContent.siteName,
        url: SITE_URL,
      },
      inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    }),
    [title, description, brandContent.siteName, brandContent.tagline, pagePath, locale],
  );

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
