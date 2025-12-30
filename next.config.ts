import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'utero.viewdns.net',
                port: '3100',
                pathname: '/uploads/**',
            },
        ],
    },
    // output: 'export',
};

export default nextConfig;
