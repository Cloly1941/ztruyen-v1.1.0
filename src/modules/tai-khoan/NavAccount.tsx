'use client'

// ** Next
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

// ** Config
import {navAccount} from "@/configs/page";

// ** Hook
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Type
import {IUserProfile} from "@/types/api";

// ** Service
import {UserService} from "@/services/api/user";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";
import {useEffect} from "react";

const NavAccount = () => {

    const path = usePathname();
    const router = useRouter();

    const { data: user } = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
        revalidateIfStale: false,
    })

    const isLocalProvider = user?.provider === 'local';

    const filteredNav = navAccount.filter((nav) => {
        if (nav.href === '/tai-khoan/doi-mat-khau') return isLocalProvider;
        return true;
    });

    useEffect(() => {
        if (user && !isLocalProvider && path === '/tai-khoan/doi-mat-khau') {
            router.replace('/tai-khoan');
        }
    }, [user, isLocalProvider, path]);

    return (
        <nav className='bg-zinc-50 text-gray-400 border-b md:border-b-0 md:border-r dark:bg-zinc-800 dark:text-zinc-400'>
            <div className='px-4 py-3 text-center hidden md:block border-b dark:text-zinc-300'>Trung tâm cá nhân</div>
            <ul className='grid grid-flow-col md:grid-flow-row overflow-x-auto md:overflow-x-visible'>
                {filteredNav.map((nav) => {
                    const isActive = path === nav.href;
                    const Icon = nav.icon;
                    return (
                        <Link
                            key={nav.href}
                            href={nav.href}
                            className={`py-3 flex items-center justify-center sm:justify-start sm:px-4 gap-3 text-sm transition-colors
                                ${isActive ? 'bg-primary text-white' : 'hover:bg-slate-200 dark:hover:bg-zinc-800'}
                            `}
                        >
                            {Icon && <Icon className="size-4 sm:size-5"/>}
                            <span className={`${isActive ? '' : 'text-black dark:text-white'} hidden md:block`}>{nav.title}</span>
                        </Link>
                    )
                })}
            </ul>
        </nav>
    )
}

export default NavAccount