'use client'

// ** Next
import Link from "next/link";

// ** Layout components
import Logout from "@/layouts/components/Header/Logout";

// ** Shadcn ui
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ** Icons
import {Heart, User} from "lucide-react";

// ** Skeleton
import AvatarSkeleton from "@/skeletons/layouts/AvatarSkeleton";

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod"

// ** Services
import {UserService} from "@/services/api/user"

// ** Config
import {CONFIG_TAG} from "@/configs/tag"

// ** Type
import {IUserProfile} from "@/types/api"
import AvatarWithFrame from "@/components/common/AvatarWithFrame";

const AccountMenu = () => {

    const {data: user, isLoading} = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
        revalidateIfStale: false,
    })

    if (isLoading) {
        return (
            <AvatarSkeleton/>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="relative">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                    <AvatarWithFrame
                        className='mt-1'
                        size={40}
                        avatarName={user.name}
                        avatarUrl={user.avatar?.url}
                        frameName={user.avatar_frame?.name}
                        frameUrl={user.avatar_frame?.image.url}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="center">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel
                            className='text-black dark:text-white font-bold text-center truncate'>{user.name}</DropdownMenuLabel>
                        <Link href="/tai-khoan">
                            <DropdownMenuItem>
                                <User className="text-inherit"/>
                                Tài khoản
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/tai-khoan/truyen-yeu-thich">
                            <DropdownMenuItem>
                                <Heart className="text-inherit"/>
                                Yêu thích
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Logout/>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default AccountMenu