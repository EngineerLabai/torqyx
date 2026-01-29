import type { MetadataRoute } from "next";
import { SITE_URL, buildCanonical } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {
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
      disallow: ["/api", "/saved-calculations"],
    },
    ...(host ? { host } : {}),
    sitemap: buildCanonical("/sitemap.xml") ?? "/sitemap.xml",
  };
}
