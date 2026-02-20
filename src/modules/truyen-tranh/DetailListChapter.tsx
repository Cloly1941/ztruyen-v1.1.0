// ** Type
import {TOtruyenChapter, TOtruyenChapterServer} from "@/types/api.otruyen";

// ** Module Component
import RangeBtnPagination from "@/modules/truyen-tranh/RangeBtnPagination";

type TDetailListChapterProps = {
    listChapter: TOtruyenChapterServer[]
    slug: string
}
const DetailListChapter = ({listChapter, slug}: TDetailListChapterProps) => {

    if (listChapter.length === 0) return (
        <div className="container flex flex-col justify-between gap-4 lg:gap-0 lg:flex-row mt-3">
            <section className='p-5 lg:w-[70%] xl:w-[76%] h-min bg-section-detail'>
                <p className="text-center m-6 text-sm">
                    Hiện tại truyện đang cập nhật, hãy quay lại sau nhé !
                </p>
            </section>
        </div>
    );

    return (
        <section className='p-5 lg:w-[70%] xl:w-[76%] h-min bg-section-detail'>
            <h2 className='text-lg font-medium'>Danh sách chương</h2>
            <RangeBtnPagination chapters={listChapter[0].server_data as TOtruyenChapter[]} slug={slug}/>
        </section>
    )
}

export default DetailListChapter