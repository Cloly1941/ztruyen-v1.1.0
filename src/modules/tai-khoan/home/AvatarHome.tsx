'use client'

// ** Component
import AvatarWithFrame from "@/components/common/AvatarWithFrame";

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Skeletons
import HomeAccountSkeleton from "@/skeletons/tai-khoan/trang-chu/HomeAccountSkeleton";

// ** Module Components
import DialogDeleteAccount from "@/modules/tai-khoan/home/DialogDeleteAccount";

// ** Services
import {UserService} from "@/services/api/user"

// ** Config
import {CONFIG_TAG} from "@/configs/tag"

// ** Type
import {IUserProfile} from "@/types/api"

const AvatarHome = () => {

    const {data: user, isLoading} = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
    })

    if (isLoading) {
        return <HomeAccountSkeleton name/>
    }

    if (!user) return null

    const frameUrl = user.avatar_frame?.image.url

    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
                <AvatarWithFrame
                    className='size-14 lg:size-20'
                    classAvatar='size-10 lg:size-14'
                    avatarUrl={user.avatar?.url}
                    avatarName={user.name}
                    frameUrl={frameUrl}
                    frameName={user.avatar_frame?.name}
                />
                <div className='flex flex-col justify-between'>
                    <div className='font-semibold text-sm lg:text-lg'>{user.name}</div>
                </div>
            </div>
            <DialogDeleteAccount userName={user.name}/>
        </div>
    )
}

export default AvatarHome