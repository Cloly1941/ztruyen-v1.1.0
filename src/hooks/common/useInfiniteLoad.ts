import useSWRInfinite from "swr/infinite";

type TUseInfiniteLoad<T> = {
    key: string;
    api: (page: number) => Promise<IModelPaginate<T>>;
    limit?: number;
    enabled?: boolean;
    sort?: string;
};

const useInfiniteLoad = <T>({
                                key,
                                api,
                                limit = 10,
                                enabled = true,
                                sort = "",
                            }: TUseInfiniteLoad<T>) => {

    const getKey = (pageIndex: number, previousPageData: IModelPaginate<T> | null): [string, string, number] | null => {
        if (!enabled) return null;
        if (pageIndex === 0) return [key, sort, 1];
        if (!previousPageData) return null;
        const { page, totalPages } = previousPageData.meta;
        if (page >= totalPages) return null;
        return [key, sort, page + 1];
    };

    const {
        data: pages,
        isLoading,
        isValidating,
        mutate,
        setSize,
    } = useSWRInfinite<IModelPaginate<T>>(
        getKey,
        async ([,, currentPage]: [string, string, number]) => {
            return await api(currentPage);
        },
        {
            revalidateFirstPage: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const data = pages?.flatMap(p => p.result) ?? [];
    const lastPage = pages?.[pages.length - 1];
    const hasMore = lastPage ? lastPage.meta.page < lastPage.meta.totalPages : false;
    const meta = pages?.[0]?.meta ?? null;

    const loadMore = () => {
        if (!hasMore || isValidating || isLoading) return;
        setSize(prev => prev + 1);
    };

    const reset = () => setSize(1);

    return {
        data,
        meta,
        hasMore,
        isLoading,
        isValidating,
        mutate,
        loadMore,
        reset,
    };
};

export default useInfiniteLoad;