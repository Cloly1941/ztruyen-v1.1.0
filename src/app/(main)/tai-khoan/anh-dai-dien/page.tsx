// ** Next
import type { Metadata } from "next"

// ** Module component
import FormUploadAvatar from "@/modules/tai-khoan/anh-dai-dien/FormUploadAvatar";

export const metadata: Metadata = {
    title: "Ảnh đại diện tài khoản",
    description: "Thay đổi ảnh đại diện tài khoản của bạn",
}

const AvatarAccount = () => {
    return (
        <>
            <h1 className='heading'>Cập nhật avatar</h1>
            <FormUploadAvatar/>
        </>
    );
}

export default AvatarAccount