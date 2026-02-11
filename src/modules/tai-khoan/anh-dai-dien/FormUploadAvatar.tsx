'use client'

// ** React
import { useRef } from "react"

// ** Shadcn ui
import { Separator } from "@/components/ui/separator"

// ** Icon
import { ImagePlus, Loader2 } from "lucide-react"

// ** Hooks
import { useProfile } from "@/hooks/auth/useProfile"
import { useUploadAvatar } from "@/hooks/user/useUploadAvatar"

// ** Module component
import AvatarAcc from "@/modules/tai-khoan/anh-dai-dien/AvatarAcc"

// ** Type
import { IUserProfile } from "@/types/api"

const FormUploadAvatar = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { data: user, isLoading, mutate } = useProfile()

    const { trigger, isMutating } = useUploadAvatar(async () => {
        await mutate()
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
            <p className='text-center mt-10 sm:mt-20 text-xs text-gray-400'>Vui lòng chọn ảnh để tải lên: kích thước 80 * 80 pixel, hỗ trợ các định dạng JPG, PNG và các định dạng khác, dung lượng ảnh phải nhỏ hơn 2MB.</p>
        </div>
    )
}

export default FormUploadAvatar
