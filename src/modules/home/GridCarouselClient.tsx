'use client';

// ** Next
import Link from 'next/link';

// ** React
import {useRef} from 'react';

// ** Swiper
import {Swiper, SwiperSlide} from 'swiper/react';
import {Swiper as SwiperType} from 'swiper';
import {Autoplay, Pagination} from 'swiper/modules';

// ** Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

// ** Components
import ComicImage from '@/components/common/ComicImage';

// ** Shadcn ui
import Button from '@/components/common/Button';

// ** utils
import chunkArray from '@/utils/chunkArray';

// ** skeleton
import GridCarouselSkeleton from "@/skeletons/home/GridCarouselSkeleton";

// ** Lucide Icon
import {ChevronLeft, ChevronRight} from 'lucide-react';

// ** Types
import {IOtruyenListComic} from "@/types/api.otruyen";

// ** Hook
import useMounted from "@/hooks/common/useMounted";

// ** Configs
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_SLUG} from "@/configs/slug";

type TGridCarouselClientProps = {
    data: IOtruyenListComic[];
}

const GridCarouselClient = ({data}: TGridCarouselClientProps) => {
    const swiperRef = useRef<SwiperType | null>(null);

    const isMounted = useMounted();

    if (!isMounted) {
        return <GridCarouselSkeleton/>
    }

    const groupedData = chunkArray(data, 8);

    return (
        <div className="bg-black relative py-2">
            <Swiper
                breakpoints={{
                    0: {slidesPerView: 1},
                    768: {slidesPerView: 1.5},
                }}
                pagination={{clickable: true}}
                spaceBetween={6}
                loop={true}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                modules={[Autoplay, Pagination]}
            >
                {groupedData.map((group, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                        <div className='md:size-full'>
                            <div
                                className="grid grid-cols-7 grid-rows-6 gap-0.5 sm:gap-1.5"
                                style={{
                                    willChange: 'auto',
                                    transform: 'translateZ(0)',
                                }}
                            >
                                {group.map((item, index) => {
                                    const gridPositions = [
                                        {className: 'col-span-2 row-span-6'},
                                        {className: 'row-span-3 col-start-3'},
                                        {
                                            className:
                                                'row-span-3 col-start-3 row-start-4',
                                        },
                                        {
                                            className:
                                                'row-span-3 col-start-6 row-start-1',
                                        },
                                        {
                                            className:
                                                'row-span-3 col-start-6 row-start-4',
                                        },
                                        {
                                            className:
                                                'col-span-2 row-span-6 col-start-4 row-start-1',
                                        },
                                        {
                                            className:
                                                'row-span-3 col-start-7 row-start-1',
                                        },
                                        {
                                            className:
                                                'row-span-3 col-start-7 row-start-4',
                                        },
                                    ];

                                    const position = gridPositions[index];
                                    return (
                                        <div
                                            key={index}
                                            className={`${position?.className} relative`}
                                        >
                                            <Link
                                                href={`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`}
                                                className='block'
                                            >
                                                <ComicImage
                                                    src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.thumb_url}`}
                                                    alt={item.name}
                                                    title={item.name}
                                                    priority={
                                                        slideIndex <= 1 &&
                                                        index <= 2
                                                    }
                                                    loading={
                                                        slideIndex <= 1
                                                            ? 'eager'
                                                            : 'lazy'
                                                    }
                                                    rounded='sm'
                                                    size='full'
                                                    imgSize='lg'
                                                />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Bg btn left right*/}
            <div className="bg-grid-carousel left-0"/>
            <div className="bg-grid-carousel right-0 transform scale-x-[-1]"/>

            {/* Btn left right*/}
            <Button
                shape='verticalRectangle'
                className="btn-grid-carousel left-12  lg:left-[100px]"
                onClick={() => swiperRef.current?.slidePrev()}
            >
                <ChevronLeft className="text-white/60"/>
            </Button>
            <Button
                shape='verticalRectangle'
                className="btn-grid-carousel right-12  lg:right-[100px]"
                onClick={() => swiperRef.current?.slideNext()}
            >
                <ChevronRight className="text-white/60"/>
            </Button>
        </div>
    );
};

export default GridCarouselClient;
