// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import {IEmojiCategories} from "@/types/api";

export const EmojiCategoriesService = {
    list: (): Promise<IApiRes<IEmojiCategories[]>> => {
        return authFetcherWithRefresh<IApiRes<IEmojiCategories[]>>(
            `${CONFIG_API.EMOJI_CATEGORIES.INDEX}`
        )
    }
}