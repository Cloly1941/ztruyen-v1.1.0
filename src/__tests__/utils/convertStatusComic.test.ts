// ** Util
import { convertStatusComic } from "@/utils/convertStatusComic";

// ** Enum
import { ESlug } from "@/types/enum";

describe("convertStatusComic", () => {
    it("should return correct title and description for NEW", () => {
        const result = convertStatusComic(ESlug.NEW);

        expect(result).toEqual({
            title: "Truyện mới",
            description: "Truyện tranh mới cập nhật hôm nay. Đọc ngay nhé! ヽ(>∀<☆)ノ",
        });
    });

    it("should return correct title and description for COMING_SOON", () => {
        const result = convertStatusComic(ESlug.COMING_SOON);

        expect(result).toEqual({
            title: "Truyện sắp ra mắt",
            description: "Truyện tranh sắp ra mắt – Theo dõi để không bỏ lỡ! (≧◡≦) ♡",
        });
    });

    it("should return correct title and description for ONGOING", () => {
        const result = convertStatusComic(ESlug.ONGOING);

        expect(result).toEqual({
            title: "Truyện đang phát hành",
            description: "Truyện tranh đang ra – Cập nhật liên tục mỗi ngày! (ง •̀_•́)ง",
        });
    });

    it("should return correct title and description for COMPLETED (default)", () => {
        const result = convertStatusComic(ESlug.COMPLETED);

        expect(result).toEqual({
            title: "Truyện đã hoàn thành",
            description: "Truyện tranh hoàn thành – Đọc trọn bộ không cần chờ chap! (๑˃̵ᴗ˂̵)و",
        });
    });

    it("should return default when slug is unknown", () => {
        const result = convertStatusComic("unknown" as ESlug);

        expect(result).toEqual({
            title: "Truyện đã hoàn thành",
            description: "Truyện tranh hoàn thành – Đọc trọn bộ không cần chờ chap! (๑˃̵ᴗ˂̵)و",
        });
    });
});