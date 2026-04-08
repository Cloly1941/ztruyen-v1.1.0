// ** Next
import Image from "next/image";

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Types
import {IUserProfile} from "@/types/api";

// ** Skeleton
import HomeAccountSkeleton from "@/skeletons/tai-khoan/trang-chu/HomeAccountSkeleton";

// ** Config
import {CONFIG_IMG} from "@/configs/img";

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
                <Image src={CONFIG_IMG.AVATAR_FALLBACK} alt='ảnh đại diện dự phòng' fill/>
            </AvatarFallback>
        </Avatar>
    );
}

export default AvatarAcc