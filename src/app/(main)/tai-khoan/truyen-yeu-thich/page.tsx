// ** Next
import type {Metadata} from "next";

// ** Module components
import ListFavorite from "@/modules/tai-khoan/truyen-yeu-thich/ListFavorite";

export const metadata: Metadata = {
    title: "Danh sách truyện yêu thích",
    description: "Danh sách truyện yêu thích của bạn",
}

const FavoriteStories = () => {
    return (
        <>
            <h1 className='heading'>Danh sách truyện yêu thích</h1>
            <ListFavorite/>
        </>
    );
}

export default FavoriteStories