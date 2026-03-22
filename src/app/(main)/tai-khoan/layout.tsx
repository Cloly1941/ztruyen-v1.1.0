// ** React
import {ReactNode} from "react";

// ** Module
import NavAccount from "@/modules/tai-khoan/NavAccount";

type TAccountLayoutProps = {
    children: ReactNode
}

const AccountLayout = ({children}: TAccountLayoutProps) => {
    return (
        <div className='container flex flex-col md:flex-row my-8 rounded-md shadow-sm border overflow-hidden'>
            <NavAccount/>
            <div className='px-5 pb-5 flex-1 h-screen'>
                {children}
            </div>
        </div>
    )
}

export default AccountLayout