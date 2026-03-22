// ** Next
import {Metadata} from "next";

// ** React
import {Suspense} from "react";

// ** Module component
import ListSearchComic from "@/modules/tim-kiem/ListSearchComic";

// ** Skeleton
import ListSearchComicSkeleton from "@/skeletons/tim-kiem/ListSearchComicSkeleton";

type TSearchComic = {
    searchParams: Promise<{
        trang?: string
        'tu-khoa'?: string
    }>
}

export async function generateMetadata({searchParams}: TSearchComic): Promise<Metadata> {

    const {'tu-khoa': keyword} = await searchParams

    return {
        title: `${keyword} - Kết quả tìm kiếm | Ztruyện`,
        description: `Tìm truyện tranh - Tất cả truyện đều có thể tìm thấy tại Ztruyện`,
        keywords: [
            `tìm truyện tranh`,
            `tìm truyện tiếng việt`,
            `đọc truyện tranh`,
            `tìm ${keyword} với ztruyen.io.vn`,
            `kết quả tìm kiếm ${keyword} từ ztruyen.io.vn`,
        ],
        alternates: {
            canonical: `/tim-kiem?keyword=${keyword}`,
            languages: {
                vi: `/vi/tim-kiem?keyword=${keyword}`,
            },
        },
        openGraph: {
            title: `${keyword} - Kết quả tìm kiếm | Ztruyện`,
            description: `Tìm truyện tranh - Tất cả truyện đều có thể tìm thấy tại Ztruyện`,
            images: [
                {
                    url: '/logo-all.png',
                    width: 400,
                    height: 200,
                },
            ],
        },
    };
}

const SearchComic = async ({searchParams}: TSearchComic) => {

    const {trang, 'tu-khoa': keyword} = await searchParams

    const pageQuery = parseInt((trang as string) || '1') || 1;

    return (
        <section>
            <div className="flex gap-[5px] text-sm py-8 container">
                <span className="text-primary">{`"${keyword}"`}</span>
                <span>Kết quả tìm kiếm</span>
            </div>
            <Suspense fallback={<ListSearchComicSkeleton/>}>
                <ListSearchComic keyword={keyword || ''} pageQuery={pageQuery}/>
            </Suspense>
        </section>
    )
}

export default SearchComic;