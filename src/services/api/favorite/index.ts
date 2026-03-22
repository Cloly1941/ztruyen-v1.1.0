// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import {IFavorite, IFavoriteToggle} from "@/types/api";

// ** Util and type
import {buildQueryString, TQueryParams} from "@/utils/buildQueryString";

// ** Type
import {TFavoriteBtnPayload} from "@/modules/truyen-tranh/FavoriteBtn";

export const FavoriteService = {
    list: (params: TQueryParams): Promise<IApiRes<IModelPaginate<IFavorite>>> => {
        const query = buildQueryString(params)
        return authFetcherWithRefresh<IApiRes<IModelPaginate<IFavorite>>>(
            `${CONFIG_API.FAVORITE.INDEX}?${query}`
        )
    },

    check: (slug: string) => {
        return authFetcherWithRefresh<IApiRes<IFavoriteToggle>>(
            `${CONFIG_API.FAVORITE.CHECK}/${slug}`
        )
    },

    toggle: (payload: TFavoriteBtnPayload) => {
        return authFetcherWithRefresh<IApiRes<IFavoriteToggle>>(CONFIG_API.FAVORITE.TOGGLE, {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },

    delete: (id: string) => {
      return authFetcherWithRefresh<IApiRes<void>>(`${CONFIG_API.FAVORITE.DELETE}/${id}`, {
          method: 'DELETE'
      })
    },

    deleteMulti: (ids: string[]) => {
        return authFetcherWithRefresh<IApiRes<void>>(CONFIG_API.FAVORITE.DELETE_MULTI, {
            method: 'DELETE',
            body: JSON.stringify({ids: ids})
        })
    }
}