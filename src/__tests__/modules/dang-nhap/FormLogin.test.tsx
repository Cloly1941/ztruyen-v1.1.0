// ** Testing Library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Next
import { useRouter } from 'next/navigation'

// ** Module
import FormLogin, { TLoginForm } from '@/modules/dang-nhap/FormLogin'

// ** react hot toast
import toast from 'react-hot-toast'

// ** Hooks
import useMutateMethod from '@/hooks/common/useMutateMethod'

// ** Services
import { AuthService } from '@/services/api/auth'

// ** Types
import { ILogin } from '@/types/api'

// ================= MOCKS =================
jest.mock('@/hooks/common/useMutateMethod')
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))
jest.mock('@/services/api/auth', () => ({
    AuthService: {
        login: jest.fn().mockResolvedValue({ message: 'Đăng nhập thành công' }),
    },
}))
jest.mock('@/components/auth/TurnstileWidget', () => ({
    __esModule: true,
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button data-testid="turnstile" onClick={() => onVerify('mock-cf-token')}>
            verify
        </button>
    ),
}))

// ================== TYPES ==================
type TLoginArgs = {
    payload: TLoginForm
    cfToken: string
}

type TMutateOptions = {
    onSuccess?: (data: IApiRes<ILogin>) => void
    onError?: (error: BackendError) => void
    api?: (arg: TLoginArgs) => Promise<IApiRes<ILogin>>
}

// ================== TESTS =================
describe('FormLogin', () => {
    const trigger = jest.fn()
    const push = jest.fn()

    beforeEach(() => {
        ;(useRouter as jest.Mock).mockReturnValue({ push })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const mockMutate = (options?: { callOnSuccess?: boolean }) => {
        ;(useMutateMethod as jest.Mock).mockImplementation(({ onSuccess }: TMutateOptions) => ({
            isMutating: false,
            trigger: jest.fn().mockImplementation(async () => {
                if (options?.callOnSuccess) {
                    onSuccess?.({ message: 'Đăng nhập thành công' } as IApiRes<ILogin>)
                }
            }),
        }))
    }

    const captureApi = () => {
        let capturedApi: ((arg: TLoginArgs) => Promise<IApiRes<ILogin>>) | undefined

        ;(useMutateMethod as jest.Mock).mockImplementation(({ api }: TMutateOptions) => {
            capturedApi = api
            return { trigger, isMutating: false }
        })

        render(<FormLogin />)

        return capturedApi!
    }

    it('renders login form', () => {
        mockMutate()
        render(<FormLogin />)

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
    })

    it('shows validation errors when submitting empty form', async () => {
        mockMutate()
        const user = userEvent.setup()
        render(<FormLogin />)

        await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

        expect(await screen.findByText(/email không hợp lệ/i)).toBeInTheDocument()
        expect(await screen.findByText(/mật khẩu không được để trống/i)).toBeInTheDocument()
    })

    it('shows error toast when cfToken is missing', async () => {
        mockMutate()
        const user = userEvent.setup()
        render(<FormLogin />)

        await user.type(screen.getByLabelText(/email/i), 'test@gmail.com')
        await user.type(screen.getByLabelText(/mật khẩu/i), '123456')
        await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Vui lòng xác thực bạn không phải bot'
            )
        })
    })

    it('calls trigger with correct payload when form is valid', async () => {
        let capturedTrigger: jest.Mock | null = null

        ;(useMutateMethod as jest.Mock).mockImplementation(() => {
            capturedTrigger = jest.fn().mockResolvedValue(undefined)
            return { isMutating: false, trigger: capturedTrigger }
        })

        const user = userEvent.setup()
        render(<FormLogin />)

        await user.type(screen.getByLabelText(/email/i), 'test@gmail.com')
        await user.type(screen.getByLabelText(/mật khẩu/i), '123456')
        await user.click(screen.getByTestId('turnstile'))
        await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

        await waitFor(() => {
            expect(capturedTrigger).toHaveBeenCalledWith({
                payload: { email: 'test@gmail.com', password: '123456' },
                cfToken: 'mock-cf-token',
            })
        })
    })

    it('calls onSuccess with toast and redirect when login succeeds', async () => {
        mockMutate({ callOnSuccess: true })

        const user = userEvent.setup()
        render(<FormLogin />)

        await user.type(screen.getByLabelText(/email/i), 'test@gmail.com')
        await user.type(screen.getByLabelText(/mật khẩu/i), '123456')
        await user.click(screen.getByTestId('turnstile'))
        await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Đăng nhập thành công')
            expect(push).toHaveBeenCalledWith('/')
        })
    })

    it('shows loading state while submitting', () => {
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger,
            isMutating: true,
        })

        render(<FormLogin />)

        const submitBtn = screen.getByRole('button', { name: /đợi xíu nhe/i })
        expect(submitBtn).toBeDisabled()
    })

    it('calls AuthService.login with correct args when api is invoked', async () => {
        const api = captureApi()

        await api({
            payload: { email: 'test@gmail.com', password: '123456' },
            cfToken: 'mock-cf-token',
        })

        expect(AuthService.login).toHaveBeenCalledWith(
            { email: 'test@gmail.com', password: '123456' },
            'mock-cf-token'
        )
    })
})