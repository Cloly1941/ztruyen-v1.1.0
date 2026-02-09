// ** Next
import { useRouter } from 'next/navigation'

// ** Testing Library
import { renderHook, act } from '@testing-library/react'

// ** react hot toast
import toast from 'react-hot-toast'

// ** swr
import useSWRMutation from 'swr/mutation'
import { mutate } from 'swr'

// ** Hooks
import { useLogout } from '@/hooks/auth/useLogout'

// ** Configs
import { CONFIG_TAG } from '@/configs/tag'

// ================= MOCKS =================
jest.mock('@/services/auth', () => ({
    AuthService: {
        logout: jest.fn(),
    },
}))

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

jest.mock('swr', () => ({
    mutate: jest.fn(),
}))

jest.mock('swr/mutation', () => ({
    __esModule: true,
    default: jest.fn(),
}))

// ================= TESTS =================
describe('useLogout hook', () => {
    const trigger = jest.fn()
    const refresh = jest.fn()

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ refresh });

        (useSWRMutation as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('calls logout and handles success correctly', async () => {
        const response = { message: 'Logout success' }
        trigger.mockResolvedValue(response)

        const { result } = renderHook(() => useLogout())

        await act(async () => {
            await result.current.trigger()
        })

        // verify SWR mutation config
        expect(useSWRMutation).toHaveBeenCalledWith(
            CONFIG_TAG.AUTH.LOGOUT,
            expect.any(Function),
            expect.objectContaining({
                onSuccess: expect.any(Function),
                onError: expect.any(Function),
            })
        )

        // simulate onSuccess
        const [, , options] = (useSWRMutation as jest.Mock).mock.calls[0]
        options.onSuccess(response)

        expect(toast.success).toHaveBeenCalledWith('Logout success')
        expect(mutate).toHaveBeenCalledWith(
            CONFIG_TAG.USER.PROFILE,
            null,
            false
        )
        expect(refresh).toHaveBeenCalled()
    })

    it('shows error toast when logout fails with Error', () => {
        const error = new Error('Logout failed')

        renderHook(() => useLogout())

        const [, , options] = (useSWRMutation as jest.Mock).mock.calls[0]
        options.onError(error)

        expect(toast.error).toHaveBeenCalledWith('Logout failed')
        expect(refresh).not.toHaveBeenCalled()
    })

    it('shows generic error toast when logout fails with non-Error', () => {
        renderHook(() => useLogout())

        const [, , options] = (useSWRMutation as jest.Mock).mock.calls[0]
        options.onError('some error')

        expect(toast.error).toHaveBeenCalledWith(
            'Đã có lỗi xảy ra khi đăng xuất, vui lòng thử lại sau!'
        )
        expect(refresh).not.toHaveBeenCalled()
    })

    it('calls logout fetcher', async () => {
        renderHook(() => useLogout())

        const [, fetcher] = (useSWRMutation as jest.Mock).mock.calls[0]

        await fetcher()
    })
})
