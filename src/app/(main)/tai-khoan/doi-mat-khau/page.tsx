// ** Next
import type {Metadata} from "next";

// ** Module
import FormChangePassword from "@/modules/tai-khoan/doi-mat-khau/FormChangePassword";


export const metadata: Metadata = {
    title: "Đổi mật khẩu",
    description: "Thay đổi mật khẩu của bạn",
}

const ChangePasswordPage = () => {
    return (
        <>
            <h1 className='heading'>Đổi mật khẩu</h1>
            <FormChangePassword/>
        </>
    )
}

export default ChangePasswordPage