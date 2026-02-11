'use client'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** react hot toast
import toast from 'react-hot-toast'

// ** Services
import {ImageService} from '@/services/image'
import { UserService } from '@/services/user'

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

type UploadArg = {
    file: File
    userName?: string
}

async function uploadAvatar(_: string, { arg }: { arg: UploadArg  }) {
    const payload = {
        file: arg.file,
        caption: `avatar ${arg.userName ?? ''} ${Date.now()}`,
    }

    // Upload image
    const uploadRes = await ImageService.upload(payload)
    const imageId = uploadRes.data?._id

    if (!imageId) {
        throw new Error('Upload thất bại')
    }

    // Update profile
    await UserService.updateProfileImage({
        avatar: imageId,
    })
}

export function useUploadAvatar(onSuccess?: () => void) {
    return useSWRMutation(CONFIG_TAG.IMAGE.UPLOAD, uploadAvatar, {
        onSuccess: () => {
            toast.success('Cập nhật ảnh đại diện thành công')
            onSuccess?.()
        },
        onError(error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Đã có lỗi xảy ra khi câp nhật ảnh đại diện'
            )
        },
    })
}
