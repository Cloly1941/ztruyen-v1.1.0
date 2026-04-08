'use client'

// ** Next
import Link from "next/link";

// ** Component
import AccountMenu from "@/layouts/components/Header/AccountMenu";

// ** Hooks
import {useAuth} from "@/hooks/common/useAuth";
import AvatarSkeleton from "@/skeletons/layouts/AvatarSkeleton";

const ClientAuth = () => {

    const { isLogin, loading } = useAuth();

    if (loading) return <AvatarSkeleton/>;

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