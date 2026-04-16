'use client'

// ** Next
import Link from "next/link";

// ** React
import {Dispatch, RefObject, SetStateAction, useEffect, useRef, useState} from "react";

// ** Hook
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";

// ** Icons
import {BookOpenText, ChevronLeft, ChevronRight, Expand, Menu, MessageSquare, Minus, Plus, Shrink} from "lucide-react";

// ** Shadcn ui
import {Slider} from "@/components/ui/slider";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

// ** Type
import {TOtruyenChapter} from "@/types/api.otruyen";

// ** Util
import {buildReadingUrl} from "@/utils/buildReadingUrl ";
import getIdFromUrl from "@/utils/getIdFromUrl";

// ** Modules
import CommentSection from "@/modules/truyen-tranh/Comment/CommentSection";
import Settings from "@/modules/doc-truyen/Settings";
import {TBannerMode} from "@/hooks/common/useBannerMode";
import {usePathname, useSearchParams} from "next/navigation";

type TOverlaySettings = {
    imgWidth?: number
    setImgWidth: (imgWidth: number) => void
    currentImageIndex: number
    setCurrentImageIndex: (currentImageIndex: number) => void
    imgRefs: RefObject<(HTMLImageElement | null)[]>;
    totalImage: number
    slugComic: string
    nextChapter: TOtruyenChapter
    prevChapter: TOtruyenChapter
    chapters: TOtruyenChapter[]
    currentChapterId: string
    isDropdownOpen: boolean;
    setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
    bannerMode: TBannerMode | null;
    onBannerModeChange: (mode: TBannerMode) => void;
}

const OverlaySettings = ({
                             imgWidth = 50, setImgWidth, totalImage,
                             currentImageIndex, setCurrentImageIndex,
                             imgRefs, chapters, currentChapterId,
                             isDropdownOpen, setIsDropdownOpen,
                             slugComic, nextChapter, prevChapter,
                             bannerMode, onBannerModeChange
                         }: TOverlaySettings) => {

    // Hook
    const {isMd} = useTailwindBreakpoints();

    // State
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [open, setOpen] = useState(false);

    // ** Ref
    const listRef = useRef<HTMLUListElement | null>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();


    const currentChapter = chapters.find((ch) =>
        getIdFromUrl(
            ch.chapter_api_data,
            '/'
        ) === currentChapterId
    )

    // close when change path
    useEffect(() => {
        setOpen(false);
    }, [pathname, searchParams]);

    // Dropdown menu
    const scrollToActive = () => {
        if (!listRef.current) return;
        const activeEl = listRef.current.querySelector('.active-chapter');
        if (activeEl) {
            (activeEl as HTMLElement).scrollIntoView({
                block: 'center',
            });
        }
    };

    // Slider
    useEffect(() => {
        const handleScroll = () => {
            if (imgRefs.current && imgRefs.current.length > 0) {
                let closestIndex = 0;
                let minDistance = Number.MAX_VALUE;

                imgRefs.current.forEach((img, index) => {
                    if (img) {
                        const rect = img.getBoundingClientRect();
                        const distance = Math.abs(rect.top);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestIndex = index;
                        }
                    }
                });

                setCurrentImageIndex(closestIndex);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [imgRefs, setCurrentImageIndex]);

    const scrollToImage = (index: number) => {
        if (imgRefs.current[index]) {
            imgRefs.current[index]?.scrollIntoView();
        }
    };

    const handleSliderChange = (e: { target: { value: number } }) => {
        const newIndex = e.target.value - 1;
        setCurrentImageIndex(newIndex);
        scrollToImage(newIndex);
    };
    // End Slider

    // zoom out/ in
    const handlePlusChange = () => {
        if (imgWidth < 100) {
            setImgWidth(imgWidth + 10);
        }
    };

    const handleMinusChange = () => {
        if (imgWidth > 30) {
            setImgWidth(imgWidth - 10);
        }
    };
    // End zoom out/ in

    // Full Screen
    const toggleFullScreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen()
                setIsFullScreen(true)
            } else {
                await document.exitFullscreen()
                setIsFullScreen(false)
            }
        } catch (error) {
            console.error("Fullscreen error:", error)
        }
    }

    // Handle fullscreen change event (when user presses ESC)
    useEffect(() => {
        const onChange = () => {
            setIsFullScreen(!!document.fullscreenElement)
        }

        document.addEventListener("fullscreenchange", onChange)
        return () => document.removeEventListener("fullscreenchange", onChange)
    }, [])
    //  End Full Screen

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-full absolute bottom-0 flex flex-col items-center left-1/2 -translate-x-1/2 transition-opacity duration-500 ease-in-out"
        >
            <div
                className="bg-setting rounded-[40px] text-white/90 flex items-center justify-center px-5 max-w-max pt-1 gap-1.5">
                {/* Comment */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <div className="flex flex-col items-center gap-1 p-2 cursor-pointer">
                            <MessageSquare className="size-5 text-setting"/>
                            <span className="text-xs">Bình luận</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent className='dialog-comment-content'>
                        <DialogHeader>
                            <DialogTitle className='text-sm text-setting mb-2'>
                                Chương{' '}
                                {currentChapter?.chapter_name || ''}
                            </DialogTitle>
                        </DialogHeader>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 h-[80vh]">
                            <CommentSection
                                type='reading'
                                name={currentChapter?.filename as string}
                                chapterId={currentChapterId}
                                page={currentImageIndex + 1}
                                chapterName={currentChapter?.chapter_name}
                                slug={slugComic}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Detail comic btn*/}
                <Link
                    href={`/${CONFIG_SLUG.DETAIL}/${slugComic}.html`}
                    className="flex flex-col items-center gap-1 p-2 cursor-pointer text-setting"
                >
                    <BookOpenText className="size-5"/>
                    <span className="text-white text-xs">
                            Chi tiết truyện
                        </span>
                </Link>

                {/* Settings */}
                <Settings bannerMode={bannerMode} onBannerModeChange={onBannerModeChange}/>

                {/* Menu */}
                <DropdownMenu
                    modal={false}
                    open={isDropdownOpen}
                    onOpenChange={(open) => {
                        setIsDropdownOpen(open);
                        if (open) {
                            requestAnimationFrame(() => scrollToActive());
                        }
                    }}
                >
                    <DropdownMenuTrigger asChild>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center gap-1 p-2 cursor-pointer ">
                            <Menu className="size-5 text-setting"/>
                            <span className="text-xs">Mục lục</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent asChild>
                        <div
                            className="p-4 rounded-2xl w-[240px] sm:w-[280px] !bg-[#272727e6] border-none text-white mb-2 ">
                            <div
                                className="text-sm sm:text-base mb-4 ml-3">{`Tất cả các chương (${chapters[chapters.length - 1].chapter_name})`}</div>
                            <ul
                                ref={listRef}
                                className="bg-[#121212] rounded-2xl overflow-auto max-h-[320px] sm:max-h-[400px] no-scrollbar"
                            >
                                {chapters?.map((item, index) => {
                                    const activeChapter = getIdFromUrl(item.chapter_api_data, '/') === currentChapterId;

                                    return (
                                        <li
                                            key={index}
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                        >
                                            <Link
                                                href={buildReadingUrl(slugComic, item.chapter_name, item.chapter_api_data)}
                                                className={`px-5 sm:px-10 py-3 block text-xs sm:text-sm text-center hover:bg-black ${activeChapter ? 'active-chapter text-primary' : ''}`}
                                            >
                                                {`Chương ${item.chapter_name} ${item.chapter_title ? `- ${item.chapter_title}` : ''}`}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/*Full Screen*/}
                {isMd && (
                    <div
                        className="flex flex-col items-center gap-1 p-2 cursor-pointer"
                        onClick={toggleFullScreen}
                    >
                        {isFullScreen ? (
                            <>
                                <Shrink className="size-5"/>
                                <span className="text-white text-xs">
                                    Thoát chế độ toàn màn hình
                                </span>
                            </>
                        ) : (
                            <>
                                <Expand className="text-setting size-5"/>
                                <span className="text-xs">
                                    Xem toàn màn hình
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/*  Slider Group  */}
            <div
                className="mt-5 p-3 md:p-0 md:my-5 flex flex-1 w-full md:w-[600px] md:min-w-[120px] bg-setting md:rounded-[40px] items-center justify-between gap-4 relative">

                {/* Prev btn*/}
                {prevChapter ? (
                    <Link
                        href={buildReadingUrl(slugComic, prevChapter.chapter_name, prevChapter.chapter_api_data)}
                        className="p-2"
                    >
                        <ChevronLeft className="size-6"/>
                    </Link>
                ) : (
                    <span className="p-2 opacity-50">
                        <ChevronLeft className="size-6"/>
                    </span>
                )}

                {/* Total Image */}
                <span className="text-setting text-sm flex-shrink-0">{`${currentImageIndex + 1} / ${totalImage}`}</span>

                {/* Slider */}
                <Slider
                    min={1}
                    max={totalImage}
                    step={1}
                    value={[currentImageIndex + 1]}
                    onValueChange={(value) =>
                        handleSliderChange({target: {value: value[0]}})
                    }
                    className="cursor-pointer"
                />
                {/* Next btn*/}
                {nextChapter ? (
                    <Link
                        href={buildReadingUrl(slugComic, nextChapter.chapter_name, nextChapter.chapter_api_data)}
                        className="p-2"
                    >
                        <ChevronRight className="size-6"/>
                    </Link>
                ) : (
                    <span className="p-2 opacity-50">
                        <ChevronRight className="size-6"/>
                    </span>
                )}

                {/* Zoom in/out */}
                <div className="absolute bottom-0 -left-[140px] hidden lg:block">
                    <div className="bg-setting rounded-[40px] flex w-[120px] items-center justify-between">
                       <span
                           className="p-3 cursor-pointer"
                           onClick={handlePlusChange}
                       >
                            <Plus className="size-4"/>
                        </span>
                        <span className="text-[13px] text-setting">{`${imgWidth}%`}</span>
                        <span
                            className="p-3 cursor-pointer"
                            onClick={handleMinusChange}
                        >
                            <Minus className="size-4"/>
                        </span>
                    </div>
                </div>

                {/* End Zoom in/out */}
            </div>
        </div>
    )
}

export default OverlaySettings;