'use client'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** react hot toast
import toast from 'react-hot-toast'

// ** Services
import { AuthService } from '@/services/auth'

// Module
import { TRegisterPayload } from '@/modules/dang-ky/FormRegister'

// ** Configs
import {CONFIG_TAG} from "@/configs/tag";

type RegisterArgs = {
    payload: TRegisterPayload
    cfToken: string
}

export const useRegister = () => {
    return useSWRMutation(
        CONFIG_TAG.AUTH.REGISTER,
        async (_, { arg }: { arg: RegisterArgs }) => {
            const res = await AuthService.register(arg.payload, arg.cfToken)
            return res
        },
        {
            onError: (error) => {
                toast.error(
                    error?.message ??
                    'Đã có lỗi xảy ra khi đăng ký, vui lòng thử lại sau!'
                )
            },
        }
    )
}
