// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";
import {removeAccessToken} from "@/lib/localStorage";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import {IUserProfile} from "@/types/api";

// ** Module type
import {TUpdateProfilePayload} from "@/modules/tai-khoan/thong-tin-ca-nhan/FormUpdateProfile";
import {TChangePasswordPayload} from "@/modules/tai-khoan/doi-mat-khau/FormChangePassword";

export type TUploadProfileImagePayload = {
    avatar?: string;
    avatar_frame?: string;
    cover?: string
}

export const UserService = {
    getProfile: (): Promise<IApiRes<IUserProfile>> => {
        return authFetcherWithRefresh<IApiRes<IUserProfile>>(CONFIG_API.USER.PROFILE)
    },
    updateProfile: (payload: TUpdateProfilePayload): Promise<IApiRes<IUserProfile>> => {
        return authFetcherWithRefresh<IApiRes<IUserProfile>>(CONFIG_API.USER.PROFILE, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        })
    },
    updateProfileImage: (payload: TUploadProfileImagePayload): Promise<IApiRes<IUserProfile>> => {
        return authFetcherWithRefresh<IApiRes<IUserProfile>>(CONFIG_API.USER.PROFILE, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        })
    },
    deleteProfile: async (): Promise<IApiRes<void>> => {
        const res = await authFetcherWithRefresh<IApiRes<void>>(CONFIG_API.USER.PROFILE, {
            method: 'DELETE',
        })

        removeAccessToken();

        return res
    },
    changePassword: (payload: TChangePasswordPayload): Promise<IApiRes<void>> => {
        return authFetcherWithRefresh<IApiRes<void>>(CONFIG_API.USER.CHANGE_PASSWORD, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        })
    },
    saveFcmToken: (token: string) =>
        authFetcherWithRefresh(`${CONFIG_API.USER.FCM}`, {
            method: 'POST',
            body: JSON.stringify({token}),
        }),
    removeFcmToken: (token: string) =>
        authFetcherWithRefresh(`${CONFIG_API.USER.FCM}${CONFIG_API.USER.REMOVE}`, {
            method: 'PATCH',
            body: JSON.stringify({token}),
        }),
    subscribeToTopic: (token: string, topic: string) =>
        authFetcherWithRefresh(`${CONFIG_API.USER.FCM}${CONFIG_API.USER.SUBSCRIBE_TOPIC}`, {
            method: 'POST',
            body: JSON.stringify({token, topic}),
        }),

    unsubscribeFromTopic: (token: string, topic: string) =>
        authFetcherWithRefresh(`${CONFIG_API.USER.FCM}${CONFIG_API.USER.UNSUBSCRIBE_TOPIC}`, {
            method: 'POST',
            body: JSON.stringify({token, topic}),
        }),
}