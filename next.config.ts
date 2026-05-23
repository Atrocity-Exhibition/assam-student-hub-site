import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/notices",
        destination: "/jobs",
        permanent: true,
      },
      {
        source: "/notices/:slug",
        destination: "/jobs/:slug",
        permanent: true,
      },
      {
        source: "/saved-notices",
        destination: "/saved-jobs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
