// ** Next
import Link from "next/link";

// ** Components
import ErrorText from "@/components/common/ErrorText";
import {Pagination} from "@/components/common/Pagination";
import ComicImage from "@/components/common/ComicImage";
import Tag from "@/components/common/Tag";

// ** Services
import {getListByGender} from "@/services/api-otruyen/categories";
import {getListByStatus} from "@/services/api-otruyen/list";

// ** Type
import {IOtruyenListComic} from "@/types/api.otruyen";
import {ESlug, ESortOrder} from "@/types/enum";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

// ** Util
import getIdFromUrl from "@/utils/getIdFromUrl";
import {convertSortQuery} from "@/utils/covertSortQuery";

type TListComicByStatusProps = {
    slug: ESlug | string,
    pageQuery: number,
    sortQuery: ESortOrder
}

const ListComicByStatus = async ({slug, pageQuery, sortQuery}: TListComicByStatusProps) => {
    let res: IApiOtruyenResWPagination<IOtruyenListComic[]>;

    const sort = convertSortQuery(sortQuery);

    switch (slug) {
        case 'tat-ca':
            res = await getListByStatus(ESlug.NEW, pageQuery, sort.sortField, sort.sortType);
            break;

        case ESlug.NEW:
        case ESlug.COMING_SOON:
        case ESlug.ONGOING:
        case ESlug.COMPLETED:
            res = await getListByStatus(slug, pageQuery, sort.sortField, sort.sortType);
            break;

        default:
            res = await getListByGender(slug, pageQuery, sort.sortField, sort.sortType);
            break;
    }

    const itemsPerPage = 24;

    const totalPages = res.data?.params.pagination?.totalItems || 0
    const listComic = res.data?.items

    if (!listComic) return <ErrorText/>

    return (
        <section className="container pt-2 pb-20">
            <div
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-4 gap-2 md:gap-2.5 lg:gap-3 mb-4">
                {listComic.map((item, index) => {
                    return (
                        <figure
                            key={index}
                            title={item.name}
                            className="flex flex-col"
                        >
                            <div className='relative'>
                                <div className='absolute top-2 left-2 z-10'>
                                    {item.chaptersLatest && (
                                        <Tag
                                            theme='dark'
                                            href={`/${CONFIG_SLUG.READING}/${item.slug}-chuong-${item.chaptersLatest[0].chapter_name}-${getIdFromUrl(item.chaptersLatest[0].chapter_api_data, '/')}.html`}
                                            title={`Chương mới nhất: ${item.chaptersLatest[0].chapter_name}`}
                                        >
                                            {`Chương ${item.chaptersLatest[0].chapter_name}`}
                                        </Tag>
                                    )}
                                </div>
                                <Link href={`/${CONFIG_SLUG.DETAIL}/${item.slug}`}>
                                    <ComicImage
                                        src={`${process.env.NEXT_PUBLIC_API_OTRUYEN_IMAGE_COMIC}/${item.thumb_url}`}
                                        imgSize="lg"
                                        alt={item.name}
                                        priority={index <= 0}
                                    />
                                </Link>
                            </div>
                            <figcaption
                                className="mt-1.5 text-center"
                                title={item.name}
                            >
                                <h2 className='text-sm line-clamp-2'>
                                    <Link href={`/${CONFIG_SLUG.DETAIL}/${item.slug}`}>
                                        {item.name}
                                    </Link>
                                </h2>
                            </figcaption>
                        </figure>
                    )
                })}
            </div>
            <Pagination
                page={pageQuery}
                pageSize={itemsPerPage}
                totalCount={totalPages}
            />
        </section>
    )
}

export default ListComicByStatus