// ** Next
import Image from "next/image";

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Types
import {IUserProfile} from "@/types/api";

// ** Skeleton
import HomeAccountSkeleton from "@/skeletons/tai-khoan/trang-chu/HomeAccountSkeleton";

// ** Image
import AvatarFallBack from "@/public/avatar-fallback.webp";

type TAvatarAccount = {
    user: IUserProfile;
    isLoading: boolean;
}

const AvatarAcc = ({user, isLoading}: TAvatarAccount) => {

    if (isLoading) return <HomeAccountSkeleton className='size-15 lg:size-20'/>

    if (!user) return null

    return (
        <Avatar className='size-15 lg:size-20'>
            <AvatarImage src={user.avatar?.url} alt={user.name}/>
            <AvatarFallback className='relative size-15 lg:size-20'>
                <Image src={AvatarFallBack} alt='ảnh đại diện dự phòng' fill placeholder='blur'/>
            </AvatarFallback>
        </Avatar>
    );
}

export default AvatarAcc