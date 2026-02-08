'use client'

// ** React
import {useEffect, useState} from "react";

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

// ** Types
import {IUserProfile} from "@/types/api";

// ** Services
import {UserService} from "@/services/user";

// ** Icons
import {Heart, User} from "lucide-react";

// ** Skeleton
import AvatarSkeleton from "@/skeletons/layouts/AvatarSkeletons";

const AccountMenu = () => {

    const [user, setUser] = useState<IUserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await UserService.getProfile()
                setUser(res.data ?? null)
            } catch (error) {
                console.error('GET thông tin người dùng lỗi', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) {
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
                <DropdownMenuContent className="w-40" align="center">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel
                            className='text-black dark:text-white font-bold text-center truncate'>{user.name}</DropdownMenuLabel>
                        <Link href='thong-tin-nguoi-dung'>
                            <DropdownMenuItem>
                                <User className='text-inherit'/>
                                Thông tin
                            </DropdownMenuItem>
                        </Link>
                        <Link href='truyen-yeu-thich'>
                            <DropdownMenuItem>
                                <Heart className='text-inherit'/>
                                Yêu thích
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