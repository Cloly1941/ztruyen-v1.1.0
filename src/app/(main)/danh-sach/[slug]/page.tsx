// ** Next
import {Metadata} from "next";

// ** React
import {Suspense} from "react";

// ** Util
import removeExtension from "@/utils/removeExtension";

// ** Components
import ListComicByStatus from "@/components/common/ListComicByStatus";
import SortByDate from "@/components/common/SortByDate";

// ** Skeleton
import ListComicByStatusSkeleton from "@/skeletons/common/ListComicByStatusSkeleton";

// ** Enum
import {ESlug, ESortOrder} from "@/types/enum";

// ** Services
import {getListByStatus} from "@/services/api-otruyen/list";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";
import {convertStatusComic} from "@/utils/convertStatusComic";

type TStatusComic = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        trang?: string
        'sap-xep'?: ESortOrder
    }>
}

export async function generateMetadata({
                                           params,
                                           searchParams,
                                       }: TStatusComic): Promise<Metadata> {
    const {slug} = await params

    const slugComic = removeExtension(slug, '.html')

    const {trang} = await searchParams

    const pageQuery = parseInt((trang as string) || '1') || 1;

    const res = await getListByStatus(slugComic as ESlug)

    const status = res.data?.titlePage

    return {
        title: `${status} - ztruyen.io.vn`,
        description: `${status} tại ztruyen.io.vn`,
        keywords: [
            `Truyện tranh`,
            `manga`,
            `comic`,
            `manhua`,
            `manhua ${status}`,
        ],
        alternates: {
            canonical: `/${CONFIG_SLUG.LIST}/${slug}?page=${pageQuery}`,
            languages: {
                vi: `/vi/${CONFIG_SLUG.LIST}/${slug}?page=${pageQuery}`,
            },
        },
        openGraph: {
            title: `Truyện ${status} - ztruyen.io.vn`,
            description: `Truyện ${status} tại ztruyen.io.vn`,
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

const StatusComic = async ({params, searchParams}: TStatusComic) => {

    const {slug} = await params

    const slugComic = removeExtension(slug, '.html')

    const {trang, 'sap-xep': sort} = await searchParams

    const pageQuery = parseInt((trang as string) || '1') || 1;
    const sortQuery = sort || ESortOrder.UPDATED_AT_DESC

    const statusComic = convertStatusComic(slugComic as ESlug)

    return (
        <>
            <div className='section-header gap-2.5 sm:gap-4 flex-col md:flex-row container py-5'>
                <h1 className='heading py-0'>{statusComic.title}</h1>
                <p className='desc'>{statusComic.description}</p>
            </div>

            <SortByDate/>

            <Suspense fallback={<ListComicByStatusSkeleton/>}>
                <ListComicByStatus slug={slugComic} pageQuery={pageQuery} sortQuery={sortQuery}/>
            </Suspense>
        </>
    );
};

export default StatusComic;
