// ** Testing library
import { renderHook, waitFor } from '@testing-library/react'

// ** Swr
import { SWRConfig } from 'swr'

// ** React
import { createElement } from 'react'

// ** Hook
import useGetMethod from "@/hooks/common/useGetMethod";

const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(SWRConfig, { value: { provider: () => new Map() } }, children)

// ===== Mock =====

const mockData: IApiRes<{ name: string }> = {
    data: { name: 'Test' },
    message: 'Success',
    statusCode: 200,
}

const mockError: BackendError = {
    message: 'Something went wrong',
    statusCode: 500,
}

// ===== Test =====
describe('useGetMethod', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should fetch data successfully', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockData)

        const { result } = renderHook(
            () =>
                useGetMethod({
                    api: mockApi,
                    key: 'test-key',
                }),
            { wrapper }
        )

        expect(result.current.isLoading).toBe(true)

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.data).toEqual(mockData)
        expect(result.current.error).toBeUndefined()
        expect(mockApi).toHaveBeenCalledTimes(1)
    })

    it('should not fetch when enabled = false', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockData)

        const { result } = renderHook(
            () =>
                useGetMethod({
                    api: mockApi,
                    key: 'test-key-disabled',
                    enabled: false,
                }),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(mockApi).not.toHaveBeenCalled()
        expect(result.current.data).toBeUndefined()
    })

    it('should return error when api fails', async () => {
        const mockApi = jest.fn().mockRejectedValue(mockError)

        const { result } = renderHook(
            () =>
                useGetMethod({
                    api: mockApi,
                    key: 'test-key-error',
                }),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toEqual(mockError)
        expect(result.current.data).toBeUndefined()
    })

    it('should refetch when key changes', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockData)

        const { result, rerender } = renderHook(
            ({ key }: { key: string }) =>
                useGetMethod({
                    api: mockApi,
                    key,
                }),
            {
                wrapper,
                initialProps: { key: 'key-1' },
            }
        )

        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(mockApi).toHaveBeenCalledTimes(1)

        rerender({ key: 'key-2' })

        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(mockApi).toHaveBeenCalledTimes(2)
    })

    it('should expose mutate function', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockData)

        const { result } = renderHook(
            () =>
                useGetMethod({
                    api: mockApi,
                    key: 'test-key-mutate',
                }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(typeof result.current.mutate).toBe('function')
    })
})