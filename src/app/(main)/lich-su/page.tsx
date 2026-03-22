import ListComicHistory from "@/modules/lich-su/ListComicHistory";

export async function generateMetadata() {
    return {
        title: `Lịch sử đọc truyện của bạn - ztruyen.io.vn`,
        description: `Lịch sử đọc truyện của bạn tại ztruyen.io.vn`,
        keywords: [`Lịch sử đọc truyện`, `manga`, `comic`, `manhua`, `manhua`],
        alternates: {
            canonical: `/lich-su`,
            languages: {
                vi: `/vi/lich-su`,
            },
        },
        openGraph: {
            title: `Lịch sử đọc truyện của bạn - ztruyen.io.vn`,
            description: `Lịch sử đọc truyện của bạn tại ztruyen.io.vn`,
            images: [
                {
                    url: '/logo-all.png',
                    width: 400,
                    height: 200,
                },
            ],
        },
    };
}


const HistoryReader = () => {
    return (
        <ListComicHistory/>
    )
}

export default HistoryReader