'use server'

// ** lib
import {fetcher} from "@/lib/fetcher";

// ** Config
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";

// ** Type
import {IOtruyenSearchComic} from "@/types/api.otruyen";

export const getListBySearch = async (keyword: string, pageQuery: number = 1) => {
    return fetcher<IApiOtruyenResWPagination<IOtruyenSearchComic[]>>(`${CONFIG_API_OTRUYEN.SEARCH}?keyword=${keyword}&page=${pageQuery}`);
}
