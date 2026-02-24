// ** Next
import Link from "next/link";

// ** Component
import ErrorText from "@/components/common/ErrorText";

// ** Module componnets
// import DevToolsDetection from "@/modules/doc-truyen/DevToolsDetection";
import ListImageChapter from "@/modules/doc-truyen/ListImageChapter";

// ** Layout component
import Header from "@/layouts/components/Header";

// ** Services
import {getListImageChapter} from "@/services/api-otruyen/chapter";
import {getDetailComic} from "@/services/api-otruyen/comic";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

// ** Utils
import removeExtension from "@/utils/removeExtension";
import getIdFromUrl from "@/utils/getIdFromUrl";
import {getChapterName} from "@/utils/getChapterName";

// ** Type
import {TOtruyenChapter} from "@/types/api.otruyen";

type TReadingComic = {
    params: Promise<{ path: string }>
}

const ReadingComic = async ({params}: TReadingComic) => {

    const {path} = await params

    const paths = removeExtension(path, '.html')

    const slugComic = getChapterName(paths)

    const chapterId = getIdFromUrl(paths, '-')

    const [resDetail, resChapter] = await Promise.all([
        getDetailComic(slugComic),
        getListImageChapter(chapterId),
    ]);

    const listDetailComic = resDetail.data?.item
    const listDetailImageChapter = resChapter.data?.item

    if (!listDetailComic || !listDetailImageChapter) return <ErrorText/>

    const chapters = listDetailComic.chapters?.[0]?.server_data ?? []

    const currentIndex = chapters.findIndex(
        (ch: TOtruyenChapter) => ch.chapter_name === listDetailImageChapter.chapter_name
    )

    const prevChapter = chapters[currentIndex - 1] ?? null
    const nextChapter = chapters[currentIndex + 1] ?? null


    return (
        <>
            <Header asChild>
                <h1 className="text-sm line-clamp-1 hidden md:block">
                    <Link
                        href={`/${CONFIG_SLUG.DETAIL}/${listDetailComic.slug}`}
                        className="hover:text-primary"
                    >
                        {listDetailComic.name} {' - '}
                    </Link>
                    Chương {listDetailImageChapter.chapter_name}
                </h1>
            </Header>
            <ListImageChapter
                listImageChapter={listDetailImageChapter.chapter_image}
                nextChapter={nextChapter}
                prevChapter={prevChapter}
                currentChapter={chapters[currentIndex].chapter_name}
                slugComic={slugComic}
                chapter_path={listDetailImageChapter.chapter_path}
                chapters={chapters}
                currentChapterId={chapterId}
                path={path}
                listDetailComic={listDetailComic}
            />
            {/*<DevToolsDetection/>*/}
        </>
    )
}

export default ReadingComic