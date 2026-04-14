import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
  analyzerMode: "static",
});

const normalizePrimarySiteUrl = (value: string) => {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const parsed = new URL(withProtocol.trim());
  parsed.protocol = "https:";
  parsed.hostname = parsed.hostname.replace(/^www\./i, "");
  parsed.pathname = "";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
};

const PRIMARY_SITE_URL = (() => {
  const candidate = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiengineerslab.com";
  try {
    return normalizePrimarySiteUrl(candidate);
  } catch {
    return "https://aiengineerslab.com";
  }
})();

const SHOULD_REDIRECT_VERCEL_APP = (() => {
  try {
    const host = new URL(PRIMARY_SITE_URL).host.toLowerCase();
    return host !== "vercel.app" && !host.endsWith(".vercel.app");
  } catch {
    return true;
  }
})();

const cspReportOnlyPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "report-uri /api/csp-report",
].join("; ");

const securityHeaders = [
  {
    // Enforces HTTPS for 1 year and includes subdomains to reduce downgrade/MITM risks.
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Prevents MIME-type sniffing so browsers do not execute files as a different content type.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Limits referrer data on cross-origin requests while keeping same-origin analytics useful.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Blocks this site from being embedded in frames to mitigate clickjacking attacks.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Disables powerful browser features that are not needed to reduce abuse surface.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Starts CSP in report-only mode so violations can be collected without blocking legitimate traffic.
    key: "Content-Security-Policy-Report-Only",
    value: cspReportOnlyPolicy,
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  // Hide Next.js dev indicator overlays that can appear as floating "ms/fps" HUDs.
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    webVitalsAttribution: ["LCP", "CLS", "INP"],
  },
  async headers() {
    const existingGlobalHeaders: Array<{ key: string; value: string }> = [];
    const mergedHeaders = [...existingGlobalHeaders];

    for (const header of securityHeaders) {
      const existingIndex = mergedHeaders.findIndex(
        (candidate) => candidate.key.toLowerCase() === header.key.toLowerCase(),
      );

      if (existingIndex >= 0) {
        mergedHeaders[existingIndex] = {
          ...mergedHeaders[existingIndex],
          value: header.value,
        };
        continue;
      }

      mergedHeaders.push(header);
    }

    return [
      {
        source: "/:path*",
        headers: mergedHeaders,
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
  async redirects() {
    const vercelAppRedirects = SHOULD_REDIRECT_VERCEL_APP
      ? [
          {
            source: "/:path*",
            has: [{ type: "host" as const, value: ":subdomain.vercel.app" }],
            destination: `${PRIMARY_SITE_URL}/:path*`,
            statusCode: 301 as const,
          },
          {
            source: "/:path*",
            has: [{ type: "host" as const, value: "vercel.app" }],
            destination: `${PRIMARY_SITE_URL}/:path*`,
            statusCode: 301 as const,
          },
        ]
      : [];

    return [
      ...vercelAppRedirects,
      { source: "/en/hakkinda", destination: "/en/about", permanent: true },
      { source: "/en/gizlilik", destination: "/en/privacy", permanent: true },
      { source: "/en/cerez-politikasi", destination: "/en/cookies", permanent: true },
      { source: "/en/kullanim-sartlari", destination: "/en/terms", permanent: true },
      { source: "/en/iletisim", destination: "/en/contact", permanent: true },
      { source: "/tr/about", destination: "/tr/hakkinda", permanent: true },
      { source: "/tr/privacy", destination: "/tr/gizlilik", permanent: true },
      { source: "/tr/cookies", destination: "/tr/cerez-politikasi", permanent: true },
      { source: "/tr/terms", destination: "/tr/kullanim-sartlari", permanent: true },
      { source: "/tr/contact", destination: "/tr/iletisim", permanent: true },
      {
        source: "/forum",
        destination: "/tr/faq",
        permanent: true,
      },
      { source: "/en/forum", destination: "/en/faq", permanent: true },
      { source: "/qa", destination: "/tr/faq", permanent: true },
      { source: "/en/qa", destination: "/en/faq", permanent: true },
      { source: "/community", destination: "/tr/faq", permanent: true },
      { source: "/en/community", destination: "/en/faq", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
