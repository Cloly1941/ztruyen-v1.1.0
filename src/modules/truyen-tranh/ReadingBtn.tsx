'use client'

// ** Next
import Link from 'next/link';

// ** Icon
import {BookOpen} from "lucide-react";

// ** Component
import Button from "@/components/common/Button";

// ** Type
import {TOtruyenChapter} from "@/types/api.otruyen";

// ** Util
import {buildReadingUrl} from "@/utils/buildReadingUrl ";

// ** Local storage
import {historyService} from "@/localStorage/historyServices";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

// ** Hook
import useMounted from "@/hooks/common/useMounted";

// ** Skeleton
import ReadingBtnSkeleton from "@/skeletons/truyen-tranh/ReadingBtnSkeleton";

type TReadingBtnProps = {
    chapter: TOtruyenChapter;
    slug: string;
}

const ReadingBtn = ({chapter, slug}: TReadingBtnProps) => {

    const mounted = useMounted();

    const history = historyService.getBySlug(slug);
    const hrefFirstChapter = buildReadingUrl(slug, chapter.chapter_name, chapter.chapter_api_data);

    if (!mounted) return <ReadingBtnSkeleton/>;

    if (!history)
        return (
            <Link href={hrefFirstChapter} className='w-full'>
                <Button sizeCustom='xs' width='full'>
                    <BookOpen/>
                    Đọc từ đầu
                </Button>
            </Link>
        );

    return (
        <div className='flex flex-col gap-2 w-full'>
            {/* Current chapter */}
            <Link href={`/${CONFIG_SLUG.READING}/${history.path}`} className='w-full'>
                <Button sizeCustom='xs' width='full'>
                    Đọc tiếp chương {history.chapter_name}
                    <span className='hidden sm:inline-block'>thôi nào ~~ (=^･ｪ･^=)</span>
                </Button>
            </Link>

            {/* Lastet chapter */}
            {history.maxReadPath && (
                <Link href={`/${CONFIG_SLUG.READING}/${history.maxReadPath}`} className='w-full'>
                    <Button sizeCustom='xs' width='full' variant='outline'>
                        Đã đọc đến chương {history.maxReadChapterName}
                    </Button>
                </Link>
            )}
        </div>
    )
}

export default ReadingBtn