'use server'

// ** Next
import {unstable_cache} from "next/cache";

// ** lib
import {fetcher} from "@/lib/fetcher";

// ** Config
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_TAG_OTRUYEN} from "@/configs/tag-otruyen";

// ** Type
import {IOTruyenChapter} from "@/types/api.otruyen";

export const getListImageChapter = unstable_cache(
    async (id: string) => {
        return fetcher<IApiOtruyenResDetail<IOTruyenChapter>>(`${CONFIG_API_OTRUYEN.CHAPTER}/${id}`);
    },
    [CONFIG_TAG_OTRUYEN.CHAPTER],
    {
        revalidate: 60,
    }
)