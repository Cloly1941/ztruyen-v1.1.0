// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Types
import {IUserProfile} from "@/types/api";

// ** Configs
import {CONFIG_API} from "@/configs/api";

export const UserService = {
    getProfile: async (): Promise<IApiRes<IUserProfile>> => {
        const res = await authFetcherWithRefresh<IApiRes<IUserProfile>>(CONFIG_API.USER.PROFILE)

        return res
    },
}