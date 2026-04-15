export const getCountryLabel = (country: string) => {
    switch (country) {
        case 'trung':
            return 'Trung';
        case 'han':
            return 'Hàn';
        case 'nhat':
            return 'Nhật';
        default:
            return 'Khác';
    }
};