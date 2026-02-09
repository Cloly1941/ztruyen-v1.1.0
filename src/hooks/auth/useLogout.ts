'use client'

// ** SWR
import useSWRMutation from 'swr/mutation'
import { mutate } from 'swr'

// ** Next
import { useRouter } from 'next/navigation'

// ** toast
import toast from 'react-hot-toast'

// ** Services
import { AuthService } from '@/services/auth'

// ** Configs
import { CONFIG_TAG } from '@/configs/tag'

// ** Utils
import { sleep } from '@/utils/sleep'

export const useLogout = () => {
    const router = useRouter()

    return useSWRMutation(
        CONFIG_TAG.AUTH.LOGOUT,
        async () => {
            const [res] = await Promise.all([
                AuthService.logout(),
                sleep(600),
            ])

            return res
        },
        {
            onSuccess: (res) => {
                toast.success(res.message)

                // clear profile cache
                mutate(CONFIG_TAG.USER.PROFILE, null, false)

                router.refresh()
            },
            onError: (error) => {
                if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error('Đã có lỗi xảy ra khi đăng xuất, vui lòng thử lại sau!')
                }
            },
        }
    )
}
