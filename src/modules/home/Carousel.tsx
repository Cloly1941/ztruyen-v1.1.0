'use client';

// ** Next
import Link from "next/link";

// ** React
import {useRef, useState} from 'react';

// ** Swiper
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination} from 'swiper/modules';
import {Swiper as SwiperType} from 'swiper';

// ** Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// ** Components
import Tag from "@/components/common/Tag";
import ComicImage from '@/components/common/ComicImage';
import Button from '@/components/common/Button';

// ** utils
import formatRelativeTime from '@/utils/formatRelativeTime';
import {buildReadingUrl} from "@/utils/buildReadingUrl ";

// ** next progress bar
import {useRouter} from 'next-nprogress-bar';

// ** Skeleton
import ListComicSkeleton from "@/skeletons/home/ListComicSkeleton";

// ** Lucide Icon
import {ChevronLeft, ChevronRight} from 'lucide-react';

// ** Types
import {IOtruyenListComic} from "@/types/api.otruyen";

// ** Configs
import {CONFIG_SLUG} from "@/configs/slug";
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";

// ** Hook
import useMounted from "@/hooks/common/useMounted";

const Carousel = ({
                      data,
                      title,
                      desc,
                      bgColor = false,
                  }: {
    data: IOtruyenListComic[];
    title: string;
    desc?: string;
    bgColor?: boolean;
}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const router = useRouter();

    const [atBeginning, setAtBeginning] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const isMounted = useMounted();

    if (!isMounted) {
        return <ListComicSkeleton/>;
    }

    // limit 20
    const displayData = data.slice(0, 20);

    return (
        <div
            className={`${bgColor ? 'bg-[#f6f9ff] dark:bg-black' : ''}`}>
            <section className='section-home'>
                <div className="section-header">
                    <h2 className="heading-home">
                        {title}
                    </h2>

                    <p className="desc">
                        {desc}
                    </p>
                </div>

                <div className="relative">
                    <Swiper
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        modules={[Autoplay, Pagination]}
                        onReachBeginning={() => setAtBeginning(true)}
                        onReachEnd={() => setAtEnd(true)}
                        onFromEdge={() => {
                            setAtBeginning(false);
                            setAtEnd(false);
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                                spaceBetween: 6,
                            },
                            640: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                                spaceBetween: 8,
                            },
                            768: {
                                slidesPerView: 4,
                                slidesPerGroup: 4,
                                spaceBetween: 10,
                            },
                            1024: {
                                slidesPerView: 5,
                                slidesPerGroup: 5,
                                spaceBetween: 12,
                            },
                        }}
                    >
                        {displayData.map((item, i) => (
                            <SwiperSlide key={i}>
                                <figure className="flex flex-col">
                                    <div
                                        className="relative overflow-hidden"
                                        title={item.name}
                                    >
                                        <div className='absolute top-2 left-2 z-10'>
                                            {
                                                item.chaptersLatest && (
                                                    <Tag
                                                        theme='dark'
                                                        href={buildReadingUrl(item.slug, item.chaptersLatest[0].chapter_name, item.chaptersLatest[0].chapter_api_data)}
                                                        title={`Chương mới nhất: ${item.chaptersLatest[0].chapter_name}`}
                                                    >
                                                        {`Chương ${item.chaptersLatest[0].chapter_name}`}
                                                    </Tag>
                                                )
                                            }
                                        </div>
                                        <ComicImage
                                            src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.thumb_url}`}
                                            alt={item.name}
                                            priority={i <= 0}
                                            rounded="md"
                                            size="full"
                                            imgSize="2xl"
                                        />
                                        <div
                                            className="absolute top-0 left-0 w-full h-full rounded-[8px] cursor-pointer"
                                            style={{
                                                background:
                                                    'linear-gradient(0deg,rgba(0,0,0,.8) -1.22%,transparent 35.07%)',
                                            }}
                                            onClick={() =>
                                                router.push(
                                                    `/${CONFIG_SLUG.DETAIL}/${item.slug}.html`
                                                )
                                            }
                                        />
                                        <ul className="absolute bottom-2.5 hidden sm:inline-flex gap-1 sm:gap-2 md:gap-2.5 lg:gap-3 items-center overflow-hidden px-2 sm:px-[12px]">
                                            {item.category
                                                ?.slice(0, 2)
                                                .map((tag, j) => (
                                                    <Tag
                                                        key={j}
                                                        href={`/${CONFIG_SLUG.GENRE}/${tag.slug}.html`}
                                                        title={tag.name}
                                                    >
                                                        {tag.name}
                                                    </Tag>
                                                ))}
                                        </ul>
                                    </div>
                                    <figcaption className="sm:w-[180px] flex flex-col justify-between">
                                        <Link href={`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`}
                                              className="mt-1.5 sm:mt-2.5 sm:mb-1 line-clamp-1 text-sm md:text-base">
                                            {item.name}
                                        </Link>
                                        <div
                                            className="text-[10px] sm:text-xs md:text-sm truncate"
                                            title={`Cập nhật ${formatRelativeTime(item.updatedAt)}`}
                                        >
                                            Cập nhật
                                            <span className="text-subtle ml-1 sm:ml-2">
                                                {formatRelativeTime(
                                                    item.updatedAt
                                                )}
                                            </span>
                                        </div>
                                    </figcaption>
                                </figure>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Prev button */}
                    <Button
                        shape='circle'
                        className={`btn-carousel -left-6 sm:-left-[34px] ${atBeginning ? 'hidden' : ''}`}
                        onClick={() => swiperRef.current?.slidePrev()}
                    >
                        <ChevronLeft className='size-6 sm:size-8 text-black'/>
                    </Button>

                    {/* Next button */}
                    <Button
                        shape='circle'
                        className={`btn-carousel -right-6 sm:-right-[34px] ${atEnd ? 'hidden' : ''}`}
                        onClick={() => swiperRef.current?.slideNext()}
                    >
                        <ChevronRight className='size-6 sm:size-8 text-black'/>
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Carousel;
