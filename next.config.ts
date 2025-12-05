import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Override Next.js 15 defaults to cache client-side nav
    staleTimes: {
      dynamic: 30, // Cache dynamic pages for 30s in the browser
      static: 180, // Cache static pages for 3 minutes
    },
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
