// ** Next
import Link from "next/link";

// ** Components
import ErrorText from "@/components/common/ErrorText";
import ComicItemHorizontal from "@/components/common/ComicItemHorizontal";

// ** Service
import {getTopComic} from "@/services/api/comic";

// ** Type
import {TStatus} from "@/types/api.otruyen";
import {TQueryParams} from "@/utils/buildQueryString";

// ** Utils
import {getCountryLabel} from "@/utils/getCountryLabel";

// ** Lib
import {cn} from "@/lib/utils";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";
import removeExtension from "@/utils/removeExtension";

type TRankingPage = {
    params: Promise<{ country: string }>
}

const COUNTRY_TABS = [
    {label: "Trung", value: "trung"},
    {label: "Nhật", value: "nhat"},
    {label: "Hàn", value: "han"},
]

const COUNTRY_DESC: Record<string, string> = {
    trung: "Những bộ manhua Trung Quốc được đọc nhiều nhất tuần này.",
    nhat: "Những bộ manga Nhật Bản được yêu thích nhất tuần qua.",
    han: "Những bộ manhwa Hàn Quốc đang hot nhất tuần này.",
}

const RankingPage = async ({params}: TRankingPage) => {

    const {country} = await params

    const countryComic = removeExtension(country, '.html')

    const queryParams: TQueryParams = {
        page: 1,
        limit: 50,
        sort: 'rank',
        filters: {
            country: [countryComic]
        },
    }

    const res = await getTopComic(queryParams)

    const listTopComic = res.data?.result

    if (!listTopComic) return <ErrorText/>

    const countryLabel = getCountryLabel(countryComic)
    const desc = COUNTRY_DESC[countryComic] ?? `Top truyện ${countryLabel} được đọc nhiều nhất tuần qua.`

    return (
        <section className='pb-20'>

            <div className='section-header gap-2.5 sm:gap-4 flex-col md:flex-row container py-5'>
                <h1 className='heading py-0' title={`Top truyện ${countryLabel} hot nhất tuần qua`}>
                    Top truyện {countryLabel} hot nhất tuần qua
                </h1>
                <p className='desc'>{desc}</p>
            </div>
            <nav className="container flex items-baseline gap-4 pb-6">
                <p className="flex-shrink-0 text-sm dark:text-[#ffffffbd] text-[#00000057]">
                    Quốc gia
                </p>

                <ul className="flex flex-wrap text-sm">
                    {COUNTRY_TABS.map((tab) => {
                        const isActive = countryComic === tab.value

                        return (
                            <li key={tab.value}>
                                <Link
                                    href={`/${CONFIG_SLUG.TOP_WEEK}/${tab.value}.html`}
                                    className={cn(
                                        "cursor-pointer px-[10px] py-1 transition active:text-primary block",
                                        isActive && "text-primary"
                                    )}
                                >
                                    {tab.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            <div className='container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12'>
                {
                    listTopComic.map((comic) => {
                        return (
                            <ComicItemHorizontal
                                key={comic._id}
                                name={comic.name}
                                thumbUrl={comic.thumb_url}
                                slug={comic.slug}
                                status={comic.status as TStatus}
                                author={comic.authors}
                                chapterName={comic.latest_chapter}
                                chapterApiData={comic.chapter_api_data}
                                rank={comic.rank}
                            />
                        )
                    })
                }
            </div>
        </section>
    )
}

export default RankingPage