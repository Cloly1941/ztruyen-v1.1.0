// ** Next
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
    title: "Hướng dẫn sử dụng - ZTruyen",
    description:
        "Hướng dẫn sử dụng ZTruyen. Tìm hiểu cách đọc truyện, tạo tài khoản, lưu truyện yêu thích và các tính năng khác trên website đọc truyện trực tuyến ZTruyen.",
    alternates: {
        canonical: "https://ztruyen.io.vn/huong-dan",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Hướng dẫn sử dụng - ZTruyen",
        description:
            "Tìm hiểu cách sử dụng ZTruyen, từ đăng ký tài khoản đến đọc truyện và các tính năng nâng cao.",
        url: "https://ztruyen.io.vn/huong-dan",
        siteName: "ZTruyen",
        images: [
            {
                url: "/og-ztruyen.png",
                width: 1200,
                height: 630,
                alt: "ZTruyen - Đọc truyện online",
            },
        ],
        type: "article",
    },
    twitter: {
        card: "summary_large_image",
        title: "Hướng dẫn sử dụng - ZTruyen",
        description:
            "Hướng dẫn chi tiết cách sử dụng các tính năng trên nền tảng đọc truyện ZTruyen.",
        images: ["/og-ztruyen.png"],
    },
}

const GuidePage = () => {
    return (
        <div className="min-h-screen bg-background container">Đây là trang hướng dẫn đang cập nhật</div>
    )
}

export default GuidePage
