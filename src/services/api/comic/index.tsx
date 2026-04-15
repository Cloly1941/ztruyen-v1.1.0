'use server'

// ** Next
import {unstable_cache} from "next/cache";

// ** lib
import {fetcher} from "@/lib/fetcher";

// ** Config
import {CONFIG_API} from "@/configs/api";
import {CONFIG_TAG} from "@/configs/tag";
import {CACHE_TIME} from "@/configs/cache-time";

// ** Utils
import {buildQueryString, TQueryParams} from "@/utils/buildQueryString";

// ** Type
import {IComic} from "@/types/api";

export async function getTopComic(params: TQueryParams) {
    const query = buildQueryString(params);

    return unstable_cache(
        async () => {
            return fetcher<IApiRes<IModelPaginate<IComic>>>(
                `${CONFIG_API.COMIC.INDEX}?${query}`
            );
        },
        [
            CONFIG_TAG.COMIC.LIST,
            query,
        ],
        {
            revalidate: 7 * CACHE_TIME.DAY,
        }
    )();
}