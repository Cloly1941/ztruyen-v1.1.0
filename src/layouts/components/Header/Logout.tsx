'use client'

// ** Next
import {useRouter} from "next/navigation";

// ** React hot toast
import toast from "react-hot-toast";

// ** Swr
import {mutate} from "swr";

// ** Components
import Loading from "@/components/common/Loading";

// ** Icon
import {LogOut} from "lucide-react";

// ** Hooks
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

// ** Service
import {AuthService} from "@/services/api/auth";

const Logout = () => {

    const router = useRouter();

    const {trigger, isMutating} = useMutateMethod<null, void>({
        api: () => AuthService.logout(),
        key: CONFIG_TAG.AUTH.LOGOUT,
        showToast: false,
        onSuccess: (res) => {
            toast.success(res.message)
            mutate(CONFIG_TAG.USER.PROFILE, null, false)
            router.refresh()
        }
    })

    return (
        <>
            <div
                className={`text-destructive flex gap-2 cursor-pointer ${isMutating ? 'pointer-events-none opacity-50' : ''}`}
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