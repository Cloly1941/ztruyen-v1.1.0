// ** Next
import type {Metadata} from "next";

// ** Module
import FormUpdateFrame from "@/modules/tai-khoan/khung-avatar/FormUpdateFrame";

export const metadata: Metadata = {
    title: "Khung ảnh đại diện",
    description: "Thay đổi khung ảnh đại diện tài khoản của bạn",
}

const Frame = () => {
    return (
        <>
            <h1 className='heading'>Khung ảnh đại diện</h1>
            <FormUpdateFrame/>
        </>
    )
}

export default Frame