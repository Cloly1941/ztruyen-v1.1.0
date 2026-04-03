'use client'

// ** Next
import Link from "next/link";

// ** Component
import AccountMenu from "@/layouts/components/Header/AccountMenu";

// ** Lib
import {getAccessToken} from "@/lib/localStorage";

const ClientAuth = () => {

    const isLogin = getAccessToken()

    return (
        <>
            {isLogin ? (
                <AccountMenu/>
            ) : (
                <Link href='/dang-nhap' className='text-header hidden xl:block'>Đăng nhập</Link>
            )}
        </>
    )
}

export default ClientAuth;