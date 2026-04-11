// ** Next
import Link from "next/link";

// ** Components
import ErrorText from "@/components/common/ErrorText";
import ComicImage from "@/components/common/ComicImage";

// ** Services
import {getListByStatus} from "@/services/api-otruyen/list";

// ** Enum
import {ESlug} from "@/types/enum";

// ** Configs
import {CONFIG_SLUG} from "@/configs/slug";

// ** Type
import {IOtruyenListComic} from "@/types/api.otruyen";

// ** Icon
import {CalendarRange, Wifi} from "lucide-react";

// ** Util
import {convertStatusToVi} from "@/utils/convertStatusComicToVi";
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";

const DetailRecommendedComic = async () => {

    const res = await getListByStatus(ESlug.NEW);

    const listRecommendedComic = res.data?.items.slice(0, 6)

    if (!listRecommendedComic) return <ErrorText/>

    return (
        <section className="bg-section-detail p-5 lg:w-[29%] xl:w-[23%] h-min">
            <div className="flex items-center justify-between">
                <h2 className='text-lg font-medium'>Đề xuất</h2>
                <Link href={`/${CONFIG_SLUG.LIST}/truyen-moi`} className="text-sm">
                    Xem thêm
                </Link>
            </div>
            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2'>
                {listRecommendedComic.map((item: IOtruyenListComic, index: number) => {
                    return (
                        <figure className="flex mt-4 gap-3" key={index}>
                            <div className="w-[80px] sm:w-[100px] lg:w-[35%] shrink-0">
                                {/* Thumbnail */}
                                <Link href={`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`} key={index}>
                                    <ComicImage
                                        src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.thumb_url}`}
                                        alt={item.name}
                                        priority={index <= 0}
                                        size='full'
                                    />
                                </Link>
                            </div>

                            {/* Content */}
                            <figcaption className="w-[64%] flex justify-between flex-col">
                                {/* Title */}
                                <Link
                                    href={`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`}
                                    key={index}
                                >
                                    <h3 className='line-clamp-2 text-sm'>{item.name}</h3>
                                </Link>
                                {/* Status */}
                                <div className="flex gap-1 items-center">
                                    <Wifi
                                        className="size-3.5 flex-shrink-0 rotate-45 text-black/50 dark:text-white/50"/>
                                    <span className="text-xs">{convertStatusToVi(item.status)}</span>
                                </div>
                                {/* Chapter */}
                                <div className="text-sm flex gap-1 items-center">
                                    <CalendarRange
                                        className='size-3.5 flex-shrink-0 text-black/50 dark:text-white/50'/>
                                    <span
                                        className="text-xs line-clamp-1"
                                        title={`${item.chaptersLatest !== null ? `${item?.chaptersLatest[0]?.chapter_name} chương` : 'Đang cập nhật'}`}
                                    >{`${item.chaptersLatest !== null ? `${item?.chaptersLatest[0]?.chapter_name} chương` : 'Đang cập nhật'} `}</span>
                                </div>
                            </figcaption>
                        </figure>
                    );
                })}
            </ul>
        </section>
    )
}

export default DetailRecommendedComic