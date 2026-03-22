// ** React
import {ReactNode} from "react";

// ** Layout components
import ReadingLayout from "@/layouts/ReadingLayout";

const ReadingComicLayout = ({children}: { children: ReactNode }) => {
    return (
        <ReadingLayout>
            {children}
        </ReadingLayout>
    );
}

export default ReadingComicLayout