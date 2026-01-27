"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/utils/seo";

const DEFAULT_TITLE = "AI Engineers Lab";
const DEFAULT_DESCRIPTION = "Gelecegi kodluyoruz.";

type WebPageJsonLdProps = {
  title?: string;
  description?: string;
};

export default function WebPageJsonLd({ title, description }: WebPageJsonLdProps) {
  const pathname = usePathname() ?? "/";
  const [meta, setMeta] = useState({
    title: title ?? DEFAULT_TITLE,
    description: description ?? DEFAULT_DESCRIPTION,
  });

  useEffect(() => {
    if (!title || !description) {
      const docTitle = document.title || DEFAULT_TITLE;
      const metaDescription =
        document.querySelector('meta[name="description"]')?.getAttribute("content") ??
        DEFAULT_DESCRIPTION;

      Promise.resolve().then(() =>
        setMeta({
          title: title ?? docTitle,
          description: description ?? metaDescription,
        }),
      );
    }
  }, [title, description]);

  const data = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: meta.title,
      description: meta.description,
      url: new URL(pathname, SITE_URL).toString(),
      isPartOf: {
        "@type": "WebSite",
        name: DEFAULT_TITLE,
        url: SITE_URL,
      },
      inLanguage: "tr-TR",
    }),
    [meta, pathname],
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
