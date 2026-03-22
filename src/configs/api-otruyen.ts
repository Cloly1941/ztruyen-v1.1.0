const baseUrl = process.env.NEXT_PUBLIC_API_OTRUYEN_URL;
const imgChapterUrl = process.env.NEXT_PUBLIC_API_URL_CHAPTER_OUT_SIDE
const chapterUrl = imgChapterUrl + '/v1/api'

export const CONFIG_API_OTRUYEN = {
    HOME: `${baseUrl}/home`,
    LIST: `${baseUrl}/danh-sach`,
    CATEGORY: `${baseUrl}/the-loai`,
    COMIC: `${baseUrl}/truyen-tranh`,
    SEARCH: `${baseUrl}/tim-kiem`,
    CHAPTER: `${chapterUrl}/chapter`,
    IMAGE_COMIC: process.env.NEXT_PUBLIC_API_OTRUYEN_IMAGE_COMIC,
    IMAGE_CHAPTER: imgChapterUrl,
} as const
