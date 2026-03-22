// SWR
import { mutate as globalMutate } from "swr"

// ** Config
import { CONFIG_TAG } from "@/configs/tag"

export const invalidateFavorite = async (slug: string) => {
    await globalMutate(
        (key: unknown) => Array.isArray(key) && key[0] === CONFIG_TAG.FAVORITE.LIST,
        undefined,
        { revalidate: true }
    )
    await globalMutate(`${CONFIG_TAG.FAVORITE.INDEX}-${slug}`, undefined, { revalidate: true })
}

export const invalidateFavoriteMulti = async (slugs: string[]) => {
    await globalMutate(
        (key: unknown) => Array.isArray(key) && key[0] === CONFIG_TAG.FAVORITE.LIST,
        undefined,
        { revalidate: true }
    )
    slugs.forEach(slug =>
        globalMutate(`${CONFIG_TAG.FAVORITE.INDEX}-${slug}`, undefined, { revalidate: true })
    )
}