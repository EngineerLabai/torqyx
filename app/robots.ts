import type { MetadataRoute } from "next";
import { buildCanonical } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api"],
    },
    sitemap: buildCanonical("/sitemap.xml") ?? "/sitemap.xml",
  };
}
