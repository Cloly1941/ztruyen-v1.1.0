import useSWR, {type BareFetcher, type SWRConfiguration} from 'swr'

type TUseGetMethod<TData> = {
    api: () => Promise<IApiRes<TData>>
    key: string | string[]
    enabled?: boolean
    keepPreviousData?: boolean
    revalidateIfStale?: boolean
}

const useGetMethod = <TData>({
                                 api, key, enabled = true,
                                 keepPreviousData = false,
                                 revalidateIfStale = true
                             }: TUseGetMethod<TData>) => {
    const fetcher: BareFetcher<TData> = async () => {
        const res = await api()
        return res.data as TData
    }

    const config: SWRConfiguration<TData, BackendError> = {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        keepPreviousData,
        revalidateIfStale
    }

    const {data, isLoading, error, mutate, isValidating} = useSWR<TData, BackendError>(
        enabled ? key : null,
        fetcher,
        config
    )

    return {data, isLoading, error, mutate, isValidating}
}

export default useGetMethod