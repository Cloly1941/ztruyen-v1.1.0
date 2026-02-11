// ** Icon
import {CircleUser, Heart, Home, User} from "lucide-react";

export const navAccount: TLinkWithIcon[] = [
    {
        title: 'Trang chủ tài khoản',
        href: '/tai-khoan/trang-chu',
        icon: Home,
    },
    {
        title: 'Thông tin của tôi',
        href: '/tai-khoan/thong-tin-ca-nhan',
        icon: User,
    },
    {
        title: 'Ảnh đại diện',
        href: '/tai-khoan/anh-dai-dien',
        icon: CircleUser,
    },
    {
        title: 'Truyện yêu thích',
        href: '/tai-khoan/truyen-yeu-thich',
        icon: Heart,
    }
]