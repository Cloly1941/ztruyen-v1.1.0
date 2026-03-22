export const getPaginationPages = (
    page: number,
    totalPages: number,
    maxVisiblePages: number = 7
): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start: number;
    let end: number;

    switch (true) {
        case page <= 3:
            start = 2;
            end = Math.min(5, totalPages - 1);
            break;
        case page >= totalPages - 2:
            start = Math.max(2, totalPages - 4);
            end = totalPages - 1;
            break;
        default:
            start = page - 1;
            end = page + 1;
    }

    const result: (number | string)[] = [1];
    if (start > 2) result.push('...');
    for (let i = start; i <= end; i++) result.push(i);
    if (end < totalPages - 1) result.push('...');
    result.push(totalPages);

    return result;
};