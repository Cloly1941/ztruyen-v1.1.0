// ** Next
import Link from "next/link";
import {Metadata} from "next";

// ** Lucide Icon
import {Home} from "lucide-react";

// ** Components
import AuthFooter from "@/components/auth/AuthFooter";
import HandleSocialToken from "@/components/auth/HandleSocialToken";
import GuestGuard from "@/components/guards/GuestGuard";
import {ListenOAuthMessage} from "@/components/auth/ListenOAuthMessage";

// ** Modules
import FormRegister from "@/modules/dang-ky/FormRegister";

export const metadata: Metadata = {
    title: 'Đăng ký - ZTruyen',
    description:
        'Đăng ký tài khoản ZTruyen để theo dõi truyện yêu thích, lưu lịch sử đọc và đồng bộ dữ liệu trên mọi thiết bị.',
    alternates: {
        canonical: 'https://ztruyen.io.vn/dang-ky',
    },
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: 'Đăng ký - ZTruyen',
        description:
            'Tạo tài khoản ZTruyen miễn phí để đọc truyện online, lưu tiến độ và nhận thông báo truyện mới.',
        url: 'https://ztruyen.io.vn/dang-ky',
        siteName: 'ZTruyen',
        images: [
            {
                url: '/og-ztruyen.png',
                width: 1200,
                height: 630,
                alt: 'ZTruyen - Đọc truyện online',
            },
        ],
    },
};

type TRegisterSearchParams = { token?: string }

const Register = async ({searchParams}: { searchParams: Promise<TRegisterSearchParams> }) => {

    const {token} = await searchParams

    return (
        <GuestGuard>
            <div className='bg-auth flex justify-center items-center p-10 bg-black/40 dark:bg-white/40'>
                <HandleSocialToken token={token}/>
                <ListenOAuthMessage/>
                <div>
                    <div className='flex justify-center mb-5'>
                        <Link href='/' className='hover:scale-105'>
                            <Home className='text-white size-6'/>
                        </Link>
                    </div>
                    <div
                        className='bg-background rounded-lg pt-12 pb-8 px-8 sm:px-14 lg:px-16 flex flex-col justify-center items-center'>
                        <h1 className='text-primary capitalize font-semibold text-base lg:text-lg dark:text-white'>Đăng
                            ký</h1>
                        <FormRegister/>
                        <AuthFooter/>
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Đã có tài khoản?
                            <Link
                                href="/dang-nhap"
                                className="font-medium text-primary hover:underline transition ml-1"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestGuard>
    )
}

export default Register