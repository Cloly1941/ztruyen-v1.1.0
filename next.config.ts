// ** Next
import type { NextConfig } from "next";

// ** Next PWA
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/your-api\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|svg|css|js)$/i,
            handler: 'CacheFirst',
            options: { cacheName: 'static-assets' },
        },
    ],
})(nextConfig);