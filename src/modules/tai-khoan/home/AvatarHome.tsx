'use client'

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Skeletons
import HomeAccountSkeleton from "@/skeletons/tai-khoan/trang-chu/HomeAccountSkeleton";

// ** Module Components
import DialogDeleteAccount from "@/modules/tai-khoan/home/DialogDeleteAccount";

// ** Services
import { UserService } from "@/services/api/user"

// ** Config
import { CONFIG_TAG } from "@/configs/tag"

// ** Type
import { IUserProfile } from "@/types/api"

const AvatarHome = () => {

    const {data: user, isLoading} = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
    })

    if (isLoading) {
        return <HomeAccountSkeleton name/>
    }

    if (!user) return null

    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
                <Avatar className='size-10 lg:size-14'>
                    <AvatarImage src={user.avatar?.url} alt={user.name}/>
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col justify-between'>
                    <div className='font-semibold text-sm lg:text-lg'>{user.name}</div>
                </div>
            </div>
            <DialogDeleteAccount userName={user.name}/>
        </div>
    )
}

export default AvatarHome