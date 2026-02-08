import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            // google facebook
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.fbcdn.net',
                pathname: '/**',
            },

            // otruyen api
            {
                protocol: 'https',
                hostname: 'img.otruyenapi.com',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'sv1.otruyencdn.com',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },

};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
