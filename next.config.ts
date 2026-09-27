import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Ko-fi strips query strings from profile links and sends them with noreferrer,
  // so the UTM tags live here and the Ko-fi profile links to /ko-fi.
  async redirects() {
    return [
      {
        source: "/ko-fi",
        destination: "/?utm_source=ko-fi&utm_medium=referral&utm_campaign=kofi-profile",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
