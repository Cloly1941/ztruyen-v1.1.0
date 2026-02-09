// ** Testing Library
import { renderHook, act } from '@testing-library/react'

// ** react hot toast
import toast from 'react-hot-toast'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** Hook
import { useRegister } from '@/hooks/auth/useRegister'

// ** Services
import { AuthService } from '@/services/auth'

// ** Configs
import { CONFIG_TAG } from '@/configs/tag'

// ** Types
import { TRegisterPayload } from '@/modules/dang-ky/FormRegister'

// ================= MOCKS =================
jest.mock('@/services/auth', () => ({
    AuthService: {
        register: jest.fn(),
    },
}))

jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
}))

jest.mock('swr/mutation', () => ({
    __esModule: true,
    default: jest.fn(),
}))

// ================= TESTS =================
describe('useRegister hook', () => {
    beforeEach(() => {
        (useSWRMutation as jest.Mock).mockImplementation(
            (_key, fetcher, options) => ({
                trigger: (arg: any) => fetcher(null, { arg }),
                isMutating: false,
                ...options,
            })
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('calls useSWRMutation with correct config', () => {
        renderHook(() => useRegister())

        expect(useSWRMutation).toHaveBeenCalledWith(
            CONFIG_TAG.AUTH.REGISTER,
            expect.any(Function),
            expect.objectContaining({
                onError: expect.any(Function),
            })
        )
    })

    it('calls AuthService.register with correct payload and token', async () => {
        const payload: TRegisterPayload = {
                name: 'Test User',
                email: 'test@gmail.com',
                password: '123456',
                gender: 'male',
                age: 18,
                birthday: '1999-01-01',
            };

        (AuthService.register as jest.Mock).mockResolvedValue({
            message: 'Register success',
        })

        const { result } = renderHook(() => useRegister())

        await act(async () => {
            const res = await result.current.trigger({
                payload,
                cfToken: 'cf-token',
            })

            expect(res.message).toBe('Register success')
        })

        expect(AuthService.register).toHaveBeenCalledWith(
            payload,
            'cf-token'
        )
    })

    it('shows error toast when register fails with Error', async () => {
        renderHook(() => useRegister())

        const [, , options] = (useSWRMutation as jest.Mock).mock.calls[0]

        await act(async () => {
            options.onError(new Error('Register failed'))
        })

        expect(toast.error).toHaveBeenCalledWith('Register failed')
    })

    it('shows generic error when error is not Error object', async () => {
        renderHook(() => useRegister())

        const [, , options] = (useSWRMutation as jest.Mock).mock.calls[0]

        await act(async () => {
            options.onError(null)
        })

        expect(toast.error).toHaveBeenCalledWith(
            'Đã có lỗi xảy ra khi đăng ký, vui lòng thử lại sau!'
        )
    })
})
