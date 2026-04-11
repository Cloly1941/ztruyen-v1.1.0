'use client';

// ** Next
import Link from 'next/link';
import {usePathname} from 'next/navigation';

// ** Components
import Button from "@/components/common/Button";

// ** Shadcn ui
import {SheetClose, SheetTitle} from '@/components/ui/sheet';

// ** utils
import removeExtension from '@/utils/removeExtension';

// ** Configs
import {navHeader} from "@/configs/header";

// ** Hooks
import {useAuth} from "@/hooks/common/useAuth";
import Search from "@/layouts/components/Header/Search";
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";

const NavHeaderMobile = () => {
    const path = usePathname();

    const {isSm} = useTailwindBreakpoints()

    const pathGenre = path.startsWith('/the-loai');

    const {isLogin, loading} = useAuth();

    if (loading) return null;

    return (
        <>
            {navHeader.map((nav) => {
                const isActive =
                    pathGenre && nav.title === 'Thể loại'
                        ? true
                        : removeExtension(path, '.html') ===
                        removeExtension(nav.href, '.html');

                const Icon = nav.icon;

                return (
                    <SheetTitle asChild={true} key={nav.href}>
                        <li className="rounded-md">
                            <SheetClose asChild>
                                <Link
                                    href={nav.href}
                                    target={nav.title === 'Fanpage' ? '_blank' : undefined}
                                    className={`hover:text-primary py-2 pl-3 flex items-center gap-2
                                    ${isActive ? 'text-primary' : ''}
                                    `}
                                >
                                    {Icon && <Icon className="size-4"/>}
                                    <span>{nav.title}</span>
                                </Link>
                            </SheetClose>
                        </li>
                    </SheetTitle>
                );
            })}
            {!isSm && (
                <SheetTitle>
                    <li>
                        <Search isSheet/>
                    </li>
                </SheetTitle>
            )}
            {!isLogin && (
                <Link href='/dang-nhap' className='mt-4'>
                    <Button width='full' sizeCustom='xs'>Đăng nhập ngay ~</Button>
                </Link>
            )}
        </>
    );
};

export default NavHeaderMobile;