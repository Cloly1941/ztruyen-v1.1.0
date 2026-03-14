// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import {IFrame} from "@/types/api";

export const FrameService = {
    list: async (): Promise<IApiRes<IModelPaginate<IFrame>>> => {
        const res = await authFetcherWithRefresh<IApiRes<IModelPaginate<IFrame>>>(CONFIG_API.FRAME.INDEX)

        return res
    }
}