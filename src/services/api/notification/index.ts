// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import {INotification} from "@/types/api";

// ** Util and type
import {buildQueryString, TQueryParams} from "@/utils/buildQueryString";

export const NotificationService = {
    list: (params: TQueryParams): Promise<IApiRes<IModelPaginateNotification<INotification>>> => {
        const query = buildQueryString(params)
        return authFetcherWithRefresh<IApiRes<IModelPaginateNotification<INotification>>>(
            `${CONFIG_API.NOTIFICATION.INDEX}?${query}`
        )
    },
    readAll: () => {
        return authFetcherWithRefresh<IApiRes<void>>(
            `${CONFIG_API.NOTIFICATION.READ_ALL}`,{
                method: 'PATCH',
            }
        )
    },
    deleteAll: () => {
        return authFetcherWithRefresh<IApiRes<void>>(
            `${CONFIG_API.NOTIFICATION.DELETE_ALL}`,{
                method: 'DELETE',
            }
        )
    }
}