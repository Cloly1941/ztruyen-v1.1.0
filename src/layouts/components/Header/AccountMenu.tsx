'use client'

// ** Next
import Link from "next/link";

// ** Layout components
import Logout from "@/layouts/components/Header/Logout";

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
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
import AvatarSkeleton from "@/skeletons/layouts/AvatarSkeletons";

// ** Hooks
import {useProfile} from "@/hooks/auth/useProfile";

const AccountMenu = () => {

    const { data: user, isLoading } = useProfile()

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
                <DropdownMenuTrigger asChild>
                    <Avatar className='cursor-pointer'>
                        <AvatarImage src={user.avatar?.url} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-45" align="center">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel
                            className='text-black dark:text-white font-bold text-center truncate'>{user.name}</DropdownMenuLabel>
                        <Link href="/tai-khoan/thong-tin-ca-nhan">
                            <DropdownMenuItem>
                                <User className="text-inherit" />
                                Thông tin cá nhân
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/tai-khoan/truyen-yeu-thich">
                            <DropdownMenuItem>
                                <Heart className="text-inherit" />
                                Truyện yêu thích
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Logout />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default AccountMenu