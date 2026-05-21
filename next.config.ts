import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/jobs",
        destination: "/notices",
        permanent: true,
      },
      {
        source: "/jobs/:slug",
        destination: "/notices/:slug",
        permanent: true,
      },
      {
        source: "/saved-jobs",
        destination: "/saved-notices",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
