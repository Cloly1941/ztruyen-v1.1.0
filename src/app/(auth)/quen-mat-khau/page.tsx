// ** Next
import Link from "next/link";
import type { Metadata } from 'next'

// ** Shadcn ui
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// ** Layout
import DefaultLayout from "@/layouts/DefaultLayout";

// ** Module
import FormSendMail from "@/modules/quen-mat-khau/FormSendMail";
import FormChangePassword from "@/modules/quen-mat-khau/FormChangePassword";

export const metadata: Metadata = {
    title: 'Quên mật khẩu - ZTruyen',
    description:
        'Khôi phục mật khẩu tài khoản ZTruyen. Nhập email đã đăng ký để nhận link đặt lại mật khẩu an toàn.',
    alternates: {
        canonical: 'https://ztruyen.io.vn/quen-mat-khau',
    },
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: 'Quên mật khẩu - ZTruyen',
        description:
            'Khôi phục quyền truy cập tài khoản ZTruyen bằng cách đặt lại mật khẩu an toàn.',
        url: 'https://ztruyen.io.vn/quen-mat-khau',
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
}


type TForgotPasswordSearchParams = { token?: string }

const ForgotPassword = async ({searchParams}: { searchParams: Promise<TForgotPasswordSearchParams> }) => {

    const { token } = await searchParams

    return (
        <DefaultLayout>
            {/* Breadcrumb*/}
            <div className="container mt-[52px]">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href='/dang-nhap'>Đăng nhập</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='text-primary'/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Quên mật khẩu</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='flex justify-center items-center mt-10'>
                    <div className='w-[400px]'>
                        {
                            token ? <FormChangePassword token={token}/> : <FormSendMail/>
                        }
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}


export default ForgotPassword