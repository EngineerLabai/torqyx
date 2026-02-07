import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
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

export default nextConfig;
