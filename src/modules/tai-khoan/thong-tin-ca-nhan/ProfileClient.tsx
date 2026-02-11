'use client'

// ** Hooks
import {useProfile} from "@/hooks/auth/useProfile";

// ** Module component
import FormUpdateProfile from "@/modules/tai-khoan/thong-tin-ca-nhan/FormUpdateProfile";

const ProfileClient = () => {
    const {data: user, isLoading} = useProfile()

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