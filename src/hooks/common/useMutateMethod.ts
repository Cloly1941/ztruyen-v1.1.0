// ** Swr
import useSWRMutation from 'swr/mutation'

// ** React hot toast
import toast from 'react-hot-toast'

type TUseMutateMethod<TData, TPayload> = {
    api: (payload: TPayload) => Promise<IApiRes<TData>>
    key: string | string[]
    onSuccess?: (data: IApiRes<TData>) => void
    onError?: (error: BackendError) => void
    showToast?: boolean
}

const useMutateMethod = <TData, TPayload>({
                                              api,
                                              key,
                                              onSuccess,
                                              onError,
                                              showToast = true,
                                          }: TUseMutateMethod<TData, TPayload>) => {
    const { trigger, isMutating, error, data } =
        useSWRMutation<IApiRes<TData>, BackendError, string | string[], TPayload>(
            key,
            async (_key: string | string[], { arg }: { arg: TPayload }) => {
                const res = await api(arg)
                return res
            },
            {
                onSuccess(data) {
                    onSuccess?.(data)
                },
                onError(error) {
                    if (showToast) {
                        toast.error(
                            Array.isArray(error.message)
                                ? error.message[0]
                                : error.message
                        )
                    }
                    onError?.(error)
                },
            }
        )

    return { trigger, isMutating, error, data }
}

export default useMutateMethod