// ** lib
import {fetcher} from "@/lib/fetcher";

// ** Types
import {ILogin, IRegister} from "@/types/api";

// ** Configs
import {CONFIG_API} from "@/configs/api";
import {VARIABLE} from "@/configs/variable";

// ** Modules
import {TLoginForm} from "@/modules/dang-nhap/FormLogin";
import {TRegisterPayload} from "@/modules/dang-ky/FormRegister";
import {TForgotPassForm} from "@/modules/quen-mat-khau/FormSendMail";
import {TChangePasswordPayload} from "@/modules/quen-mat-khau/FormChangePassword";

export const AuthService = {
    login: async (payload: TLoginForm, cftoken: string): Promise<IApiRes<ILogin>> => {
        const res = await fetcher<IApiRes<ILogin>>(CONFIG_API.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({
                ...payload,
                cfToken: cftoken
            }),
        });

        if (typeof window !== 'undefined') {
            localStorage.setItem(VARIABLE.ACCESS_TOKEN, res.data?.access_token as string);
        }

        return res
    },

    refreshToken: async (): Promise<IApiRes<ILogin>> => {
        const res = await fetcher<IApiRes<ILogin>>(CONFIG_API.AUTH.REFRESH)

        if (typeof window !== 'undefined') {
            localStorage.setItem(VARIABLE.ACCESS_TOKEN, res.data?.access_token as string);
        }

        return res
    },

    register: async (payload: TRegisterPayload, cftoken: string): Promise<IApiRes<IRegister>> => {
        const res = await fetcher<IApiRes<IRegister>>(CONFIG_API.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify({
                ...payload,
                cfToken: cftoken
            }),
        });

        return res
    },

    forgotPassword: async (payload: TForgotPassForm, cftoken: string): Promise<IApiRes<null>> => {
        const res = await fetcher<IApiRes<null>>(CONFIG_API.AUTH.FORGOT, {
            method: 'POST',
            body: JSON.stringify({
                ...payload,
                cfToken: cftoken
            }),
        });

        return res
    },

    resetPassword: async (payload: TChangePasswordPayload, token: string): Promise<IApiRes<null>> => {
        const res = await fetcher<IApiRes<null>>(CONFIG_API.AUTH.RESET, {
            method: 'POST',
            body: JSON.stringify({
                ...payload,
                token: token
            }),
        });

        return res
    },
}

