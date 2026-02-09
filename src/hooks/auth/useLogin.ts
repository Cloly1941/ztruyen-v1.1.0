'use client'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** react hot toast
import toast from 'react-hot-toast'

// ** Services
import { AuthService } from '@/services/auth'

// ** Modules
import { TLoginForm } from '@/modules/dang-nhap/FormLogin'

// ** Configs
import { CONFIG_TAG } from '@/configs/tag'

type LoginArgs = {
    payload: TLoginForm
    cfToken: string
}

export const useLogin = () => {
    const mutation = useSWRMutation(
        CONFIG_TAG.AUTH.LOGIN,
        async (_key, { arg }: { arg: LoginArgs }) => {
            const res = await AuthService.login(arg.payload, arg.cfToken)
            return res
        },
        {
            onError(error) {
                toast.error(error?.message ?? 'Đăng nhập thất bại')
            },
        }
    )

    return mutation
}
