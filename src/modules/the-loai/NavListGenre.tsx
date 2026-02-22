'use client'

// ** React
import {useLayoutEffect, useRef} from 'react';

// ** Hooks
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";

// ** Next
import Link from 'next/link';

// ** Type
import {IOtruyenListGenre} from "@/types/api.otruyen";
import {CONFIG_SLUG} from "@/configs/slug";

interface INavListGenreProps {
    listGenre: IOtruyenListGenre[],
    slug: string
}

const NavListGenre = ({listGenre, slug}: INavListGenreProps) => {

    const activeRef = useRef<HTMLAnchorElement | null>(null);
    const {isSm} = useTailwindBreakpoints();

    useLayoutEffect(() => {
        if (!isSm && activeRef.current) {
            const parent = activeRef.current.closest("ul");
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const itemRect = activeRef.current.getBoundingClientRect();

                parent.scrollTop += itemRect.top - parentRect.top + 4;
            }
        }
    }, [slug, isSm]);

    return (
        <ul className="flex flex-wrap gap-2 text-sm h-[122px] sm:h-auto overflow-y-auto sm:overflow-visible custom-scroll">
            {listGenre.map((item, index) => (
                <li key={index}>
                    {item.slug === slug ? (
                        <h1>
                            <Link
                                ref={activeRef}
                                href={`/${CONFIG_SLUG.GENRE}/${item.slug}.html`}
                                className={`active:text-primary rounded-[5px] px-[10px] py-1.5 ${item.slug === slug && 'text-primary'}`}
                            >
                                {item.name}
                            </Link>
                        </h1>
                    ) : (
                        <h2>
                            <Link
                                href={`/${CONFIG_SLUG.GENRE}/${item.slug}.html`}
                                className={`active:text-primary rounded-[5px] px-[10px] py-1.5 ${item.slug === slug ? 'text-primary' : ''}`}
                            >
                                {item.name}
                            </Link>
                        </h2>
                    )}
                </li>
            ))}
            <li>
                {'tat-ca' === slug ? (
                    <h1>
                        <Link
                            ref={activeRef}
                            href={`/${CONFIG_SLUG.GENRE}/tat-ca.html`}
                            className="active:text-primary rounded-[5px] px-[10px] py-1.5 text-primary"
                        >
                            Tất cả
                        </Link>
                    </h1>
                ) : (
                    <h2>
                        <Link
                            href={`/${CONFIG_SLUG.GENRE}/tat-ca.html`}
                            className="active:text-primary rounded-[5px] px-[10px] py-1.5"
                        >
                            Tất cả
                        </Link>
                    </h2>
                )}
            </li>
        </ul>
    )
}

export default NavListGenre