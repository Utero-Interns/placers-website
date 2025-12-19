import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://utero.viewdns.net:3100/:path*',
      },
    ];
  },
};

export default nextConfig;
