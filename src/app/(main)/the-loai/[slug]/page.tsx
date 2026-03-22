// ** Next
import {Metadata} from "next";

// ** React
import {Suspense} from "react";

// ** Util
import removeExtension from "@/utils/removeExtension";

// ** Components
import ListComicByStatus from "@/components/common/ListComicByStatus";
import SortByDate from "@/components/common/SortByDate";

// ** Module components
import ListGenre from "@/modules/the-loai/ListGenre";

// ** Service
import {getListByGender} from "@/services/api-otruyen/categories";

// ** Skeleton
import NavListGenreSkeleton from "@/skeletons/the-loai/NavListGenreSkeleton";
import ListComicByStatusSkeleton from "@/skeletons/common/ListComicByStatusSkeleton";

// ** Enum
import {ESortOrder} from "@/types/enum";

type TGenreComic = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        trang?: string
        'sap-xep'?: ESortOrder
    }>
}

export async function generateMetadata({
                                           params,
                                           searchParams,
                                       }: TGenreComic): Promise<Metadata> {
    const {slug} = await params

    const slugComic = removeExtension(slug, '.html')

    const {trang} = await searchParams

    const pageQuery = parseInt((trang as string) || '1') || 1;

    const res = await getListByGender(slugComic)

    const genreName = res.data?.seoOnPage?.titleHead || 'Tất cả'

    return {
        title: `${genreName === 'Tất cả' ? 'Tất cả thể loại' : `Thể loại - Truyện ${genreName}`} - Ztruyện`,
        description: `Khám phá những câu chuyện hấp dẫn thuộc thể loại ${genreName}. Đọc ngay các truyện hay nhất, mới nhất về ${genreName} chỉ có tại Ztruyện`,
        keywords: [
            `truyện tranh ${genreName}`,
            `truyện ${genreName}`,
            `Truyện ${genreName}`,
        ],
        alternates: {
            canonical: `/the-loai/${slug}?trang=${pageQuery}`,
            languages: {
                vi: `/vi/the-loai/${slug}?trang=${pageQuery}`,
            },
        },
        openGraph: {
            title: `Thể loại - Truyện ${genreName} - Ztruyện`,
            description: `Khám phá những câu chuyện hấp dẫn thuộc thể loại ${genreName}. Đọc ngay các truyện hay nhất, mới nhất về ${genreName} chỉ có tại Ztruyện`,
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

const GenreComic = async ({params, searchParams}: TGenreComic) => {

    const {slug} = await params

    const slugComic = removeExtension(slug, '.html')

    const {trang, 'sap-xep': sort} = await searchParams

    const pageQuery = parseInt((trang as string) || '1') || 1;
    const sortQuery = sort || ESortOrder.UPDATED_AT_DESC


    return (
        <>
            <Suspense fallback={<NavListGenreSkeleton/>}>
                <ListGenre slug={slugComic}/>
            </Suspense>

            <SortByDate/>

            <Suspense fallback={<ListComicByStatusSkeleton/>}>
                <ListComicByStatus slug={slugComic} pageQuery={pageQuery} sortQuery={sortQuery}/>
            </Suspense>
        </>
    )
}

export default GenreComic