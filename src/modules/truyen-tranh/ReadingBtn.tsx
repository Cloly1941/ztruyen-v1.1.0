'use client'

// ** Next
import Link from 'next/link';

// ** Icon
import {BookOpen} from "lucide-react";

// ** Component
import Button from "@/components/common/Button";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

// ** Type
import {TOtruyenChapter} from "@/types/api.otruyen";

// ** Util
import getIdFromUrl from "@/utils/getIdFromUrl";

type TReadingBtnProps = {
    chapter: TOtruyenChapter;
    slug: string;
}

const ReadingBtn = ({chapter, slug}: TReadingBtnProps) => {

    const isComicHistory = false
    const hrefFirstChapter = `${CONFIG_SLUG.READING}/${slug}-chuong-${chapter.chapter_name}-${getIdFromUrl(chapter.chapter_api_data, '/')}.html`

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
        <Link href={`/`} className=' w-full'>
            <Button sizeCustom='xs' width='full'>
                Đọc tiếp chương 3 thôi nào ~~ (=^･ｪ･^=)
            </Button>
        </Link>
    )
}

export default ReadingBtn