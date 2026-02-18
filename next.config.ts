import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  // Hide Next.js dev indicator overlays that can appear as floating "ms/fps" HUDs.
  devIndicators: false,
  async redirects() {
    return [
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
