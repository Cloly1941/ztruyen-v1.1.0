// ** Util
import { convertSortQuery } from "@/utils/covertSortQuery";

// ** Enum
import { ESortOrder, ESortField, ESortType } from "@/types/enum";

describe("convertSortQuery", () => {
    it("should return updatedAt DESC when sort is UPDATED_AT_DESC", () => {
        const result = convertSortQuery(ESortOrder.UPDATED_AT_DESC);

        expect(result).toEqual({
            sortField: ESortField.UPDATED_AT,
            sortType: ESortType.DESC,
        });
    });

    it("should return updatedAt ASC when sort is UPDATED_AT_ASC", () => {
        const result = convertSortQuery(ESortOrder.UPDATED_AT_ASC);

        expect(result).toEqual({
            sortField: ESortField.UPDATED_AT,
            sortType: ESortType.ASC,
        });
    });

    it("should return updatedAt DESC as default for unknown sort value", () => {
        const result = convertSortQuery("unknown" as ESortOrder);

        expect(result).toEqual({
            sortField: ESortField.UPDATED_AT,
            sortType: ESortType.DESC,
        });
    });
});