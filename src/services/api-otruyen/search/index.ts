'use server'

// ** lib
import {fetcher} from "@/lib/fetcher";

// ** Config
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CACHE_TIME} from "@/configs/cache-time";
import {CONFIG_TAG_OTRUYEN} from "@/configs/tag-otruyen";

// ** Type
import {IOtruyenSearchComic} from "@/types/api.otruyen";

export const getListBySearch = (keyword: string, pageQuery = 1) =>
    unstable_cache(
        async () => {
            return fetcher<IApiOtruyenResWPagination<IOtruyenSearchComic[]>>(
                `${CONFIG_API_OTRUYEN.SEARCH}?keyword=${keyword}&page=${pageQuery}`
            );
        },
        [CONFIG_TAG_OTRUYEN.SEARCH, keyword, String(pageQuery)],
        {
            revalidate: 3 * CACHE_TIME.SECOND,
        }
    )();