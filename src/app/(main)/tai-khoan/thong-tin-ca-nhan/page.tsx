// ** Next
import type {Metadata} from "next";

// ** Module components
import ProfileClient from "@/modules/tai-khoan/thong-tin-ca-nhan/ProfileClient";

export const metadata: Metadata = {
    title: "Thông tin của tôi",
    description: "Quản lý và cập nhật thông tin cá nhân của bạn",
}

const Profile = () => {
    return (
        <>
            <h1 className='heading'>Thông tin của tôi</h1>
            <ProfileClient/>
        </>
    )
}

export default Profile;