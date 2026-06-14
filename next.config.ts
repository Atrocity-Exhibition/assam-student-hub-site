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
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const scriptSrc = isDev 
      ? "'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.google-analytics.com https://*.adtrafficquality.google" 
      : "'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://adservice.google.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.google-analytics.com https://*.adtrafficquality.google";
    const connectSrc = isDev 
      ? "'self' https://*.supabase.co wss://*.supabase.co ws: wss: https://pagead2.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.googlesyndication.com https://*.adtrafficquality.google" 
      : "'self' https://*.supabase.co wss://*.supabase.co https://pagead2.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.googlesyndication.com https://*.adtrafficquality.google";

    return [
      {
        source: "/((?!sitemap\\.xml$|robots\\.txt$|ads\\.txt$|favicon\\.ico$).*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'none'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src ${connectSrc}; frame-src 'self' https://googleads.g.doubleclick.net https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com https://*.adtrafficquality.google; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'; manifest-src 'self'; media-src 'self';`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
