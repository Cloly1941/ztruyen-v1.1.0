// ** Enums
import {ESortField, ESortOrder, ESortType} from "@/types/enum";

export const convertSortQuery = (sort: ESortOrder) => {
    switch (sort) {
        case ESortOrder.UPDATED_AT_ASC:
            return {
                sortField: ESortField.UPDATED_AT,
                sortType: ESortType.ASC,
            }

        case ESortOrder.UPDATED_AT_DESC:
        default:
            return {
                sortField: ESortField.UPDATED_AT,
                sortType: ESortType.DESC,
            }
    }
}