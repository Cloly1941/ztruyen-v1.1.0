'use client'

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Module component
import FormUpdateProfile from "@/modules/tai-khoan/thong-tin-ca-nhan/FormUpdateProfile";

// ** Types
import {IUserProfile} from "@/types/api";

// ** Service
import {UserService} from "@/services/api/user";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

const ProfileClient = () => {
    const {data: user, isLoading} = useGetMethod<IUserProfile | null>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
    })

    if (isLoading) {
        return (
            <div>loading....</div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <FormUpdateProfile user={user}/>
    )
}

export default ProfileClient;