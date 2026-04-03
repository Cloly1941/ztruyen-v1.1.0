// ** Next
import Link from 'next/link';

// ** Components
import Tag from '@/components/common/Tag';
import Logo from '@/components/common/Logo';
import InstallPWAButton from '@/components/common/InstallPWAButton';

// ** Configs
import { tagsFooter } from '@/configs/footer';

const Footer = () => {
    return (
        <footer className="w-full">
            <div className="bg-[#212121] pt-10 pb-5 shadow-layout border-t border-[#3a3a3a]">
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
                                ZTruyen chỉ cung cấp giao diện và tổng hợp dữ
                                liệu từ
                                <strong className="mx-1 text-white/70">
                                    OTruyen
                                </strong>
                                . Chúng tôi không lưu trữ hoặc sở hữu nội dung
                                truyện. Thông tin hiển thị chỉ mang tính tham
                                khảo và
                                <strong className="mx-1 text-white/70">
                                    không chịu trách nhiệm
                                </strong>
                                về độ chính xác, liên kết ngoài hoặc nội dung do
                                bên thứ ba cung cấp.
                            </p>
                        </div>

                        <div className="border-t border-white/10" />

                        {/* Bottom */}
                        <div className="flex flex-wrap items-center justify-between gap-y-3 text-sm">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                                <Link
                                    href="/thoa-thuan-nguoi-dung"
                                    target="_blank"
                                    className="hover:text-white/80 transition-colors"
                                >
                                    Thỏa thuận người dùng
                                </Link>
                                <span className="text-white/20">|</span>
                                <Link
                                    href="/chinh-sach-bao-mat"
                                    target="_blank"
                                    className="hover:text-white/80 transition-colors"
                                >
                                    Chính sách bảo mật
                                </Link>
                                <InstallPWAButton />
                            </div>

                            <p className="text-sm font-medium">
                                © {new Date().getFullYear()} ZTruyen
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
