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

// ** SKeleton
import ReadingBtnSkeleton from "@/skeletons/truyen-tranh/ReadingBtnSkeleton";

type TReadingBtnProps = {
    chapter: TOtruyenChapter;
    slug: string;
}

const ReadingBtn = ({chapter, slug}: TReadingBtnProps) => {

    const mounted = useMounted();

    const isComicHistory = historyService.getBySlug(slug);
    const hrefFirstChapter = buildReadingUrl(slug, chapter.chapter_name, chapter.chapter_api_data)

    if (!mounted) return <ReadingBtnSkeleton/>;

    if (!isComicHistory)
        return (
            <Link href={hrefFirstChapter} className=' w-full'>
                <Button sizeCustom='xs' width='full'>
                    <BookOpen/>
                    Đọc từ đầu
                </Button>
            </Link>
        );

    return (
        <Link href={`/${CONFIG_SLUG.READING}/${isComicHistory.path}`} className=' w-full'>
            <Button sizeCustom='xs' width='full'>
                Đọc tiếp chương {isComicHistory.chapter_name} thôi nào ~~ (=^･ｪ･^=)
            </Button>
        </Link>
    )
}

export default ReadingBtn