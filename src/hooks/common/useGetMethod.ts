import useSWR from 'swr'

type TUseGetMethod<TData> = {
    api: () => Promise<IApiRes<TData>>
    key: string | string[]
    enabled?: boolean
}

const useGetMethod = <TData>({ api, key, enabled = true }: TUseGetMethod<TData>) => {
    const { data, isLoading, error, mutate } = useSWR<IApiRes<TData>, BackendError>(
        enabled ? key : null,
        api,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    )

    return { data, isLoading, error, mutate }
}

export default useGetMethod