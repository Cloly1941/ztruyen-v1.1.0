'use client'

// ** React
import { useRef } from "react"

// ** Shadcn ui
import { Separator } from "@/components/ui/separator"

// ** Icon
import { ImagePlus, Loader2 } from "lucide-react"

// ** Hooks
import useMutateMethod from "@/hooks/common/useMutateMethod"
import useGetMethod from "@/hooks/common/useGetMethod"

// ** Services
import { ImageService } from "@/services/api/image"
import { UserService } from "@/services/api/user"

// ** Config
import { CONFIG_TAG } from "@/configs/tag"

// ** Module component
import AvatarAcc from "@/modules/tai-khoan/anh-dai-dien/AvatarAcc"

// ** Type
import {IUserProfile} from "@/types/api"

// ** Toast
import toast from "react-hot-toast"

type TUploadAvatarArgs = {
    file: File
    userName?: string
}

const FormUploadAvatar = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    const { data: user, isLoading, mutate } = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
    })

    const { trigger, isMutating } = useMutateMethod<IUserProfile, TUploadAvatarArgs>({
        api: async (arg) => {
            const uploadRes = await ImageService.upload({
                file: arg.file,
                caption: `avatar ${arg.userName ?? ''} ${Date.now()}`,
            })

            const imageId = uploadRes.data?._id

            if (!imageId) {
                throw new Error('Upload thất bại')
            }

            return UserService.updateProfileImage({ avatar: imageId })
        },
        key: CONFIG_TAG.IMAGE.UPLOAD,
        showToast: false,
        onSuccess: async () => {
            toast.success('Cập nhật ảnh đại diện thành công')
            await mutate()
        }
    })

    const handleChooseFile = () => {
        if (!isMutating) {
            inputRef.current?.click()
        }
    }

    return (
        <div>
            <div className="flex justify-center sm:mt-5">
                <div className="flex gap-6 sm:gap-10 items-center">

                    <button
                        type="button"
                        onClick={handleChooseFile}
                        disabled={isMutating}
                        className="flex gap-2 items-center text-sm
                            bg-gray-100 text-black/60 hover:bg-gray-200
                            dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700
                            py-8 px-5 rounded-md
                            transition-colors duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isMutating ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Đang upload...
                            </>
                        ) : (
                            <>
                                <ImagePlus className="size-5" />
                                Chọn ảnh đại diện
                            </>
                        )}
                    </button>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                trigger({
                                    file,
                                    userName: user?.name,
                                })
                            }
                        }}
                    />

                    <Separator orientation="vertical" />

                    <AvatarAcc
                        user={user as IUserProfile}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <p className='text-center mt-10 sm:mt-20 text-[13px] text-img'>
                Vui lòng chọn ảnh để tải lên: kích thước 80 * 80 pixel, hỗ trợ các định dạng JPG, PNG và các định dạng khác, dung lượng ảnh phải nhỏ hơn 2MB.
            </p>
        </div>
    )
}

export default FormUploadAvatar