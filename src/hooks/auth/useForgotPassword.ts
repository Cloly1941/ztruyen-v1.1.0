// ** SWR
import useSWRMutation from 'swr/mutation'

// ** react hot toast
import toast from 'react-hot-toast'

// ** Next
import {useRouter} from 'next/navigation'

// ** Services
import {AuthService} from '@/services/auth'

// ** Modules
import {TForgotPassForm} from '@/modules/quen-mat-khau/FormSendMail'

// ** Configs
import {CONFIG_TAG} from "@/configs/tag";

export const useForgotPassword = (cfToken: string | null) => {
    const router = useRouter()

    return useSWRMutation(
        CONFIG_TAG.AUTH.FORGOT,
        async (_key, {arg}: { arg: TForgotPassForm }) => {
            if (!cfToken) {
                throw new Error('Vui lòng xác thực bạn không phải bot')
            }

            return AuthService.forgotPassword(arg, cfToken)
        },
        {
            onSuccess(data) {
                toast.success(data.message)
                router.push('/')
            },
            onError(error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Đã có lỗi xảy ra khi gửi email'
                )
            },
        }
    )
}
