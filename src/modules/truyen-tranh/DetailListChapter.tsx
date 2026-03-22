// ** Type
import {TOtruyenChapter, TOtruyenChapterServer} from "@/types/api.otruyen";

// ** Module Component
import RangeBtnPagination from "@/modules/truyen-tranh/RangeBtnPagination";
import CommentSection from "@/modules/truyen-tranh/Comment/CommentSection";

type TDetailListChapterProps = {
    listChapter: TOtruyenChapterServer[]
    slug: string
    name: string
}
const DetailListChapter = ({listChapter, slug, name}: TDetailListChapterProps) => {

    if (listChapter.length === 0) return (
        <section className='p-5 lg:w-[70%] xl:w-[76%] h-min bg-section-detail'>
            <p className="text-center m-6 text-sm">
                Hiện tại truyện đang cập nhật, hãy quay lại sau nhé !
            </p>
        </section>
    );

    return (
        <section className='p-5 lg:w-[70%] xl:w-[76%] h-min bg-section-detail'>
            <h2 className='text-lg font-medium'>Danh sách chương</h2>
            <RangeBtnPagination chapters={listChapter[0].server_data as TOtruyenChapter[]} slug={slug}/>
            <CommentSection name={name} slug={slug}/>
        </section>
    )
}

export default DetailListChapter