'use client'

// ** Components
import Loading from "@/components/common/Loading";

// ** Icon
import {LogOut} from "lucide-react";

// ** Hooks
import {useLogout} from "@/hooks/auth/useLogout";

// ** Services
import {UserService} from "@/services/user";

const Logout = () => {

    const {trigger, isMutating} = useLogout()

    const handleLogout = async () => {
        await UserService.getProfile()
        await trigger()
    }

    return (
        <>
            <div
                className="text-red-500 flex gap-2 cursor-pointer"
                onClick={handleLogout}
            >
                <LogOut className="text-inherit"/>
                Đăng xuất
            </div>

            {isMutating && <Loading/>}
        </>
    )
}

export default Logout