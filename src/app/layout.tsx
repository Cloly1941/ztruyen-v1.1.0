// ** React
import {ReactNode} from "react";

// ** Next js
import type {Metadata, Viewport} from "next";
import {Montserrat, Bangers, Nunito} from "next/font/google";
import Script from "next/script";

// ** Shadcn ui
import {TooltipProvider} from "@/components/ui/tooltip";

// ** Theme provider
import {ThemeProvider} from "@/theme/ThemeProvider";

// ** Components
import Toast from "@/components/common/Toast";
import ProgressWrapper from "@/components/common/ProgressWrapper";
import NotificationListener from "@/components/common/NotificationListener";

// ** Styles global
import "./globals.css";

// ** Config
import {VARIABLE} from "@/configs/variable";
import {CONFIG_IMG} from "@/configs/img";

// UI / Button / Filter
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-ui",
    display: "swap",
});

// Title comic/ chapter
const bangers = Bangers({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-title",
    display: "swap",
});

// Description / text comic
const nunito = Nunito({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-text",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        template: '%s | Ztruyện v1.1',
        default: 'Đọc truyện tranh Manhwa, Manga, Manhua Online - Ztruyện v1.1',
    },
    description:
        'Web đọc truyện tranh manhwa, manhua, manga, ngôn tình, tiên hiệp, kiếm hiệp online hay và mới nhất cập nhật liên tục tại v1.ztruyen.io.vn',
    generator: 'Next.js',
    applicationName: 'Ztruyen v1.1',
    referrer: 'origin-when-cross-origin',
    keywords: [
        'doc truyen tranh',
        'manga',
        'doc manga',
        'ngon tinh',
        'tien hiep',
    ],
    authors: [
        {name: 'Cloly'},
        {name: 'Cloly', url: 'https://www.facebook.com/ree.6I6/'},
    ],
    creator: 'Cloly',
    publisher: 'Cloly',
    openGraph: {
        title: 'Đọc truyện tranh Manhwa, Manga, Manhua Online - Ztruyện v1.1',
        description:
            'Web đọc truyện tranh manhwa, manhua, manga, ngôn tình, tiên hiệp, kiếm hiệp online hay và mới nhất cập nhật liên tục tại v1.ztruyen.io.vn',
        url: `${VARIABLE.BASE_URL_FE}`,
        siteName: 'Ztruyện v1.1',
        images: [
            {
                url: '/bg.png',
                width: 1200,
                height: 630,
                alt: 'Ztruyện v1.1',
            },
        ],
        locale: 'vi_VN',
        phoneNumbers: '0326654301',
        emails: 'ree6i6x@gmail.com',
        type: 'website',
        countryName: 'Việt Nam',
    },
    alternates: {
        canonical: VARIABLE.BASE_URL_FE,
    },
    metadataBase: new URL(VARIABLE.BASE_URL_FE || ''),
    verification: {
        google: process.env.NEXT_PUBLIC_VERIFICATION_GOOGLE,
    },
    manifest: "/manifest.json",
    icons: {
        icon: [
            {url: CONFIG_IMG.FAVICON},
            {url: CONFIG_IMG.FAVICON_16, sizes: "16x16", type: "image/png"},
            {url: CONFIG_IMG.FAVICON_32, sizes: "32x32", type: "image/png"}
        ],
        apple: [
            {url: CONFIG_IMG.ICON_APPLE, sizes: "180x180"}
        ]
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "#ffffff"},
        {media: "(prefers-color-scheme: dark)", color: "#212121"}
    ],
};

export default function RootLayout({children,}: { children: ReactNode }) {
    return (
        <html lang="vi" suppressHydrationWarning>
        <body
            className={`${montserrat.variable} ${bangers.variable} ${nunito.variable}`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ProgressWrapper>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </ProgressWrapper>
            <Toast/>
            <NotificationListener/>
        </ThemeProvider>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
            {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
        </Script>
        </body>
        </html>
    );
}
