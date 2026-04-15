// ** React
import {ReactNode} from "react";

type TRankingLayout = {
    children: ReactNode
}

const RankingLayout = ({children}: TRankingLayout) => {
    return (
        <>
            {children}
        </>
    )
}

export default RankingLayout