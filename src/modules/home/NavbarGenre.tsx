// ** Next
import Link from 'next/link';

// ** Component
import ErrorText from "@/components/common/ErrorText";

// ** Service
import {getListGenre} from "@/services/api-otruyen/categories";

const NavbarGenre = async () => {

    const res = await getListGenre();

    const listGenre = res.data?.items;

    if (!listGenre) return <ErrorText/>;

    return (
        <nav className="flex justify-center py-3.5 sm:py-5 bg-black/90 text-white font-ui">
            <ul className="flex sm:gap-7 gap-5 text-xs lg:text-sm container justify-center">
                {listGenre.slice(0, 8).map((item, index) => (
                    <li
                        key={index}
                        className={`${
                            index + 1 === 7 || index + 1 === 8
                                ? 'hidden lg:block'
                                : index + 1 === 5 || index + 1 === 6
                                  ? 'hidden sm:block'
                                  : 'block'
                        }`}
                    >
                        <Link href={`/the-loai/${item.slug}.html`}>
                            {item.name}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link href={`/the-loai/tat-ca.html`}>Tất cả</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavbarGenre;
