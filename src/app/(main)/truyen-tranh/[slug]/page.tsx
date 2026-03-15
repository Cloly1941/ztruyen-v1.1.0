// ** Next
import {Metadata} from "next";

// ** React
import {Suspense} from "react";

// ** Component
import ErrorText from "@/components/common/ErrorText";
import ComicImage from "@/components/common/ComicImage";

// ** Module components
import DetailDesc from "@/modules/truyen-tranh/DetailDesc";
import DetailListChapter from "@/modules/truyen-tranh/DetailListChapter";
import DetailRecommendedComic from "@/modules/truyen-tranh/DetailRecommendedComic";
import ReadingBtn from "@/modules/truyen-tranh/ReadingBtn";
import FavoriteBtn from "@/modules/truyen-tranh/FavoriteBtn";

// ** Utils
import removeExtension from "@/utils/removeExtension";
import {cn} from "@/lib/utils";

// ** Service
import {getDetailComic} from "@/services/api-otruyen/comic";

// ** Configs
import {CONFIG_SLUG} from "@/configs/slug";
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {buildMetaList} from "@/configs/page";

// ** Icons
import {Wifi} from "lucide-react";

// ** Type
import {TOtruyenChapter} from "@/types/api.otruyen";

// ** Skeleton
import DetailRecommendedComicSkeleton from "@/skeletons/truyen-tranh/DetailRecommendedComicSkeleton";

// ** Lib
import {getCookie} from "@/lib/cookie";

type TDetailComicProps = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: TDetailComicProps): Promise<Metadata> {
    const {slug} = await params

    const slugComic = removeExtension(slug, '.html')

    const res = await getDetailComic(slugComic)

    const detailComic = res.data?.item

    const comicName = detailComic?.name;

    return {
        title: `${comicName} Tiếng Việt - Ztruyện | ztruyen.io.vn`,
        description: `Đọc truyện tranh ${comicName} tiếng việt. Mới nhất nhanh nhất tại ztruyen.io.vn`,
        keywords: [
            `${comicName}`,
            `${comicName} tiếng việt - Ztruyen | Ztruyen.io.vn`,
            `đọc truyện tranh ${comicName}`,
        ],
        alternates: {
            canonical: `/${CONFIG_SLUG.DETAIL}/${slugComic}`,
            languages: {
                vi: `/vi/${CONFIG_SLUG.DETAIL}/${slugComic}`,
            },
        },
        openGraph: {
            title: `${comicName} Tiếng Việt - Ztruyện | ztruyen.io.vn`,
            description: `Đọc truyện tranh ${comicName} tiếng việt. Mới nhất nhanh nhất tại ztruyen.io.vn`,
            images: [
                {
                    url: `${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${detailComic?.thumb_url}`,
                },
            ],
        },
    };
}

const DetailComic = async ({params}: TDetailComicProps) => {

    const isLogin = await getCookie()

    const {slug} = await params

    const slugComic = removeExtension(slug, '.html')

    const res = await getDetailComic(slugComic)

    const detailComic = res.data?.item

    if (!detailComic) return <ErrorText/>

    const metaList = buildMetaList(detailComic)

    return (
        <div className='bg-[#fafafa] dark:bg-background pt-5 pb-20 min-h-screen'>
            <section
                className='bg-section-detail container flex flex-col items-center md:items-stretch md:flex-row gap-4 md:gap-7 p-5'>
                {/* Comic Image */}
                <ComicImage
                    src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${detailComic.thumb_url}`}
                    alt={detailComic.name}
                    priority={true}
                    imgSize="xl"
                    rounded='sm'
                />

                {/* Right Content */}
                <div className="flex flex-col md:items-start justify-between w-full">
                    {/* Title */}
                    <h1 className='heading-detail text-center'>
                        {detailComic.name}
                    </h1>

                    {/* Meta list */}
                    <dl className="flex flex-col mt-3.5 gap-3 md:gap-2">
                        {metaList.map((item) => {
                            const Icon = item.icon

                            return (
                                <div
                                    key={item.key}
                                    className={`flex gap-4 ${
                                        item.align === 'start' ? 'items-start' : 'items-center'
                                    }`}
                                >
                                    <dt className="text-meta">
                                        <Icon className={cn("size-4", Icon === Wifi && 'rotate-45')}/>
                                        <span>{item.label}</span>
                                    </dt>
                                    <dd>{item.render()}</dd>
                                </div>
                            )
                        })}
                    </dl>

                    {/* Description */}
                    <DetailDesc desc={detailComic.content}/>

                    {/* Buttons */}
                    {detailComic.chapters[0] && (
                        <div className='flex gap-3 mt-4 w-full'>
                            <ReadingBtn slug={slugComic}
                                        chapter={detailComic.chapters[0].server_data?.[0] as TOtruyenChapter}/>
                            <FavoriteBtn
                                slug={slugComic}
                                comicName={detailComic.name}
                                comicCover={detailComic.thumb_url}
                                isLogin={isLogin}
                            />
                        </div>
                    )}
                </div>
            </section>

            <div className="container flex flex-col justify-between gap-4 lg:gap-0 lg:flex-row mt-3">
                <DetailListChapter listChapter={detailComic.chapters} slug={slugComic}/>

                <Suspense fallback={<DetailRecommendedComicSkeleton/>}>
                    <DetailRecommendedComic/>
                </Suspense>
            </div>
        </div>
    )
}

export default DetailComic