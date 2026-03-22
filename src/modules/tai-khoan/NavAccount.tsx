'use client'

// ** Next
import Link from "next/link";
import {usePathname} from "next/navigation";

// ** Config
import {navAccount} from "@/configs/page";

const NavAccount = () => {

    const path = usePathname();

    return (
        <nav className='bg-zinc-50 text-gray-400 border-b md:border-b-0 md:border-r dark:bg-zinc-800 dark:text-zinc-400'>
            <div className='px-4 py-3 text-center hidden md:block border-b  dark:text-zinc-300'>Trung tâm cá nhân</div>
            <ul className='flex flex-row md:flex-col justify-center'>
                {navAccount.map((nav) => {
                    const isActive = path === nav.href;
                    const Icon = nav.icon;
                    return (
                        (
                            <Link
                                key={nav.href}
                                href={nav.href}
                                className={`px-4 py-3 flex items-center gap-3 text-sm transition-colors
                                    ${isActive ? 'bg-primary text-white' : 'hover:bg-slate-200 dark:hover:bg-zinc-800'}
                                    `}
                            >
                                {Icon && <Icon className="size-4 sm:size-5"/>}
                                <span className={`${isActive ? '': 'text-black dark:text-white'} hidden md:block`}>{nav.title}</span>
                            </Link>
                        )
                    )
                })}
            </ul>
        </nav>
    )
}

export default NavAccount