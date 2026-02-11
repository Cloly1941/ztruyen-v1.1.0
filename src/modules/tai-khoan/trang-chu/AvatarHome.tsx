'use client'

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Hooks
import {useProfile} from "@/hooks/auth/useProfile";

// ** Skeletons
import HomeAccountSkeleton from "@/skeletons/tai-khoan/trang-chu/HomeAccountSkeleton";

const AvatarHome = () => {

    const {data: user, isLoading} = useProfile()

    if (isLoading) {
        return <HomeAccountSkeleton name/>
    }

    if (!user) return null

    return (
        <div className='flex items-center gap-4'>
            <Avatar className='size-10 lg:size-14'>
                <AvatarImage src={user.avatar?.url} alt={user.name}/>
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col justify-between'>
                <div className='font-semibold text-sm lg:text-lg'>{user.name}</div>
            </div>
        </div>
    )
}

export default AvatarHome