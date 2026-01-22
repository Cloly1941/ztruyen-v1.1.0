// ** Components
import Tag from "@/components/common/Tag";
import Logo from "@/components/common/Logo";

// ** Configs
import {tagsFooter} from "@/configs/footer";

const Footer = () => {
    return (
        <footer className="w-full">
            <div className="bg-[#212121] pt-10 pb-5 shadow-footer">
                <div className="container text-white/70">
                    <div className="flex justify-between items-center gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                            <div>
                                <Logo size='lg'/>
                            </div>
                            <ul className="flex flex-wrap gap-2">
                                {tagsFooter.map((tag) => (
                                    <Tag
                                        key={tag?.title}
                                        href={tag?.href}
                                        theme="dark"
                                    >
                                        {tag?.title}
                                    </Tag>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-1.5">
                        <h3 className="font-bold md:text-base">
                            Miễn trừ trách nhiệm
                        </h3>
                        <p className="mt-0.5 text-sm">
                            Ztruyen chỉ cung cấp giao diện và tổng hợp dữ liệu từ Otruyen
                            chúng tôi không lưu trữ hay sở hữu nội dung. Thông tin chỉ mang tính tham khảo,
                            chúng tôi <b> không chịu trách nhiệm </b> về độ chính xác,
                            liên kết ngoài hoặc nội dung do bên thứ ba cung cấp.
                        </p>
                    </div>
                    <p className="mt-5 text-sm md:text-base font-bold">
                        Copyright @ {new Date().getFullYear()} Ztruyen
                    </p>
                </div>
            </div>
        </footer>
    );
};
export default Footer;