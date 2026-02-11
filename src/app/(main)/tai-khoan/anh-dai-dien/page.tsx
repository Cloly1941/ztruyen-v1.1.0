// ** Next
import type { Metadata } from "next"

// ** Module component
import AccountWrapper from "@/modules/tai-khoan/AccountWrapper";
import FormUploadAvatar from "@/modules/tai-khoan/anh-dai-dien/FormUploadAvatar";

export const metadata: Metadata = {
    title: "Ảnh đại diện tài khoản",
    description: "Thay đổi ảnh đại diện tài khoản của bạn",
}

const AvatarAccount = () => {
    return (
        <AccountWrapper title='Cập nhật avatar'>
           <FormUploadAvatar/>
        </AccountWrapper>
    );
}

export default AvatarAccount