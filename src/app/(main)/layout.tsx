// ** React
import {ReactNode} from "react";

// ** Layout components
import DefaultLayout from "@/layouts/DefaultLayout";

const MainLayout = ({children}: { children: ReactNode }) => {
    return (
        <DefaultLayout>
            {children}
        </DefaultLayout>
    );
}

export default MainLayout