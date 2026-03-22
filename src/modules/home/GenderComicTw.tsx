// ** Components
import ErrorText from "@/components/common/ErrorText";

// ** Module component
import Carousel from "@/modules/home/Carousel";

// ** Services
import {getListByGender} from "@/services/api-otruyen/categories";

const GenderComicTw = async () => {

    const res = await getListByGender('manga')

    const data = res.data?.items

    if(!data) return <ErrorText/>;

    return (
        <Carousel
            data={data}
            desc='Truyện tranh Nhật đặc sắc ヾ(≧▽≦*)o'
            title="Kho Manga hay"
        />
    )
}

export default GenderComicTw