'use client'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** Toast
import toast from 'react-hot-toast'

// ** Services
import { AuthService } from '@/services/auth'

// ** Modules
import {TChangePasswordPayload} from "@/modules/quen-mat-khau/FormChangePassword";

// ** Config
import { CONFIG_TAG } from '@/configs/tag'

type ChangePasswordArgs = {
    payload: TChangePasswordPayload
    token: string
}

export const useChangePassword = () => {
    return useSWRMutation(
        CONFIG_TAG.AUTH.RESET,
        async (_key, { arg }: { arg: ChangePasswordArgs }) => {
            const res = await AuthService.resetPassword(arg.payload, arg.token)
            return res
        },
        {
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Đã có lỗi xảy ra khi đổi mật khẩu, vui lòng thử lại sau!'
                )
            },
        }
    )
}
