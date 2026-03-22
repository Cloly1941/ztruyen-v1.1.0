// ** Components
import ErrorText from "@/components/common/ErrorText";

// ** Module component
import Carousel from "@/modules/home/Carousel";

// ** Services
import {getListByGender} from "@/services/api-otruyen/categories";

const GenderComicO = async () => {

    const res = await getListByGender('manhwa')

    const data = res.data?.items

    if(!data) return <ErrorText/>;

    return (
        <Carousel
            data={data}
            desc='Đọc truyện Hàn cực cuốn ヽ(>∀<☆)ノ'
            title="Manhwa đỉnh cao"
            bgColor
        />
    )
}

export default GenderComicO