'use server'

// ** Next
import {unstable_cache} from "next/cache";

// ** lib
import {fetcher} from "@/lib/fetcher";

// ** Config
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_TAG_OTRUYEN} from "@/configs/tag-otruyen";

// ** Type
import {IOtruyenSearchComic} from "@/types/api.otruyen";

export const getListBySearch = unstable_cache(
    async (keyword: string, pageQuery: number = 1) => {
        return fetcher<IApiOtruyenResWPagination<IOtruyenSearchComic[]>>(`${CONFIG_API_OTRUYEN.SEARCH}?keyword=${keyword}&page=${pageQuery}`);
    },
    [CONFIG_TAG_OTRUYEN.SEARCH],
    {
        revalidate: 30,
    }
)