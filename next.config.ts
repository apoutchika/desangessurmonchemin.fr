import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["86.75.87.207"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s3.desangessurmonchemin.fr" },
    ],
  },
  async redirects() {
    return [
      {
        source: '/soutenir',
        destination: '/don',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
