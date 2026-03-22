// ** Next
import type {Metadata} from "next"

// ** Module Components
import AvatarHome from "@/modules/tai-khoan/home/AvatarHome";

export const metadata: Metadata = {
    title: "Trang chủ tài khoản",
    description: "Quản lý thông tin và cài đặt tài khoản cá nhân",
}

const HomeAccount = () => {

    return (
        <>
            <section className='py-5'>
                <AvatarHome/>
            </section>
        </>
    );
}

export default HomeAccount;