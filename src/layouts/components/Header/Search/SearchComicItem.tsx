// ** Next
import Link from "next/link";

// ** Type
import {IOtruyenSearchComic} from "@/types/api.otruyen";

// ** Configs
import {CONFIG_SLUG} from "@/configs/slug";
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";

// ** Component
import ComicImage from "@/components/common/ComicImage";

// ** Utils
import {buildReadingUrl} from "@/utils/buildReadingUrl ";
import {convertStatusToVi} from "@/utils/convertStatusComicToVi";

type TSearchComicItem = {
    data: IOtruyenSearchComic
}

const SearchComicItem = ({data}: TSearchComicItem) => {
    return (
        <figure className="flex gap-4">
            {/* Thumb */}
            <Link href={`/${CONFIG_SLUG.DETAIL}/${data.slug}.html`}>
                <ComicImage
                    src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${data.thumb_url}`}
                    alt={data.name}
                    // priority={index <= 0}
                />
            </Link>

            <figcaption className="flex flex-col justify-between">

                {/* Title*/}
                <Link href={`/${CONFIG_SLUG.DETAIL}/${data.slug}.html`}>
                    <h2 className='text-base lg:text-lg font-medium line-clamp-3' title={data.name}>
                        {data.name}
                    </h2>
                </Link>

                {/* Chapter */}
                {data.chaptersLatest && (
                    <Link
                        href={buildReadingUrl(data.slug, data.chaptersLatest[0].chapter_name, data.chaptersLatest[0].chapter_api_data)}
                        className='text-link text-xs w-fit'
                    >
                        {`Chương ${data.chaptersLatest[0].chapter_name}`}
                    </Link>
                )}


                <div className="text-xs">
                    {/* Status */}
                    <div
                        className='text-black/30 dark:text-white/30 mb-1'>{convertStatusToVi(data.status)}</div>

                    {/* Authors */}
                    <ul className="flex gap-x-2 gap-y-0.5 flex-wrap text-black/30 dark:text-white/30 text-xs">
                        {data.author.map((author, index) => (
                            <li key={index} className="flex-shrink-0">
                                {author.length === 0 ? 'Đang cập nhật' : author}
                                {index < data.author.length - 1 && ','}
                            </li>
                        ))}
                    </ul>
                </div>
            </figcaption>
        </figure>
    )
}

export default SearchComicItem