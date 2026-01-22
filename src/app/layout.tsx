// ** React
import {ReactNode} from "react";

// ** Next js
import type { Metadata } from "next";
import { Montserrat, Bangers, Nunito } from "next/font/google";

// ** Styles global
import "./globals.css";

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
	weight: ["400", "500", "600"],
	variable: "--font-text",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Web Truyện Tranh",
	description: "Đọc truyện tranh online",
};

export default function RootLayout({children,}: { children: ReactNode }) {
	return (
		<html lang="vi">
		<body
			className={`${montserrat.variable} ${bangers.variable} ${nunito.variable}`}
		>
		{children}
		</body>
		</html>
	);
}
