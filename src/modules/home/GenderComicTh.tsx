// ** Components
import ErrorText from "@/components/common/ErrorText";

// ** Module component
import Carousel from "@/modules/home/Carousel";

// ** Services
import {getListByGender} from "@/services/api-otruyen/categories";

const GenderComicTh = async () => {

    const res = await getListByGender('manhua')

    const data = res.data?.items

    if(!data) return <ErrorText/>;

    return (
        <Carousel
            data={data}
            desc='Khám phá truyện Trung hay (≧ω≦)'
            title="Thế giới Manhua"
            bgColor
        />
    )
}

export default GenderComicTh