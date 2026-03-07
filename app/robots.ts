import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL, buildCanonical } from "@/utils/seo";

const isVercelAppHost = (host: string) => {
  const normalized = host.toLowerCase().trim().replace(/:\d+$/, "");
  return normalized === "vercel.app" || normalized.endsWith(".vercel.app");
};

export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  const requestHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const isVercelHost = isVercelAppHost(requestHost) || (!requestHost && isVercelAppHost(process.env.VERCEL_URL ?? ""));

  if (isVercelHost) {
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
      disallow: ["/api", "/saved-calculations"],
    },
    ...(host ? { host } : {}),
    sitemap: buildCanonical("/sitemap.xml") ?? "/sitemap.xml",
  };
}
