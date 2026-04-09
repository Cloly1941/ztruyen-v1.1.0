// ** Next
import Image from "next/image";

// ** Image
import {CONFIG_IMG} from "@/configs/img";

const EmptyFavorite = () => {

    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[50vh] -mt-20">
            <div className="relative size-[300px]">
                <Image
                    src={CONFIG_IMG.EMPTY}
                    alt="Danh sách yêu thích trống"
                    fill
                    className="filter-img"
                />
            </div>

            <p className="text-sm leading-relaxed -mt-8 text-img">
                Ủa alo… chưa có gì trong đây hết ( ´･_･)ﾉ(._.`) <br/>
                Thả tim vài bộ truyện liền tay đi nha! ←◡←
            </p>
        </div>
    )
}

export default EmptyFavorite