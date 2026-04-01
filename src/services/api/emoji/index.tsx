// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import {IComment, IEmoji} from "@/types/api";

// ** Util and type
import {buildQueryString, TQueryParams} from "@/utils/buildQueryString";

export const EmojiService = {
    list: (params: TQueryParams): Promise<IApiRes<IModelPaginate<IEmoji>>> => {
        const query = buildQueryString(params)
        return authFetcherWithRefresh<IApiRes<IModelPaginate<IEmoji>>>(
            `${CONFIG_API.EMOJI.INDEX}?${query}`
        )
    }
}