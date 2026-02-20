// ** Type
import {TStatus} from "@/types/api.otruyen";

export const convertStatusToVi = (status: TStatus) => {
    switch (status) {
        case 'ongoing':
            return 'Đang ra';
        case 'coming_soon':
            return 'Sắp ra mắt';
        case 'completed':
            return 'Hoàn thành';
        default:
            return 'Đang cập nhật';
    }
};