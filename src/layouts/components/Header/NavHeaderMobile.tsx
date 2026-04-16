'use client';

// ** Next
import Link from 'next/link';
import {usePathname} from 'next/navigation';

// ** React
import {useEffect, useState} from "react";

// ** Components
import Button from "@/components/common/Button";
import {ModeToggle} from "@/components/common/ModeToggle";
import Logo from "@/components/common/Logo";

// ** Layout component
import Search from "@/layouts/components/Header/Search";

// ** Shadcn ui
import {Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger} from '@/components/ui/sheet';

// ** utils
import removeExtension from '@/utils/removeExtension';

// ** Configs
import {navHeader} from "@/configs/header";

// ** Hooks
import {useAuth} from "@/hooks/common/useAuth";
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";

// ** Icon
import {Menu} from "lucide-react";

const NavHeaderMobile = () => {
    const path = usePathname();

    const [open, setOpen] = useState(false);

    const {isSm} = useTailwindBreakpoints()
    const {isLogin} = useAuth();

    const pathGenre = path.startsWith('/the-loai');
    const pathTopTuan = path.startsWith('/top-tuan');

    useEffect(() => {
        setOpen(false);
    }, [path]);

    return (
        <div className="xl:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="cursor-pointer">
                    <Button variant="ghost">
                        <Menu className="size-4"/>
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="left"
                    data-hide-close
                    className="w-[255px] p-6"
                >
                    <ul className="text-sm flex flex-col gap-1.5">
                        <SheetTitle asChild={true}>
                            <li className="mb-3 flex justify-between">
                                <SheetClose asChild>
                                    <Logo/>
                                </SheetClose>
                                <ModeToggle/>
                            </li>
                        </SheetTitle>
                        {navHeader.map((nav) => {
                            const isGenre = pathGenre && nav.title === 'Thể loại';
                            const isTop = pathTopTuan && nav.title === 'Top tuần';

                            const isSamePath =
                                removeExtension(path, '.html') ===
                                removeExtension(nav.href, '.html');

                            const isActive = isGenre || isTop || isSamePath;

                            const Icon = nav.icon;

                            return (
                                <SheetTitle asChild key={nav.href}>
                                    <li className="rounded-md">
                                        <Link
                                            href={nav.href}
                                            className={`hover:text-primary py-2 pl-3 flex items-center gap-2
                                    ${isActive ? 'text-primary' : ''}
                                    `}
                                        >
                                            {Icon && <Icon className="size-4"/>}
                                            <span>{nav.title}</span>
                                        </Link>
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
                                <Button width='full' sizeCustom='xs'>
                                    Đăng nhập ngay ~
                                </Button>
                            </Link>
                        )}
                    </ul>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default NavHeaderMobile;