'use client';

// ** Next
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ** utils
import removeExtension from '@/utils/removeExtension';

// ** Configs
import {navHeader} from "@/configs/header";

const NavHeader = () => {
    const path = usePathname();

    const pathGenre = path.startsWith('/the-loai');
    const pathTopTuan = path.startsWith('/top-tuan');

    return (
        <ul className="hidden xl:flex items-center gap-[25px]">
            {navHeader.map((nav) => {

                const isGenre = pathGenre && nav.title === 'Thể loại';
                const isTop = pathTopTuan && nav.title === 'Top tuần';

                const isSamePath =
                    removeExtension(path, '.html') ===
                    removeExtension(nav.href, '.html');

                const isActive = isGenre || isTop || isSamePath;

                return (
                    <li key={nav.href}>
                        <Link
                            href={nav.href}
                            className={`hover:text-primary ${isActive ? 'text-primary' : ''}`}
                        >
                            {nav.title}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default NavHeader