// ** React
import {ReactNode} from 'react';

// ** Next
import Link from "next/link";

// ** Components
import {ModeToggle} from '@/components/common/ModeToggle';
import Button from '@/components/common/Button';
import ReadingHistoryBtn from "@/layouts/components/Header/ReadingHistoryBtn";

// ** Layout Components
import Search from '@/layouts/components/Header/Search';
import NavHeader from '@/layouts/components/Header/NavHeader';
import NavHeaderMobile from '@/layouts/components/Header/NavHeaderMobile';

// ** Components
import Logo from '@/components/common/Logo';

// ** Shadcn ui
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

// ** Lucide Icon
import {Menu} from 'lucide-react';

const Header = ({
                    asChild = false,
                    children,
                }: {
    asChild?: boolean;
    children?: ReactNode;
}) => {
    return (
        <header className="shadow-layout z-40 fixed left-0 top-0 right-0 bg-background">
            <nav className="container flex justify-between items-center py-2.5 font-medium text-header">
                <div className="flex items-center gap-10">
                    <Logo/>
                    {!asChild && <NavHeader/>}
                </div>
                {children}
                <div className="flex items-center gap-2">
                    {!asChild && <Search/>}
                    <ReadingHistoryBtn/>
                    <div className="hidden xl:block">
                        <ModeToggle/>
                    </div>
                    <Link href='/dang-nhap' className='text-header hidden xl:block'>Đăng nhập</Link>
                    <div className="xl:hidden">
                        <Sheet>
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
                                    <NavHeaderMobile/>
                                </ul>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;