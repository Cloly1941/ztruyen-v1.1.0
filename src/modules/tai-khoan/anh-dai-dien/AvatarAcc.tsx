// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Types
import {IUserProfile} from "@/types/api";

// ** Skeleton
import HomeAccountSkeleton from "@/skeletons/tai-khoan/trang-chu/HomeAccountSkeleton";

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
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}

export default AvatarAcc