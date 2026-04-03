declare module 'next-pwa' {
    import { NextConfig } from 'next';

    interface PWAConfig {
        dest?: string;
        disable?: boolean;
        register?: boolean;
        skipWaiting?: boolean;
        sw?: string;
        scope?: string;
        reloadOnOnline?: boolean;
        cacheOnFrontEndNav?: boolean;
        fallbacks?: {
            document?: string;
            image?: string;
            font?: string;
            audio?: string;
            video?: string;
        };
        runtimeCaching?: Array<{
            urlPattern: RegExp | string;
            handler: 'CacheFirst' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate' | 'CacheOnly';
            options?: {
                cacheName?: string;
                expiration?: {
                    maxEntries?: number;
                    maxAgeSeconds?: number;
                };
                networkTimeoutSeconds?: number;
            };
        }>;
    }

    function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
    export default withPWA;
}