// ** Enums
import { ESlug } from "@/types/enum";

export const convertStatusComic = (slug: ESlug) => {
    switch (slug) {
        case ESlug.NEW:
            return {
                title: 'Truyện mới',
                description: 'Truyện tranh mới cập nhật hôm nay. Đọc ngay nhé! ヽ(>∀<☆)ノ',
            };

        case ESlug.COMING_SOON:
            return {
                title: 'Truyện sắp ra mắt',
                description: 'Truyện tranh sắp ra mắt – Theo dõi để không bỏ lỡ! (≧◡≦) ♡',
            };

        case ESlug.ONGOING:
            return {
                title: 'Truyện đang phát hành',
                description: 'Truyện tranh đang ra – Cập nhật liên tục mỗi ngày! (ง •̀_•́)ง',
            };

        default:
            return {
                title: 'Truyện đã hoàn thành',
                description: 'Truyện tranh hoàn thành – Đọc trọn bộ không cần chờ chap! (๑˃̵ᴗ˂̵)و',
            };
    }
};