// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import {IFrame} from "@/types/api";

// ** Util and type
import {buildQueryString, TQueryParams} from "@/utils/buildQueryString";

export const FrameService = {
    list: (params: TQueryParams): Promise<IApiRes<IModelPaginate<IFrame>>> => {
        const query = buildQueryString(params)
        return authFetcherWithRefresh<IApiRes<IModelPaginate<IFrame>>>(
            `${CONFIG_API.FRAME.INDEX}?${query}`
        )
    }
}