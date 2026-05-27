import type { NextConfig } from "next";
import os from "os";

// Dynamically gather all local network IP addresses to allow HMR/dev requests from mobile devices on the same Wi-Fi
const getLocalIPs = () => {
  const ips: string[] = ["localhost", "127.0.0.1"];
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
        ips.push(`${net.address}:3000`);
      }
    }
  }
  return ips;
};

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalIPs(),
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
