// ** Utils
import getIdFromUrl from "@/utils/getIdFromUrl";

// ** Config
import { CONFIG_SLUG } from "@/configs/slug"

export const buildReadingUrl= (
    slugComic: string,
    chapterName: string,
    chapterApiData: string
) => {
    const chapterId = getIdFromUrl(chapterApiData, "/")

    return `/${CONFIG_SLUG.READING}/${slugComic}-chuong-${chapterName}-${chapterId}.html`
}