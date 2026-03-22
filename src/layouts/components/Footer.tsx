// ** Next
import Link from "next/link"

// ** Components
import Tag from "@/components/common/Tag"
import Logo from "@/components/common/Logo"

// ** Configs
import { tagsFooter } from "@/configs/footer"

const Footer = () => {
    return (
        <footer className="w-full">
            <div className="bg-[#212121] pt-10 pb-5 shadow-layout">
                <div className="container text-white/70">
                    <div className="flex flex-col gap-6">
                        {/* Top */}
                        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2">
                            <div>
                                <Logo size="lg" />
                            </div>

                            <ul className="flex flex-wrap gap-2">
                                {tagsFooter.map((tag) => (
                                    <Tag
                                        key={tag.title}
                                        href={tag.href}
                                        theme="dark"
                                    >
                                        {tag.title}
                                    </Tag>
                                ))}
                            </ul>
                        </div>

                        {/* Disclaimer */}
                        <div className="space-y-1.5">
                            <h3 className="font-semibold text-white/70 md:text-base">
                                Miễn trừ trách nhiệm
                            </h3>
                            <p className="text-sm leading-relaxed">
                                ZTruyen chỉ cung cấp giao diện và tổng hợp dữ liệu từ
                                <strong className="mx-1 text-white/70">OTruyen</strong>.
                                Chúng tôi không lưu trữ hoặc sở hữu nội dung truyện.
                                Thông tin hiển thị chỉ mang tính tham khảo và
                                <strong className="mx-1 text-white/70">
                                    không chịu trách nhiệm
                                </strong>
                                về độ chính xác, liên kết ngoài hoặc nội dung do bên
                                thứ ba cung cấp.
                            </p>
                        </div>

                        {/* Legal links */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <Link
                                href="/thoa-thuan-nguoi-dung"
                                target='_blank'
                                className="hover:text-white/80 transition-colors"
                            >
                                Thỏa thuận người dùng
                            </Link>

                            <Link
                                href="/chinh-sach-bao-mat"
                                target='_blank'
                                className="hover:text-white/80 transition-colors"
                            >
                                Chính sách bảo mật
                            </Link>
                        </div>

                        {/* Copyright */}
                        <p className="pt-2 text-sm font-medium md:text-base">
                            © {new Date().getFullYear()} ZTruyen
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
