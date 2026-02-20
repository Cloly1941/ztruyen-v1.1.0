"use client";

// ** React
import {useState, useMemo} from 'react';

// ** Hooks
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";
import useMounted from "@/hooks/common/useMounted";

// ** Next
import Link from "next/link";

// ** Shadcn ui
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

// ** Skeleton
import ListChapterSkeleton from "@/skeletons/truyen-tranh/ListChapterSkeleton";

// ** utils
import getIdFromUrl from "@/utils/getIdFromUrl";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

// ** Type
import {TOtruyenChapter} from "@/types/api.otruyen";

interface Props {
    chapters: TOtruyenChapter[];
    slug: string;
}

const RangeBtnPagination = ({chapters, slug}: Props) => {

    const {isMd} = useTailwindBreakpoints();
    const [currentRange, setCurrentRange] = useState(0);
    const isMounted = useMounted()

    // Sort chapters by decimal number (e.g. 10.1, 10.2, 11)
    const sortedChapters = useMemo(() => {
        return [...chapters].sort((a, b) => {
            const pa = a.chapter_name.split(".").map(Number);
            const pb = b.chapter_name.split(".").map(Number);
            for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
                const na = pa[i] ?? 0;
                const nb = pb[i] ?? 0;
                if (na !== nb) return na - nb;
            }
            return 0;
        });
    }, [chapters]);

    if (!isMounted) return <ListChapterSkeleton/>;
    const rangeSize = isMd ? 50 : 20;

    // Find the maximum chapter number (used to calculate total ranges)
    const maxChapter = Math.max(...sortedChapters.map(ch => parseFloat(ch.chapter_name)));
    const totalRanges = Math.ceil(maxChapter / rangeSize);

    // Calculate current range
    const start = currentRange * rangeSize;
    const end = Math.min((currentRange + 1) * rangeSize - 1, maxChapter);

    // Filter chapters that belong to the current range [start, end]
    const currentChapters = sortedChapters.filter(ch => {
        const num = parseFloat(ch.chapter_name);
        return num >= start && num <= end;
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Pagination buttons */}
            <div
                className="flex sm:grid sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3 mt-5 overflow-x-auto scroll-hidden">
                {Array.from({length: totalRanges}).map((_, idx) => {
                    const rangeStart = idx * rangeSize;
                    const rangeEnd = Math.min((idx + 1) * rangeSize - 1, maxChapter);

                    return (
                        <Button
                            key={idx}
                            onClick={() => setCurrentRange(idx)}
                            className={`py-2 rounded-full text-xs transition min-w-max md:min-w-0  ${
                                idx === currentRange
                                    ? "bg-blue-100 text-blue-600 hover:bg-blue-100 dark:bg-blue-200"
                                    : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-gray-100 hover:text-black dark:hover:text-white/70"
                            }`}
                        >
                            {rangeStart} - {rangeEnd}
                        </Button>
                    );
                })}
            </div>

            {/* Chapter list */}
            <ul className="flex flex-wrap gap-4 -mr-4">
                {currentChapters.map((item, index) => (
                    <li
                        key={index}
                        className="w-[calc(100%/2-16px)] md:w-[calc(100%/3-16px)] lg:w-[calc(100%/4-16px)]"
                    >
                        {item.chapter_title ? (
                            <>
                                <div className='hidden md:block'>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={`${CONFIG_SLUG.READING}/${slug}-chuong-${item.chapter_name}-${getIdFromUrl(item.chapter_api_data, '/')}.html`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                <span className="truncate">
                                                    {`${item.chapter_name} - ${item.chapter_title}`}
                                                </span>
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className='text-sm'>
                                            {item.chapter_title}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Link
                                    href={`${CONFIG_SLUG.READING}/${slug}-chuong-${item.chapter_name}-${getIdFromUrl(item.chapter_api_data, '/')}.html`}
                                    className='block md:hidden'
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                       <span className="truncate">
                                            {`${item.chapter_name} - ${item.chapter_title}`}
                                        </span>
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={`${CONFIG_SLUG.READING}/${slug}-chuong-${item.chapter_name}-${getIdFromUrl(item.chapter_api_data, '/')}.html`}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full"
                                >
                                    {`Chương ${item.chapter_name}`}
                                </Button>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RangeBtnPagination;
