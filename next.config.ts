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

const nextConfig: NextConfig = {
  async redirects() {
    const localeRedirects = localeRedirectRoots.flatMap((root) => [
      {
        source: `/${root}`,
        destination: `/tr/${root}`,
        permanent: true,
      },
      {
        source: `/${root}/:path*`,
        destination: `/tr/${root}/:path*`,
        permanent: true,
      },
    ]);

    return [
      ...localeRedirects,
      {
        source: "/forum",
        destination: "/tr/qa",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
