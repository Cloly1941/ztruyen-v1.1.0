// ** testing-library
import { renderHook, act } from '@testing-library/react'

// ** Hook
import { useForgotPassword } from '@/hooks/auth/useForgotPassword'

// ** Services
import { AuthService } from '@/services/auth'

// ** Toast
import toast from 'react-hot-toast'

// ** Next router
import { useRouter } from 'next/navigation'

// ================= MOCKS =================

jest.mock('@/services/auth', () => ({
    AuthService: {
        forgotPassword: jest.fn(),
    },
}))

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

// ================= TESTS =================

describe('useForgotPassword hook', () => {
    const push = jest.fn()

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push,
        })
    })

    it('throws error when cfToken is missing', async () => {
        const { result } = renderHook(() =>
            useForgotPassword(null)
        )

        await act(async () => {
            await expect(
                result.current.trigger({ email: 'test@gmail.com' })
            ).rejects.toThrow('Vui lòng xác thực bạn không phải bot')
        })

        expect(toast.error).toHaveBeenCalledWith(
            'Vui lòng xác thực bạn không phải bot'
        )

        expect(AuthService.forgotPassword).not.toHaveBeenCalled()
    })

    it('calls forgotPassword service with correct params', async () => {
        (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
            message: 'Gửi mail thành công',
        })

        const { result } = renderHook(() =>
            useForgotPassword('cf-token')
        )

        await act(async () => {
            await result.current.trigger({
                email: 'test@gmail.com',
            })
        })

        expect(AuthService.forgotPassword).toHaveBeenCalledWith(
            { email: 'test@gmail.com' },
            'cf-token'
        )
    })

    it('shows success toast and redirects on success', async () => {
        (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
            message: 'Gửi mail thành công',
        })

        const { result } = renderHook(() =>
            useForgotPassword('cf-token')
        )

        await act(async () => {
            await result.current.trigger({
                email: 'test@gmail.com',
            })
        })

        expect(toast.success).toHaveBeenCalledWith(
            'Gửi mail thành công'
        )

        expect(push).toHaveBeenCalledWith('/')
    })

    it('shows error toast when service throws error', async () => {
        (AuthService.forgotPassword as jest.Mock).mockRejectedValue(
            new Error('Email không tồn tại')
        )

        const { result } = renderHook(() =>
            useForgotPassword('cf-token')
        )

        await act(async () => {
            await expect(
                result.current.trigger({
                    email: 'wrong@gmail.com',
                })
            ).rejects.toThrow()
        })

        expect(toast.error).toHaveBeenCalledWith(
            'Email không tồn tại'
        )
    })

    it('shows fallback error message when error is not instance of Error', async () => {
        (AuthService.forgotPassword as jest.Mock).mockRejectedValue(
            'some random error'
        )

        const { result } = renderHook(() =>
            useForgotPassword('cf-token')
        )

        await act(async () => {
            await expect(
                result.current.trigger({
                    email: 'test@gmail.com',
                })
            ).rejects.toBeDefined()
        })

        expect(toast.error).toHaveBeenCalledWith(
            'Đã có lỗi xảy ra khi gửi email'
        )
    })

})
