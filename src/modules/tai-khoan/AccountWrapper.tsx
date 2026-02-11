// ** React
import {ReactNode} from "react";

// ** Module
import NavAccount from "@/modules/tai-khoan/NavAccount";

type TAccountWrapperProps = {
    children: ReactNode
    title?: string
}

const AccountWrapper = ({children, title}: TAccountWrapperProps) => {
    return (
        <div className='container flex flex-col md:flex-row my-8 rounded-md shadow-sm border overflow-hidden'>
            <NavAccount/>
            <div className='px-5 pb-5 flex-1 h-screen'>
                {title && (
                    <h1 className='heading'>{title}</h1>
                )}
                {children}
            </div>
        </div>
    )
}

export default AccountWrapper