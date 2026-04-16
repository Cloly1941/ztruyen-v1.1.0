// ** Components
import {ModeToggle} from '@/components/common/ModeToggle';
import Logo from '@/components/common/Logo';

// ** Layout Components
import NavHeader from '@/layouts/components/Header/NavHeader';
import NavHeaderMobile from '@/layouts/components/Header/NavHeaderMobile';
import ReadingHistoryBtn from "@/layouts/components/Header/ReadingHistoryBtn";

// ** Layout components
import ClientAuth from "@/layouts/components/Header/ClientAuth";
import Notification from "@/layouts/components/Header/Notification";
import Search from "@/layouts/components/Header/Search";


const Header = async ({asChild = false}: { asChild?: boolean}) => {

    return (
        <header
            className="shadow-layout z-40 fixed left-0 top-0 right-0 bg-background h-header flex justify-center items-center">
            <nav className="container flex justify-between items-center py-2.5 font-medium text-header">

                <div className="flex items-center gap-10">
                    <Logo/>
                    {!asChild && <NavHeader/>}
                </div>
                <div className="flex items-center gap-2">
                    <div className='hidden sm:block'>
                        <Search/>
                    </div>
                    <ReadingHistoryBtn/>
                    <div className="hidden xl:block">
                        <ModeToggle/>
                    </div>

                    <Notification/>

                    <ClientAuth/>

                    <NavHeaderMobile/>
                </div>
            </nav>
        </header>
    );
};

export default Header;