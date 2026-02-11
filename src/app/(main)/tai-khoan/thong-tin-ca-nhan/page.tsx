// ** Next
import type {Metadata} from "next";

// ** Module components
import AccountWrapper from "@/modules/tai-khoan/AccountWrapper";
import ProfileClient from "@/modules/tai-khoan/thong-tin-ca-nhan/ProfileClient";

export const metadata: Metadata = {
    title: "Thông tin của tôi",
    description: "Quản lý và cập nhật thông tin cá nhân của bạn",
}

const Profile = () => {
    return (
       <AccountWrapper title='Thông tin của tôi'>
          <ProfileClient/>
       </AccountWrapper>
    )
}

export default Profile;