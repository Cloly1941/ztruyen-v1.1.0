// ** Next
import Link from "next/link";
import type { Metadata } from "next"

// ** Components
import Button from "@/components/common/Button";

// ** Module
import AccountWrapper from "@/modules/tai-khoan/AccountWrapper";

// ** Icons
import {UserPen} from "lucide-react";

// ** Module Components
import AvatarHome from "@/modules/tai-khoan/trang-chu/AvatarHome";

export const metadata: Metadata = {
    title: "Trang chủ tài khoản",
    description: "Quản lý thông tin và cài đặt tài khoản cá nhân",
}

const HomeAccount = () => {

    return (
        <AccountWrapper>
            <section className='py-5'>
                <div className='flex justify-between items-center'>
                    <AvatarHome />
                    <Link href='/tai-khoan/thong-tin-ca-nhan'>
                        <Button size='icon-sm' variant='outline'>
                            <UserPen/>
                        </Button>
                    </Link>
                </div>
            </section>
        </AccountWrapper>
    );
}

export default HomeAccount;