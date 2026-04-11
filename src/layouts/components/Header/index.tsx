// ** React
import {ReactNode} from 'react';

// ** Components
import {ModeToggle} from '@/components/common/ModeToggle';
import Button from '@/components/common/Button';
import Logo from '@/components/common/Logo';

// ** Layout Components
import NavHeader from '@/layouts/components/Header/NavHeader';
import NavHeaderMobile from '@/layouts/components/Header/NavHeaderMobile';
import ReadingHistoryBtn from "@/layouts/components/Header/ReadingHistoryBtn";

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

// ** Layout components
import ClientAuth from "@/layouts/components/Header/ClientAuth";
import Notification from "@/layouts/components/Header/Notification";
import SearchWrapper from "@/layouts/components/Header/Search/SearchWrapper";


const Header = async ({asChild = false}: {
    asChild?: boolean;
    children?: ReactNode;
}) => {

    return (
        <header
            className="shadow-layout z-40 fixed left-0 top-0 right-0 bg-background h-header flex justify-center items-center">
            <nav className="container flex justify-between items-center py-2.5 font-medium text-header">

                <div className="flex items-center gap-10">
                    <Logo/>
                    {!asChild && <NavHeader/>}
                </div>
                <div className="flex items-center gap-2">
                    <SearchWrapper/>
                    <ReadingHistoryBtn/>
                    <div className="hidden xl:block">
                        <ModeToggle/>
                    </div>

                    <Notification/>

                    <ClientAuth/>

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