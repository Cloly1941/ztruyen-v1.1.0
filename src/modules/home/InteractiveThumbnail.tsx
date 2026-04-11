'use client';

// ** React
import { useEffect, useRef, useState } from 'react';

// ** Next
import Link from 'next/link';

// ** Hooks
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";

// ** Components
import Tag from '@/components/common/Tag';
import ComicImage from '@/components/common/ComicImage';
import Button from '@/components/common/Button';

// ** Configs
import { CONFIG_API_OTRUYEN } from "@/configs/api-otruyen";
import {CONFIG_SLUG} from "@/configs/slug";

// ** Types
import { IOtruyenListComic } from "@/types/api.otruyen";

const AUTO_SLIDE_TIME = 4500;

const InteractiveThumbnail = ({ listRecommendedComic }: { listRecommendedComic: IOtruyenListComic[] }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { isSm, isLg } = useTailwindBreakpoints();

    const numberOfItems = isSm ? 7 : 5;

    const visibleComics = listRecommendedComic.slice(0, numberOfItems);
    const selectedComic = visibleComics[selectedIndex];

    const resetAutoSlide = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setSelectedIndex((prev) =>
                prev + 1 >= visibleComics.length ? 0 : prev + 1
            );
        }, AUTO_SLIDE_TIME);
    };

    const handleImageClick = (index: number) => {
        setSelectedIndex(index);
        resetAutoSlide();
    };

    useEffect(() => {
        setSelectedIndex(0);
        resetAutoSlide();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [visibleComics.length]);

    return (
        <figure
            className="rounded-2xl bg-black p-6 flex flex-col justify-between text-white relative h-[280px] sm:h-[300px]"
            style={{
                backgroundImage: `url(${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${selectedComic.thumb_url})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#1b2022f2] dark:bg-black/90 rounded-xl" />

            {/* Info */}
            <div className="z-10 w-full lg:w-[49%]">
                <figcaption title={selectedComic.name}>
                    {!isLg ? (
                        <Link
                            title={selectedComic.name}
                            href={`/${CONFIG_SLUG.DETAIL}/${selectedComic.slug}.html`}
                            className="lg:text-2xl line-clamp-2"
                        >
                            {selectedComic.name}
                        </Link>
                    ) : (
                        <h3 className="lg:text-2xl line-clamp-2">
                            {selectedComic.name}
                        </h3>
                    )}
                </figcaption>

                <ul className="flex gap-1 sm:gap-2 md:gap-2.5 lg:gap-3 items-center overflow-hidden mt-5">
                    {selectedComic.category.slice(0, 5).map((tag, index) => (
                        <Tag
                            key={`${index}-${tag._id}-thumbnail`}
                            href={`/${CONFIG_SLUG.GENRE}/${tag.slug}.html`}
                            title={tag.name}
                            theme="gray"
                        >
                            {tag.name}
                        </Tag>
                    ))}
                </ul>
            </div>

            <div className="h-[1px] bg-gray-500 w-full lg:w-[49%] z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end z-10">
                {/* Thumbnails */}
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-3 mb-4 mt-4 sm:mt-0">
                    {visibleComics.map((item, index) => (
                        <div
                            key={`${item._id}-thumbnail`}
                            className={`aspect-[3/4] rounded-[5px] overflow-hidden cursor-pointer transform transition-all duration-300 ${
                                selectedIndex === index
                                    ? 'scale-[1.15] border border-white'
                                    : 'opacity-80 hover:opacity-100'
                            }`}
                            onClick={() => handleImageClick(index)}
                        >
                            <ComicImage
                                src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.thumb_url}`}
                                alt={item.name}
                                title={item.name}
                                size="full"
                            />
                        </div>
                    ))}
                </div>

                <Link
                    href={`/${CONFIG_SLUG.DETAIL}/${selectedComic.slug}.html`}
                    className="hidden lg:block rounded-2xl overflow-hidden aspect-video absolute top-4 right-6 sm:-top-8 w-[45%]"
                >
                    <ComicImage
                        src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${selectedComic.thumb_url}`}
                        alt={selectedComic.name}
                        title={selectedComic.name}
                        size="full"
                    />
                    <Button
                        shape="pill"
                        sizeCustom="xs"
                        className="absolute right-6 bottom-4 hover:scale-105 transition bg-black/60 text-white hover:bg-black/80"
                    >
                        Đọc ngay
                    </Button>
                </Link>
            </div>
        </figure>
    );
};

export default InteractiveThumbnail;
