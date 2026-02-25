import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vps-placers.utero.cloud',
                pathname: '/uploads/**',
            },
        ],
    },
    // output: 'export',
};

export default nextConfig;
