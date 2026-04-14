'use server'

// ** Next
import {unstable_cache} from "next/cache";

// ** lib
import {fetcher} from "@/lib/fetcher";

// ** Config
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_TAG_OTRUYEN} from "@/configs/tag-otruyen";
import {CACHE_TIME} from "@/configs/cache-time";

// ** Type
import {IOtruyenListComic, IOtruyenListGenre} from "@/types/api.otruyen";
import {ESortField, ESortType} from "@/types/enum";

export const getListGenre = unstable_cache(
    async () => {
        return fetcher<IApiOtruyenRes<IOtruyenListGenre[]>>(CONFIG_API_OTRUYEN.CATEGORY);
    },
    [CONFIG_TAG_OTRUYEN.LIST_CATEGORY],
    {
        revalidate: 30 * CACHE_TIME.DAY,
    }
)

export const getListByGender = (
    slug: string,
    pageQuery: number = 1,
    sortField: ESortField = ESortField.UPDATED_AT,
    sortType: ESortType = ESortType.DESC
) =>
    unstable_cache(
        async () => {
            return fetcher<IApiOtruyenResWPagination<IOtruyenListComic[]>>(
                `${CONFIG_API_OTRUYEN.CATEGORY}/${slug}?page=${pageQuery}&sort_field=${sortField}&sort_type=${sortType}`
            );
        },
        [
            CONFIG_TAG_OTRUYEN.CATEGORY,
            slug,
            String(pageQuery),
            sortField,
            sortType,
        ],
        {
            revalidate: CACHE_TIME.MINUTE,
        }
    )();