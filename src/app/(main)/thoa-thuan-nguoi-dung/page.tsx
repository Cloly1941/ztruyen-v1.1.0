// ** Next
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Thỏa thuận người dùng - ZTruyen",
    description:
        "Thỏa thuận người dùng của ZTruyen. Website đọc truyện trực tuyến sử dụng dữ liệu từ OTruyen API và cung cấp các tính năng như đăng nhập, bình luận, lưu lịch sử đọc.",
    alternates: {
        canonical: "https://ztruyen.io.vn/thoa-thuan-nguoi-dung",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Thỏa thuận người dùng - ZTruyen",
        description:
            "Tìm hiểu các điều khoản và thỏa thuận khi sử dụng website đọc truyện ZTruyen.",
        url: "https://ztruyen.io.vn/thoa-thuan-nguoi-dung",
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
        title: "Thỏa thuận người dùng - ZTruyen",
        description:
            "Các điều khoản và quy định khi sử dụng nền tảng đọc truyện ZTruyen.",
        images: ["/og-ztruyen.png"],
    },
}

const TermsOfService = () => {
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 lg:py-16">
                {/* Title */}
                <h1 className="mb-4 text-xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                    Thỏa thuận người dùng
                </h1>

                {/* Intro */}
                <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Vui lòng đọc kỹ Thỏa thuận người dùng trước khi sử dụng ZTruyen.
                    Khi truy cập hoặc sử dụng website, bạn đồng ý tuân thủ toàn bộ
                    các điều khoản và điều kiện được nêu dưới đây.
                </p>

                {/* Content */}
                <div className="space-y-8 text-sm leading-7 sm:space-y-10 sm:text-base sm:leading-8">
                    {/* 1 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            1. Giới thiệu
                        </h2>
                        <p className="text-muted-foreground">
                            ZTruyen là nền tảng đọc truyện trực tuyến, cung cấp giao diện
                            và các công cụ hỗ trợ người dùng tiếp cận nội dung truyện
                            một cách thuận tiện và thân thiện.
                        </p>
                    </section>

                    {/* 2 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            2. Nguồn nội dung truyện
                        </h2>

                        <p className="text-muted-foreground">
                            Toàn bộ dữ liệu truyện tranh, hình ảnh và thông tin chi tiết
                            được tổng hợp từ{" "}
                            <strong className="font-medium text-foreground">
                                OTruyen API
                            </strong>.
                        </p>

                        <p className="mt-2 text-muted-foreground">
                            ZTruyen không sở hữu, không lưu trữ và không chịu trách nhiệm
                            bản quyền đối với nội dung truyện được cung cấp từ bên thứ ba.
                        </p>

                        <p className="mt-2 text-muted-foreground">
                            Mọi vấn đề liên quan đến bản quyền vui lòng liên hệ trực tiếp
                            với đơn vị sở hữu nội dung.
                        </p>
                    </section>

                    {/* 3 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            3. Dịch vụ và tính năng
                        </h2>

                        <p className="mb-3 text-muted-foreground">
                            ZTruyen phát triển các tính năng bổ sung thông qua hệ thống API nội bộ:
                        </p>

                        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>Đăng ký, đăng nhập tài khoản</li>
                            <li>Bình luận và tương tác</li>
                            <li>Lưu lịch sử đọc và truyện yêu thích</li>
                            <li>Xếp hạng: top truyện, top bình luận</li>
                            <li>Cải thiện trải nghiệm đọc (UI/UX)</li>
                        </ul>
                    </section>

                    {/* 4 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            4. Dữ liệu người dùng
                        </h2>

                        <p className="text-muted-foreground">
                            Dữ liệu tài khoản như tên đăng nhập, bình luận, lịch sử đọc
                            được lưu trữ và quản lý bởi hệ thống ZTruyen.
                        </p>

                        <p className="mt-2 text-muted-foreground">
                            Chúng tôi cam kết bảo mật dữ liệu người dùng và không chia sẻ
                            cho bên thứ ba, trừ khi có yêu cầu từ cơ quan chức năng.
                        </p>
                    </section>

                    {/* 5 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            5. Nội dung do người dùng tạo
                        </h2>

                        <p className="text-muted-foreground">
                            Người dùng không được đăng tải nội dung:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>Vi phạm pháp luật hoặc thuần phong mỹ tục</li>
                            <li>Xúc phạm, kích động thù ghét</li>
                            <li>Spam, quảng cáo trái phép</li>
                        </ul>

                        <p className="mt-2 text-muted-foreground">
                            ZTruyen có quyền xóa nội dung hoặc khóa tài khoản nếu phát hiện vi phạm.
                        </p>
                    </section>

                    {/* 6 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            6. Giới hạn trách nhiệm
                        </h2>

                        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>Nội dung truyện từ bên thứ ba</li>
                            <li>Nội dung do người dùng đăng tải</li>
                            <li>Thiệt hại phát sinh trong quá trình sử dụng</li>
                        </ul>
                    </section>

                    {/* 7 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            7. Thay đổi điều khoản
                        </h2>

                        <p className="text-muted-foreground">
                            ZTruyen có thể cập nhật điều khoản bất kỳ lúc nào.
                            Việc tiếp tục sử dụng website đồng nghĩa với việc bạn chấp nhận các thay đổi.
                        </p>
                    </section>

                    {/* 8 */}
                    <section>
                        <h2 className="mb-2 text-base font-medium sm:text-lg">
                            8. Liên hệ
                        </h2>

                        <p className="text-muted-foreground">
                            Mọi thắc mắc hoặc phản hồi vui lòng liên hệ đội ngũ quản trị ZTruyen qua Fanpage.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default TermsOfService
