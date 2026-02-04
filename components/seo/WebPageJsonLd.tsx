"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getBrandCopy } from "@/config/brand";
import { SITE_URL } from "@/utils/seo";

type WebPageJsonLdProps = {
  title?: string;
  description?: string;
};

export default function WebPageJsonLd({ title, description }: WebPageJsonLdProps) {
  const { locale } = useLocale();
  const brandContent = getBrandCopy(locale);
  const pathname = usePathname() ?? "/";

  const [meta, setMeta] = useState({
    title: title ?? brandContent.siteName,
    description: description ?? brandContent.description,
  });

  useEffect(() => {
    if (!title || !description) {
      const docTitle = document.title || brandContent.siteName;
      const metaDescription =
        document.querySelector('meta[name="description"]')?.getAttribute("content") ??
        brandContent.description;

      Promise.resolve().then(() =>
        setMeta({
          title: title ?? docTitle,
          description: description ?? metaDescription,
        }),
      );
    }
  }, [title, description, brandContent]);

  const data = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: meta.title,
      description: meta.description,
      url: new URL(pathname, SITE_URL).toString(),
      isPartOf: {
        "@type": "WebSite",
        name: brandContent.siteName,
        url: SITE_URL,
      },
      inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    }),
    [meta, pathname, brandContent, locale],
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
