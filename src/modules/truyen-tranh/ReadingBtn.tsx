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

type TReadingBtnProps = {
    chapter: TOtruyenChapter;
    slug: string;
}

const ReadingBtn = ({chapter, slug}: TReadingBtnProps) => {

    const isComicHistory = false
    const hrefFirstChapter = buildReadingUrl(slug, chapter.chapter_name, chapter.chapter_api_data)

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