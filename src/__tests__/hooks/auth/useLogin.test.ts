// ** Testing Library
import { renderHook, act } from '@testing-library/react'

// ** react hot toast
import toast from 'react-hot-toast'

// ** Hooks
import { useLogin } from '@/hooks/auth/useLogin'

// ** Services
import { AuthService } from '@/services/auth'

// ================= MOCKS =================
jest.mock('@/services/auth', () => ({
    AuthService: {
        login: jest.fn(),
    },
}))

jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
}))

// ================= TESTS =================
describe('useLogin hook', () => {
    const payload = {
        email: 'test@example.com',
        password: '123456',
    }

    const cfToken = 'cf-token'

    it('calls AuthService.login with correct args', async () => {
        (AuthService.login as jest.Mock).mockResolvedValue({
            message: 'Login success',
        })

        const { result } = renderHook(() => useLogin())

        await act(async () => {
            await result.current.trigger({
                payload,
                cfToken,
            })
        })

        expect(AuthService.login).toHaveBeenCalledTimes(1)
        expect(AuthService.login).toHaveBeenCalledWith(payload, cfToken)
    })

    it('returns response when login succeeds', async () => {
        const mockResponse = { message: 'Login success' };

        (AuthService.login as jest.Mock).mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useLogin())

        let res

        await act(async () => {
            res = await result.current.trigger({
                payload,
                cfToken,
            })
        })

        expect(res).toEqual(mockResponse)
    })

    it('shows toast error when login fails with Error', async () => {
        (AuthService.login as jest.Mock).mockRejectedValue(
            new Error('Invalid credentials')
        )

        const { result } = renderHook(() => useLogin())

        await act(async () => {
            try {
                await result.current.trigger({
                    payload,
                    cfToken,
                })
            } catch {}
        })

        expect(toast.error).toHaveBeenCalledWith('Invalid credentials')
    })

    it('shows default toast error when error is not Error instance', async () => {
        (AuthService.login as jest.Mock).mockRejectedValue(null)

        const { result } = renderHook(() => useLogin())

        await act(async () => {
            try {
                await result.current.trigger({
                    payload,
                    cfToken,
                })
            } catch {}
        })

        expect(toast.error).toHaveBeenCalledWith('Đăng nhập thất bại')
    })
})
