'use client'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** Toast
import toast from 'react-hot-toast'

// ** Services
import { UserService } from '@/services/user'

// ** Config
import { CONFIG_TAG } from '@/configs/tag'

// ** Module type
import {TUpdateProfilePayload} from "@/modules/tai-khoan/thong-tin-ca-nhan/FormUpdateProfile";

export const useUpdateProfile = () => {

    return useSWRMutation(
        CONFIG_TAG.USER.PROFILE,
        async (_, { arg }: { arg: TUpdateProfilePayload }) => {
            return await UserService.updateProfile(arg)
        },
        {
            onSuccess: (data) => {
                toast.success(data.message)
            },
            onError(error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Đã có lỗi xảy ra khi câp nhật thông tin cá nhân'
                )
            },
        }
    )
}
