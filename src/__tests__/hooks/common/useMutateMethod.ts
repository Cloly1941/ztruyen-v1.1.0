// ** Testing library
import { renderHook, act, waitFor } from '@testing-library/react'

// ** Swr
import { SWRConfig } from 'swr'

// ** React
import { createElement } from 'react'

// ** React hot toast
import toast from 'react-hot-toast'

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

jest.mock('react-hot-toast')

const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(SWRConfig, { value: { provider: () => new Map() } }, children)

// ===== Mock =====
const mockData: IApiRes<{ id: string }> = {
    data: { id: '123' },
    message: 'Thành công',
    statusCode: 200,
}

const mockError: BackendError = {
    message: 'Lỗi server',
    statusCode: 500,
}

// ===== Test =====
describe('useMutateMethod', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should trigger api and return data on success', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockData)
        const onSuccess = jest.fn()

        const { result } = renderHook(
            () =>
                useMutateMethod({
                    api: mockApi,
                    key: 'mutate-key',
                    onSuccess,
                }),
            { wrapper }
        )

        expect(result.current.isMutating).toBe(false)

        await act(async () => {
            await result.current.trigger({ name: 'Test' })
        })

        expect(mockApi).toHaveBeenCalledWith({ name: 'Test' })
        expect(result.current.data).toEqual(mockData)
        expect(onSuccess).toHaveBeenCalledWith(mockData)
        expect(result.current.isMutating).toBe(false)
    })

    it('should show toast.error and call onError when api fails', async () => {
        const mockApi = jest.fn().mockRejectedValue(mockError)
        const onError = jest.fn()

        const { result } = renderHook(
            () =>
                useMutateMethod({
                    api: mockApi,
                    key: 'mutate-key-error',
                    onError,
                }),
            { wrapper }
        )

        await act(async () => {
            try {
                await result.current.trigger({})
            } catch {}
        })

        expect(toast.error).toHaveBeenCalledWith('Lỗi server')
        expect(onError).toHaveBeenCalledWith(mockError)
    })

    it('should show first message when error.message is array', async () => {
        const arrayMessageError = {
            message: ['Lỗi 1', 'Lỗi 2'],
            statusCode: 400,
        } as unknown as BackendError
        const mockApi = jest.fn().mockRejectedValue(arrayMessageError)

        const { result } = renderHook(
            () =>
                useMutateMethod({
                    api: mockApi,
                    key: 'mutate-key-array-error',
                }),
            { wrapper }
        )

        await act(async () => {
            try {
                await result.current.trigger({})
            } catch {}
        })

        expect(toast.error).toHaveBeenCalledWith('Lỗi 1')
    })

    it('should not show toast when showToast = false', async () => {
        const mockApi = jest.fn().mockRejectedValue(mockError)

        const { result } = renderHook(
            () =>
                useMutateMethod({
                    api: mockApi,
                    key: 'mutate-key-no-toast',
                    showToast: false,
                }),
            { wrapper }
        )

        await act(async () => {
            try {
                await result.current.trigger({})
            } catch {}
        })

        expect(toast.error).not.toHaveBeenCalled()
    })

    it('should set isMutating = true while pending', async () => {
        let resolve!: (v: IApiRes<{ id: string }>) => void
        const mockApi = jest.fn(
            () => new Promise<IApiRes<{ id: string }>>(r => { resolve = r })
        )

        const { result } = renderHook(
            () =>
                useMutateMethod({
                    api: mockApi,
                    key: 'mutate-key-loading',
                }),
            { wrapper }
        )

        act(() => {
            result.current.trigger({})
        })

        await waitFor(() => {
            expect(result.current.isMutating).toBe(true)
        })

        await act(async () => {
            resolve(mockData)
        })

        await waitFor(() => {
            expect(result.current.isMutating).toBe(false)
        })
    })
})