'use server'

// ** Next
import {unstable_cache} from "next/cache";

// ** lib
import {fetcher} from "@/lib/fetcher";

// ** Config
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_TAG_OTRUYEN} from "@/configs/tag-otruyen";

// ** Type
import {IOtruyenListComic} from "@/types/api.otruyen";

// ** Enums
import {ESlug, ESortField, ESortType} from "@/types/enum";

export const getListByStatus = unstable_cache(
    async (slug: ESlug, pageQuery: number = 1, sortField: ESortField = ESortField.UPDATED_AT, sortType: ESortType = ESortType.DESC) => {
        return fetcher<IApiOtruyenResWPagination<IOtruyenListComic[]>>(`${CONFIG_API_OTRUYEN.LIST}/${slug}?page=${pageQuery}&sort_field=${sortField}&sort_type=${sortType}`);
    },
    [CONFIG_TAG_OTRUYEN.STATUS],
    {
        revalidate: 30,
    }
)