// ** Next
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Chính sách bảo mật - ZTruyen",
    description:
        "Chính sách bảo mật của ZTruyen. Chúng tôi cam kết bảo vệ thông tin cá nhân người dùng khi sử dụng website đọc truyện trực tuyến.",
    alternates: {
        canonical: "https://ztruyen.io.vn/chinh-sach-bao-mat",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Chính sách bảo mật - ZTruyen",
        description:
            "Tìm hiểu cách ZTruyen thu thập, sử dụng và bảo vệ dữ liệu cá nhân của người dùng.",
        url: "https://ztruyen.io.vn/chinh-sach-bao-mat",
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
        title: "Chính sách bảo mật - ZTruyen",
        description:
            "Cam kết bảo mật thông tin người dùng khi sử dụng nền tảng đọc truyện ZTruyen.",
        images: ["/og-ztruyen.png"],
    },
}

const PrivacyPolicy = () => {
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 lg:py-16">
                <h1 className="mb-4 text-xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                    Chính sách bảo mật
                </h1>

                <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    ZTruyen cam kết tôn trọng và bảo vệ quyền riêng tư của người dùng.
                    Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ
                    thông tin cá nhân khi bạn sử dụng website.
                </p>

                <div className="space-y-8 text-sm leading-7 sm:space-y-10 sm:text-base sm:leading-8">
                    {/* 1 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            1. Phạm vi áp dụng
                        </h2>
                        <p className="text-muted-foreground">
                            Chính sách bảo mật này áp dụng cho toàn bộ người dùng
                            truy cập và sử dụng các dịch vụ trên website ZTruyen.
                        </p>
                    </section>

                    {/* 2 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            2. Thông tin chúng tôi thu thập
                        </h2>

                        <p className="text-muted-foreground">
                            ZTruyen có thể thu thập các loại thông tin sau:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>Thông tin tài khoản: tên đăng nhập, email (nếu có)</li>
                            <li>Dữ liệu sử dụng: lịch sử đọc, truyện yêu thích</li>
                            <li>Nội dung người dùng tạo: bình luận, tương tác</li>
                        </ul>
                    </section>

                    {/* 3 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            3. Mục đích sử dụng thông tin
                        </h2>

                        <p className="text-muted-foreground">
                            Thông tin người dùng được sử dụng nhằm:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>Cung cấp và duy trì hoạt động của website</li>
                            <li>Cá nhân hóa trải nghiệm đọc truyện</li>
                            <li>Quản lý tài khoản và tương tác người dùng</li>
                            <li>Cải thiện chất lượng dịch vụ và tính năng</li>
                        </ul>
                    </section>

                    {/* 4 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            4. Nguồn dữ liệu truyện
                        </h2>

                        <p className="text-muted-foreground">
                            Nội dung truyện hiển thị trên ZTruyen được tổng hợp từ
                            <strong className="ml-1 font-medium text-foreground">
                                OTruyen API
                            </strong>.
                        </p>

                        <p className="mt-2 text-muted-foreground">
                            ZTruyen không lưu trữ nội dung truyện và không chịu trách nhiệm
                            về bản quyền đối với dữ liệu từ bên thứ ba.
                        </p>
                    </section>

                    {/* 5 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            5. Bảo mật dữ liệu
                        </h2>

                        <p className="text-muted-foreground">
                            Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp
                            để bảo vệ thông tin người dùng khỏi truy cập trái phép,
                            mất mát hoặc rò rỉ dữ liệu.
                        </p>
                    </section>

                    {/* 6 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            6. Chia sẻ thông tin
                        </h2>

                        <p className="text-muted-foreground">
                            ZTruyen không bán, trao đổi hoặc chia sẻ thông tin cá nhân
                            của người dùng cho bên thứ ba, trừ các trường hợp:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>Có sự đồng ý của người dùng</li>
                            <li>Yêu cầu từ cơ quan có thẩm quyền theo pháp luật</li>
                        </ul>
                    </section>

                    {/* 7 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            7. Quyền của người dùng
                        </h2>

                        <p className="text-muted-foreground">
                            Người dùng có quyền:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>Yêu cầu chỉnh sửa hoặc xóa dữ liệu cá nhân</li>
                            <li>Ngừng sử dụng dịch vụ bất kỳ lúc nào</li>
                        </ul>
                    </section>

                    {/* 8 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            8. Thay đổi chính sách
                        </h2>

                        <p className="text-muted-foreground">
                            Chính sách bảo mật có thể được cập nhật theo thời gian.
                            Việc tiếp tục sử dụng website đồng nghĩa với việc bạn
                            chấp nhận các thay đổi đó.
                        </p>
                    </section>

                    {/* 9 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            9. Liên hệ
                        </h2>

                        <p className="text-muted-foreground">
                            Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật,
                            vui lòng liên hệ với đội ngũ quản trị ZTruyen qua Fanpage.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default PrivacyPolicy
