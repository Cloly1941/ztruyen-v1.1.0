'use client'

// ** Next
import Link from "next/link";
import Image from "next/image";

// ** Configs
import {CONFIG_API} from "@/configs/api";

type TProvider = 'google' | 'facebook'

const AuthFooter = () => {

    const loginSocialUrl = (provider: TProvider) => {
        const url =
            provider === 'google'
                ? CONFIG_API.AUTH.GOOGLE
                : CONFIG_API.AUTH.FACEBOOK

        const width = 500
        const height = 600

        const left = Math.round((window.screen.width - width) / 2)
        const top = Math.round((window.screen.height - height) / 2)

        window.open(
            url,
            'oauth-popup',
            `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`
        )
    }

    return (
        <div className='flex flex-col items-center mt-6 text-zinc-400 text-sm'>
            <span>Các phương thức đăng nhập khác</span>
            <div className='flex flex-col sm:flex-row gap-5 sm:gap-7 my-5 sm:my-3 justify-between'>
                <div className='flex gap-2 items-center cursor-pointer' onClick={() => loginSocialUrl('google')}>
                    <Image src='/google-icon.png' alt='Đăng nhập với Google' width={24} height={24}/>
                    Đăng nhập Google
                </div>
                <div className='flex gap-2 items-center cursor-pointer' onClick={() => loginSocialUrl('facebook')}>
                    <Image src='/facebook-icon.png' alt='Đăng nhập với Google' width={24} height={24}/>
                    Đăng nhập Facebook
                </div>
            </div>
            <span className='text-center w-full md:w-[400px]'>Bằng cách đăng nhập hay hoàn tất đăng ký, bạn đã đồng ý với
                <Link className='text-primary' href='thoa-thuan-nguoi-dung'> Thoả thuận người dùng </Link>
                và
                <Link className='text-primary' href='chinh-sach-bao-mat'> Chính sách bảo mât.</Link>
            </span>
        </div>
    )
}

export default AuthFooter