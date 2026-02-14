import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const localeRedirectRoots = [
  "tools",
  "blog",
  "community",
  "premium",
  "qa",
  "project-hub",
  "quality-tools",
  "fixture-tools",
];
const localeMissing: { type: "header"; key: string }[] = [{ type: "header", key: "x-locale" }];
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  // Hide Next.js dev indicator overlays that can appear as floating "ms/fps" HUDs.
  devIndicators: false,
  async redirects() {
    const localeRedirects = localeRedirectRoots.flatMap((root) => [
      {
        source: `/${root}`,
        destination: `/tr/${root}`,
        permanent: true,
        missing: localeMissing,
      },
      {
        source: `/${root}/:path*`,
        destination: `/tr/${root}/:path*`,
        permanent: true,
        missing: localeMissing,
      },
    ]);

    return [
      ...localeRedirects,
      {
        source: "/forum",
        destination: "/tr/qa",
        permanent: true,
        missing: localeMissing,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
