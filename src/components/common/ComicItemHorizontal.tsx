// ** Next
import Link from "next/link";

// ** Configs
import {CONFIG_SLUG} from "@/configs/slug";
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";

// ** Component
import ComicImage from "@/components/common/ComicImage";

// ** Utils
import {buildReadingUrl} from "@/utils/buildReadingUrl ";
import {convertStatusToVi} from "@/utils/convertStatusComicToVi";

// ** type
import {TStatus} from "@/types/api.otruyen";

// ** Util
import {buildImgTopNumber} from "@/utils/buildImgTopNumber";


type TComicItemHorizontal = {
    thumbUrl: string;
    slug: string;
    name: string;
    chapterName: string;
    chapterApiData: string;
    author: string[];
    status: TStatus;
    rank?: number
}

const ComicItemHorizontal = (
    {
        slug, thumbUrl, name, chapterName, chapterApiData, author, status, rank = -1
    }:
    TComicItemHorizontal) => {
    return (
        <figure className="flex gap-4 relative">
            {/* Thumb */}
            <Link href={`/${CONFIG_SLUG.DETAIL}/${slug}.html`}>
                <ComicImage
                    src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${thumbUrl}`}
                    alt={name}
                    // priority={index <= 0}
                />
            </Link>

            <figcaption className="flex flex-col justify-between">

                {/* Title*/}
                <Link href={`/${CONFIG_SLUG.DETAIL}/${slug}.html`}>
                    <h2 className='text-base lg:text-lg font-medium line-clamp-3' title={name}>
                        {name}
                    </h2>
                </Link>

                {/* Chapter */}
                {chapterName && chapterApiData && (
                    <Link
                        href={buildReadingUrl(slug, chapterName, chapterApiData)}
                        className='text-link text-xs w-fit'
                    >
                        {`Chương ${chapterName}`}
                    </Link>
                )}


                <div className="text-xs">
                    {/* Status */}
                    <div
                        className='text-black/30 dark:text-white/30 mb-1'>{convertStatusToVi(status)}</div>

                    {/* Authors */}
                    <ul className="flex gap-x-2 gap-y-0.5 flex-wrap text-black/30 dark:text-white/30 text-xs">
                        {author?.length ? (
                            author.map((item, index) => (
                                <li key={index}>
                                    {item || 'Đang cập nhật'}
                                    {index < author.length - 1 && ','}
                                </li>
                            ))
                        ) : (
                            <li>Đang cập nhật</li>
                        )}
                    </ul>
                </div>
            </figcaption>
            {
                (rank > 0) && (
                    buildImgTopNumber({rank})
                )
            }
        </figure>
    )
}

export default ComicItemHorizontal;