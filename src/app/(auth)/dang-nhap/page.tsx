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
import FormLogin from "@/modules/dang-nhap/FormLogin";

export const metadata: Metadata = {
    title: 'Đăng nhập - ZTruyen',
    description:
        'Đăng nhập ZTruyen để theo dõi truyện yêu thích, quản lý lịch sử đọc và đồng bộ tài khoản trên mọi thiết bị.',
    alternates: {
        canonical: 'https://ztruyen.io.vn/dang-nhap',
    },
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: 'Đăng nhập - ZTruyen',
        description:
            'Truy cập tài khoản ZTruyen an toàn để đọc truyện, lưu tiến độ và nhận cập nhật mới nhất.',
        url: 'https://ztruyen.io.vn/dang-nhap',
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

type TLoginSearchParams = { token?: string }

const Login = async ({searchParams}: { searchParams: Promise<TLoginSearchParams> }) => {

    const { token } = await searchParams

    return (
        <GuestGuard>
            <div className='bg-auth flex justify-center items-center p-10 bg-black/40 dark:bg-white/40'>
                <HandleSocialToken token={token} />
                <ListenOAuthMessage/>
                <div>
                    <div className='flex justify-center mb-5'>
                        <Link href='/' className='hover:scale-105'>
                            <Home className='text-white size-6'/>
                        </Link>
                    </div>
                    <div
                        className='bg-background rounded-lg pt-12 pb-8 px-8 sm:px-14 lg:px-16 flex flex-col justify-center items-center'>
                        <h1 className='text-primary capitalize font-semibold text-base lg:text-lg dark:text-white'>Đăng nhập</h1>
                        <FormLogin/>
                        <AuthFooter/>
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Chưa có tài khoản?
                            <Link
                                href="/dang-ky"
                                className="font-medium text-primary hover:underline transition ml-1"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestGuard>
    )
}

export default Login