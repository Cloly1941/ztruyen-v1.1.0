'use client'

// ** React
import {useState} from "react";

// ** Next
import {useRouter} from "next/navigation";

// ** react hot toast
import toast from "react-hot-toast";

// ** Components
import Loading from "@/components/common/Loading";

// ** Icon
import {LogOut} from "lucide-react";

// ** Service
import {AuthService} from "@/services/auth";

// ** Utils
import {sleep} from "@/utils/sleep";

const Logout = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const handleLogout = async () => {
        setLoading(true);

        try {
            const [res] = await Promise.all([
                AuthService.logout(),
                sleep(600),
            ]);

            toast.success(res.message);

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Đã có lỗi xảy ra khi đăng xuất, vui lòng thử lại sau!');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div
                className="text-red-500 flex gap-2 cursor-pointer"
                onClick={handleLogout}
            >
                <LogOut className="text-inherit" />
                Đăng xuất
            </div>

            {loading && <Loading />}
        </>
    )
}

export default Logout