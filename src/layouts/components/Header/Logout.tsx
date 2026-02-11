'use client'

// ** Components
import Loading from "@/components/common/Loading";

// ** Icon
import {LogOut} from "lucide-react";

// ** Hooks
import {useLogout} from "@/hooks/auth/useLogout"

const Logout = () => {

    const {trigger, isMutating} = useLogout()

    return (
        <>
            <div
                className={`text-red-500 flex gap-2 cursor-pointer ${isMutating ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => trigger()}
            >
                <LogOut className="text-inherit"/>
                Đăng xuất
            </div>

            {isMutating && <Loading/>}
        </>
    )
}

export default Logout