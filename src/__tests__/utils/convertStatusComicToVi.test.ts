// ** Util
import {convertStatusToVi} from "@/utils/convertStatusComicToVi";

// ** Type
import { TStatus } from "@/types/api.otruyen";

describe("convertStatusToVi", () => {
    it("should return 'Đang ra' when status is 'ongoing'", () => {
        expect(convertStatusToVi("ongoing")).toBe("Đang ra");
    });

    it("should return 'Sắp ra mắt' when status is 'coming_soon'", () => {
        expect(convertStatusToVi("coming_soon")).toBe("Sắp ra mắt");
    });

    it("should return 'Hoàn thành' when status is 'completed'", () => {
        expect(convertStatusToVi("completed")).toBe("Hoàn thành");
    });

    it("should return 'Đang cập nhật' for unknown status", () => {
        expect(convertStatusToVi("unknown" as TStatus)).toBe("Đang cập nhật");
    });
});