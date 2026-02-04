import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/forum",
        destination: "/qa",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
