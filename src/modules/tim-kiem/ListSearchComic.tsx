// ** Next
import Link from "next/link";

// ** Components
import ErrorText from "@/components/common/ErrorText";
import ComicImage from "@/components/common/ComicImage";
import {Pagination} from "@/components/common/Pagination";

// ** Service
import {getListBySearch} from "@/services/api-otruyen/search";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";

// ** Utils
import {convertStatusToVi} from "@/utils/convertStatusComicToVi";
import {buildReadingUrl} from "@/utils/buildReadingUrl ";

type TListSearchComicProps = {
    keyword: string
    pageQuery: number,
}

const ListSearchComic = async ({keyword, pageQuery}: TListSearchComicProps) => {

    const res = await getListBySearch(keyword, pageQuery);

    const itemsPerPage = 24;

    const totalPages = res.data?.params.pagination?.totalItems || 0

    const listComic = res.data?.items

    if (!listComic) return <ErrorText/>

    return (
        <section className='section-list-comic'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-9">
                {listComic.map((item, index) => {
                    return (
                        <figure
                            key={item.slug}
                            className="flex gap-4"
                        >
                            {/* Thumb */}
                            <Link href={`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`}>
                                <ComicImage
                                    src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.thumb_url}`}
                                    alt={item.name}
                                    priority={index <= 0}
                                />
                            </Link>

                            <figcaption className="w-[180px] flex flex-col justify-between">

                                {/* Title*/}
                                <Link href={`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`}>
                                    <h2 className='text-base lg:text-lg font-medium line-clamp-3' title={item.name}>
                                        {item.name}
                                    </h2>
                                </Link>

                                {/* Chapter */}
                                {item.chaptersLatest && (
                                    <Link
                                        href={buildReadingUrl(item.slug, item.chaptersLatest[0].chapter_name, item.chaptersLatest[0].chapter_api_data)}
                                        className='text-link text-xs'
                                    >
                                        {`Chương ${item.chaptersLatest[0].chapter_name}`}
                                    </Link>
                                )}


                                <div className="text-xs">
                                    {/* Status */}
                                    <div
                                        className='text-black/30 dark:text-white/30 mb-1'>{convertStatusToVi(item.status)}</div>

                                    {/* Authors */}
                                    <ul className="flex gap-x-2 gap-y-0.5 flex-wrap text-black/30 dark:text-white/30 text-xs">
                                        {item.author.map((author, index) => (
                                            <li key={index} className="flex-shrink-0">
                                                {author.length === 0 ? 'Đang cập nhật' : author}
                                                {index < item.author.length - 1 && ','}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </figcaption>
                        </figure>
                    );
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

export default ListSearchComic