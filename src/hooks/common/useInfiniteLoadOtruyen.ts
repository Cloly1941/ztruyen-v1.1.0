import useSWRInfinite from "swr/infinite";

type TUseInfiniteLoadOtruyen<T> = {
    key: string;
    api: (page: number, limit: number) => Promise<IApiOtruyenResWPagination<T[]>>;
    limit?: number;
    enabled?: boolean;
};

const useInfiniteLoadOtruyen = <T>({
                                       key,
                                       api,
                                       limit = 24,
                                       enabled = true,
                                   }: TUseInfiniteLoadOtruyen<T>) => {

    const getKey = (pageIndex: number, previousPageData: IApiOtruyenResWPagination<T[]> | null): [string, number, number] | null => {
        if (!enabled) return null;
        if (pageIndex === 0) return [key, limit, 1];
        if (!previousPageData) return null;
        const pagination = previousPageData.data?.params?.pagination;
        if (!pagination) return null;
        const {currentPage, totalItems, totalItemsPerPage} = pagination;
        const totalPages = Math.ceil(totalItems / totalItemsPerPage);
        if (currentPage >= totalPages) return null;
        return [key, limit, currentPage + 1];
    };

    const {
        data: pages,
        isLoading,
        isValidating,
        mutate,
        setSize,
    } = useSWRInfinite<IApiOtruyenResWPagination<T[]>>(
        getKey,
        async ([, , currentPage]: [string, number, number]) => {
            return await api(currentPage, limit);
        },
        {
            revalidateFirstPage: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const data = pages?.flatMap(p => p.data?.items ?? []) ?? [];
    const lastPage = pages?.[pages.length - 1];
    const pagination = lastPage?.data?.params?.pagination;
    const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 0;
    const hasMore = pagination ? pagination.currentPage < totalPages : false;
    const totalItems = pagination?.totalItems ?? 0;

    const loadMore = () => {
        if (!hasMore || isValidating || isLoading) return;
        setSize(prev => prev + 1);
    };

    const reset = () => setSize(1);

    return {
        data,
        hasMore,
        totalItems,
        totalPages,
        isLoading,
        isValidating,
        mutate,
        loadMore,
        reset,
    };
};

export default useInfiniteLoadOtruyen;