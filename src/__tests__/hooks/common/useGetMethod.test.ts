// ** Testing library
import { renderHook, waitFor } from '@testing-library/react'

// ** Swr
import { SWRConfig } from 'swr'

// ** React
import { createElement } from 'react'

// ** Hook
import useGetMethod from '@/hooks/common/useGetMethod'

// ===== WRAPPER =====
const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(SWRConfig, { value: { provider: () => new Map() } }, children)

const mockApiRes: IApiRes<{ name: string }> = {
    data: { name: 'Test' },
    message: 'Success',
    statusCode: 200,
}

const mockError: BackendError = {
    message: 'Something went wrong',
    statusCode: 500,
}

// ===== TESTS =====
describe('useGetMethod', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('returns unwrapped data on success', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockApiRes)

        const { result } = renderHook(
            () => useGetMethod({ api: mockApi, key: 'test-key' }),
            { wrapper }
        )

        expect(result.current.isLoading).toBe(true)

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.data).toEqual({ name: 'Test' })
        expect(result.current.error).toBeUndefined()
        expect(mockApi).toHaveBeenCalledTimes(1)
    })

    it('does not fetch when enabled is false', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockApiRes)

        const { result } = renderHook(
            () => useGetMethod({ api: mockApi, key: 'test-key-disabled', enabled: false }),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(mockApi).not.toHaveBeenCalled()
        expect(result.current.data).toBeUndefined()
    })

    it('returns error when api fails', async () => {
        const mockApi = jest.fn().mockRejectedValue(mockError)

        const { result } = renderHook(
            () => useGetMethod({ api: mockApi, key: 'test-key-error' }),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.error).toEqual(mockError)
        expect(result.current.data).toBeUndefined()
    })

    it('refetches when key changes', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockApiRes)

        const { result, rerender } = renderHook(
            ({ key }: { key: string }) => useGetMethod({ api: mockApi, key }),
            { wrapper, initialProps: { key: 'key-1' } }
        )

        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(mockApi).toHaveBeenCalledTimes(1)

        rerender({ key: 'key-2' })

        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(mockApi).toHaveBeenCalledTimes(2)
    })

    it('exposes mutate function', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockApiRes)

        const { result } = renderHook(
            () => useGetMethod({ api: mockApi, key: 'test-key-mutate' }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(typeof result.current.mutate).toBe('function')
    })

    it('fetches by default when enabled is not provided', async () => {
        const mockApi = jest.fn().mockResolvedValue(mockApiRes)

        const { result } = renderHook(
            () => useGetMethod({ api: mockApi, key: 'test-key-default' }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(mockApi).toHaveBeenCalledTimes(1)
        expect(result.current.data).toEqual({ name: 'Test' })
    })
})