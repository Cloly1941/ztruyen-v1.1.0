// ** Component
import ErrorText from "@/components/common/ErrorText";

// ** Module component
import InteractiveThumbnail from '@/modules/home/InteractiveThumbnail';

// ** Services
import {getListByStatus} from "@/services/api-otruyen/list";

// ** Enum
import {ESlug} from "@/types/enum";

const RecommendedComic = async () => {

    const res = await getListByStatus(ESlug.NEW);

    const listRecommendedComic = res.data?.items

    if (!listRecommendedComic) return <ErrorText/>

    return (
        <section className="section-home">
            <div className="section-header">
                <h2 className="heading-home">
                    Đề xuất dành cho bạn
                </h2>

                <p className="desc">
                    Hãy chọn bộ truyện bạn thích !
                </p>
            </div>
            <InteractiveThumbnail listRecommendedComic={listRecommendedComic}/>
        </section>
    );
};

export default RecommendedComic;