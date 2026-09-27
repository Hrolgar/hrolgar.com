import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Ko-fi strips query strings from profile links, sends them with noreferrer and
  // hides any link with "ko-fi" in it, so the profile links to /coffee and the tags live here.
  async redirects() {
    return [
      {
        source: "/coffee",
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
