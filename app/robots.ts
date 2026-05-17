import type { MetadataRoute } from "next";
import { IS_INDEXING_ENABLED, SITE_URL, buildCanonical } from "@/utils/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!IS_INDEXING_ENABLED) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: buildCanonical("/sitemap.xml") ?? "/sitemap.xml",
    };
  }

  const host = (() => {
    try {
      return new URL(SITE_URL).host;
    } catch {
      return undefined;
    }
  })();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/login", "/saved-calculations", "/health"],
    },
    ...(host ? { host } : {}),
    sitemap: buildCanonical("/sitemap.xml") ?? "/sitemap.xml",
  };
}
