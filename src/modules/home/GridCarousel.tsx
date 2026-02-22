// ** Component
import ErrorText from "@/components/common/ErrorText";

// ** Module component
import GridCarouselClient from "@/modules/home/GridCarouselClient";

// ** Service
import {getListByStatus} from "@/services/api-otruyen/list";

// ** Enum
import {ESlug} from "@/types/enum";

const GridCarousel = async () => {

    const res = await getListByStatus(ESlug.NEW);

    const listNewComic = res.data?.items;

    if(!listNewComic) return <ErrorText/>;

    return (
        <GridCarouselClient data={listNewComic} />
    )
}

export default GridCarousel