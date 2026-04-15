const baseUrl = process.env.NEXT_PUBLIC_IMG_URL
const baseUrlImg = `${baseUrl}/public`;
const topNumberUrl = `${baseUrl}/top-number`;
const faviconUrl = `${baseUrlImg}/favicon`;
const iconUrl = `${baseUrlImg}/icons`;

export const CONFIG_IMG = {
    FAVICON: `${faviconUrl}/favicon.ico`,
    FAVICON_16: `${faviconUrl}/favicon-16x16.png`,
    FAVICON_32: `${faviconUrl}/favicon-32x32.png`,
    ICON_APPLE: `${iconUrl}/apple-icon-180x180.png`,
    AVATAR_FALLBACK: `${baseUrlImg}/avatar-fallback.webp`,
    EMPTY: `${baseUrlImg}/empty.webp`,
    FACEBOOK: `${baseUrlImg}/facebook-icon.png`,
    GOOGLE: `${baseUrlImg}/google-icon.png`,
    LOGO: `${baseUrlImg}/logo.png`,
    NOT_FOUND: `${baseUrlImg}/notfound.webp`,
    PAGE: `${baseUrlImg}/page.png`,
    TOP_NUMBER: topNumberUrl
} as const;