'use client'

// ** Next
import Link from "next/link";
import Image from "next/image";

// ** React
import {useEffect, useRef, useState} from "react";

// ** Components
import Button from "@/components/common/Button";

// ** Module components
import Overlay from "@/modules/doc-truyen/Overlay";
import OverlaySettings from "@/modules/doc-truyen/OverlaySettings";
import ImageSaver from "@/modules/doc-truyen/ImageSaver";

// ** Hooks
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";
import useBannerMode from "@/hooks/common/useBannerMode";

// ** Types
import {IOtruyenDetailComic, TOtruyenChapter, TOtruyenChapterImage} from "@/types/api.otruyen";

// ** Config
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_IMAGE} from "@/configs/image";
import {CONFIG_IMG} from "@/configs/img";

// ** Util
import {buildReadingUrl} from "@/utils/buildReadingUrl ";

// ** Icon
import {SettingsIcon} from "lucide-react";

type TListImageChapter = {
    listImageChapter: TOtruyenChapterImage[]
    nextChapter: TOtruyenChapter
    prevChapter: TOtruyenChapter
    currentChapter: string
    slugComic: string
    chapter_path: string
    chapters: TOtruyenChapter[]
    currentChapterId: string
    path: string
    listDetailComic: IOtruyenDetailComic
    imageComment?: number
}

const ListImageChapter = ({
                              listImageChapter, nextChapter, prevChapter,
                              chapters, currentChapterId, path, listDetailComic,
                              currentChapter, slugComic, chapter_path, imageComment
                          }: TListImageChapter) => {

    const totalImage = listImageChapter.length;

    // Hooks
    const {isLg} = useTailwindBreakpoints();
    const {bannerMode, handleBannerMode} = useBannerMode();

    // States
    const [imgWidth, setImgWidth] = useState(0);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [revealedBanners, setRevealedBanners] = useState<Set<number>>(new Set());
    const [bannerHeights, setBannerHeights] = useState<Record<number, number>>({});

    // Ref
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

    // Toast Guide mobile
    useEffect(() => {
        const hasSeenGuide = localStorage.getItem('ZTC-hasSeenGuide');
        if (!hasSeenGuide) {
            setShowGuide(true);
            localStorage.setItem('ZTC-hasSeenGuide', 'true');
        }
    }, []);

    // Image Size
    useEffect(() => {
        setImgWidth(isLg ? 50 : 100);
    }, [isLg]);

    const handleReveal = (index: number) => {
        setRevealedBanners(prev => new Set(prev).add(index));
    };

    const isBannerIndex = (index: number): boolean => {
        switch (bannerMode) {
            case 'all':       return true;
            case 'first-last': return index === 0 || index === listImageChapter.length - 1;
            case 'none':      return false;
            default:          return false;
        }
    };

    const shouldBlur = (index: number): boolean => {
        if (revealedBanners.has(index)) return false;
        return isBannerIndex(index);
    };

    // Clicks (mobile and desktop)
    const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isLg) {
            e.preventDefault();
            if (!isOverlayOpen) {
                setIsOverlayOpen(true);
                setIsDropdownOpen(false);
            }
        }
    };

    const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isOverlayOpen) {
            setIsOverlayOpen(true);
            setIsDropdownOpen(false);
        }
    };

    return (
        <>
            {/* List Image */}
            <section
                className='flex flex-col items-center min-h-screen'
                onContextMenu={handleRightClick}
                onClick={handleOnClick}
            >
                {listImageChapter.map((img, index) => {
                    const needBlur = shouldBlur(index);
                    const overlayHeight = bannerHeights[index] || 0;
                    return (
                        <div
                            key={`${img.image_file}-${index}`}
                            className="relative"
                            style={{width: `${imgWidth}%`}}
                        >
                            <Image
                                ref={(el) => { imgRefs.current[index] = el; }}
                                src={`${CONFIG_API_OTRUYEN.IMAGE_CHAPTER}/${chapter_path}/${img.image_file}`}
                                alt={`${slugComic}-${img.image_page}`}
                                width={925}
                                height={1387}
                                placeholder={CONFIG_IMAGE.BLUR_DATA_URL as 'data:image/'}
                                onError={(e) => { e.currentTarget.src = CONFIG_IMAGE.BLUR_DATA_URL }}
                                onLoad={(e) => {
                                    const height = (e.target as HTMLImageElement).getBoundingClientRect().height;
                                    setBannerHeights(prev => ({...prev, [index]: height * 0.15}));
                                }}
                                sizes="(max-width: 50px) 2vw, (max-width: 1920px) 925px)"
                                priority={index === 0}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                className="bg-black dark:bg-white w-full"
                            />
                            {bannerMode !== null && needBlur && overlayHeight > 0 && (
                                <div
                                    className="absolute top-0 left-0 right-0 flex items-center justify-center cursor-pointer backdrop-blur-xl"
                                    style={{height: `${overlayHeight}px`}}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReveal(index);
                                    }}
                                >
                                    <span className="text-white text-xs bg-black/50 leading-snug px-6 py-2 rounded-md select-none mx-2 text-center whitespace-pre-line">
                                        Có thể có banner quảng cáo. Nếu ảnh bị cắt hoặc mờ, hãy nhấn để xem đầy đủ. Bạn cũng có thể tắt trong cài đặt (ẩn ảnh đầu/cuối).
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}

                <Overlay isOverlayOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)}>
                    <OverlaySettings
                        imgWidth={imgWidth}
                        setImgWidth={setImgWidth}
                        totalImage={totalImage}
                        slugComic={slugComic}
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        imgRefs={imgRefs}
                        chapters={chapters}
                        currentChapterId={currentChapterId}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        bannerMode={bannerMode}
                        onBannerModeChange={handleBannerMode}
                    />
                </Overlay>

                {/* TotalImage */}
                <div className="hidden xl:flex fixed bottom-[18px] left-[38px] bg-[#fafafa] dark:bg-[#030303] py-2 px-3 rounded-[3px] border dark:border-[#3e3e3e] gap-[11px] items-center">
                    <div
                        className="dark:text-white/30 relative flex items-center justify-center text-xs"
                        title={`Ảnh ${currentImageIndex + 1}`}
                    >
                        <Image
                            className="rotate-90 filter brightness-0 dark:filter-none"
                            src={CONFIG_IMG.PAGE}
                            width={32}
                            height={32}
                            alt="currentpage"
                        />
                        <span className="absolute">{currentImageIndex + 1}</span>
                    </div>
                    <div className="dark:text-white/85 text-xs">
                        <div title={`${totalImage} ảnh`}>{totalImage}P</div>
                        <div>Chương {currentChapter}</div>
                    </div>
                </div>

                {/* Toggle setting */}
                <div
                    className="fixed bottom-[24px] right-[65px] bg-[#fafafa] shadow dark:bg-[#030303] border dark:border-[#3e3e3e] hidden lg:flex gap-[11px] items-center rounded-full py-2 px-4 cursor-pointer"
                    onClick={() => setIsOverlayOpen(prev => !prev)}
                >
                    <SettingsIcon className={`size-5 ${isOverlayOpen ? 'text-primary' : ''}`}/>
                    <span className="hidden xl:block dark:text-white/85 text-xs">
                        {isOverlayOpen ? 'Ẩn thanh công cụ' : 'Hiển thị thanh công cụ'}
                    </span>
                </div>
            </section>

            {/* Btn next chapter */}
            {nextChapter && (
                <div className="text-center py-10">
                    <Link href={buildReadingUrl(slugComic, nextChapter.chapter_name, nextChapter.chapter_api_data)}>
                        <Button sizeCustom='xs'>
                            Đọc chương tiếp theo thôi~ (≧▽≦)
                        </Button>
                    </Link>
                </div>
            )}

            {/* Toast guide mobile */}
            {showGuide && !isLg && listImageChapter && (
                <div className="fixed top-1/4 left-1/2 -translate-x-1/2 pointer-events-none">
                    <div className="z-50 bg-primary text-white text-xs sm:text-sm w-fit text-center px-4 py-2 rounded-md shadow-lg animate-fade-in-out">
                        Nhấp vào ảnh để hiển thị thanh công cụ nhé ~ (≧▽≦)
                    </div>
                </div>
            )}

            <ImageSaver
                title={listDetailComic.name}
                path={path}
                thumb={listDetailComic.thumb_url}
                slug={listDetailComic.slug}
                chapter_id={currentChapterId}
                chapter_name={currentChapter}
                image_name={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                imgRefs={imgRefs}
                imageComment={imageComment}
            />
        </>
    )
}

export default ListImageChapter;