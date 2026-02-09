// ** testing-library
import { renderHook, act } from '@testing-library/react'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import { useChangePassword } from '@/hooks/auth/useChangePassword'

// ** Config
import { CONFIG_TAG } from '@/configs/tag'

// ** Services
import {AuthService} from "@/services/auth";

// ================= MOCKS =================

jest.mock('swr/mutation', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('@/services/auth', () => ({
    AuthService: {
        resetPassword: jest.fn(),
    },
}))

jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
}))

// ================= TESTS =================

describe('useChangePassword hook', () => {
    const trigger = jest.fn()

    beforeEach(() => {
        (useSWRMutation as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('calls useSWRMutation with correct config', () => {
        renderHook(() => useChangePassword())

        expect(useSWRMutation).toHaveBeenCalledWith(
            CONFIG_TAG.AUTH.RESET,
            expect.any(Function),
            expect.objectContaining({
                onError: expect.any(Function),
            })
        )
    })

    it('calls resetPassword API successfully', async () => {
        const payload = {
            newPassword: '123456',
        }

        trigger.mockResolvedValue({
            message: 'Change password success',
        })

        const { result } = renderHook(() => useChangePassword())

        await act(async () => {
            await result.current.trigger({
                payload,
                token: 'valid-token',
            })
        })

        expect(trigger).toHaveBeenCalledWith({
            payload,
            token: 'valid-token',
        })
    })

    it('shows error toast when error is instance of Error', async () => {
        renderHook(() => useChangePassword())

        const [, , options] = (useSWRMutation as jest.Mock).mock.calls[0]

        const error = new Error('Token không hợp lệ')

        await act(async () => {
            options.onError(error)
        })

        expect(toast.error).toHaveBeenCalledWith('Token không hợp lệ')
    })

    it('shows fallback error toast when error is not Error', async () => {
        renderHook(() => useChangePassword())

        const [, , options] = (useSWRMutation as jest.Mock).mock.calls[0]

        await act(async () => {
            options.onError('random error')
        })

        expect(toast.error).toHaveBeenCalledWith(
            'Đã có lỗi xảy ra khi đổi mật khẩu, vui lòng thử lại sau!'
        )
    })

    it('calls AuthService.resetPassword inside fetcher', async () => {
        (AuthService.resetPassword as jest.Mock).mockResolvedValue({
            message: 'ok',
        })

        renderHook(() => useChangePassword())

        const [, fetcher] = (useSWRMutation as jest.Mock).mock.calls[0]

        await fetcher(CONFIG_TAG.AUTH.RESET, {
            arg: {
                payload: { newPassword: '123456' },
                token: 'valid-token',
            },
        })

        expect(AuthService.resetPassword).toHaveBeenCalledWith(
            { newPassword: '123456' },
            'valid-token'
        )
    })

})
