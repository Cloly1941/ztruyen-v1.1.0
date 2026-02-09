// ** Testing Library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Next
import { useRouter } from 'next/navigation'

// ** Module
import FormLogin from '@/modules/dang-nhap/FormLogin'

// ** react hot toast
import toast from 'react-hot-toast'

// ** Hooks
import { useLogin } from '@/hooks/auth/useLogin'

// ================= MOCKS =================
jest.mock('@/hooks/auth/useLogin')

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock('@/components/auth/TurnstileWidget', () => ({
    __esModule: true,
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button
            data-testid="turnstile"
            onClick={() => onVerify('mock-cf-token')}
        >
            verify
        </button>
    ),
}))

// ================== TESTS =================
describe('FormLogin', () => {
    const trigger = jest.fn()
    const push = jest.fn()

    beforeEach(() => {
        (useLogin as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        });

        (useRouter as jest.Mock).mockReturnValue({
            push,
        })
    })

    it('renders login form', () => {
        render(<FormLogin />)

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /đăng nhập/i })
        ).toBeInTheDocument()
    })

    it('shows validation errors when submitting empty form', async () => {
        const user = userEvent.setup()
        render(<FormLogin />)

        await user.click(
            screen.getByRole('button', { name: /đăng nhập/i })
        )

        expect(await screen.findByText(/email không hợp lệ/i)).toBeInTheDocument()
        expect(
            await screen.findByText(/mật khẩu không được để trống/i)
        ).toBeInTheDocument()
    })

    it('shows error toast when cfToken is missing (cover line 57–58)', async () => {
        const user = userEvent.setup()
        render(<FormLogin />)

        await user.type(
            screen.getByLabelText(/email/i),
            'test@gmail.com'
        )

        await user.type(
            screen.getByLabelText(/mật khẩu/i),
            '123456'
        )

        await user.click(
            screen.getByRole('button', { name: /đăng nhập/i })
        )

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Vui lòng xác thực bạn không phải bot'
            )
        })

        expect(trigger).not.toHaveBeenCalled()
    })

    it('submits form successfully when verified', async () => {
        const user = userEvent.setup()

        trigger.mockResolvedValue({
            message: 'Login success',
        })

        render(<FormLogin />)

        await user.type(
            screen.getByLabelText(/email/i),
            'test@gmail.com'
        )

        await user.type(
            screen.getByLabelText(/mật khẩu/i),
            '123456'
        )

        await user.click(screen.getByTestId('turnstile'))

        await user.click(
            screen.getByRole('button', { name: /đăng nhập/i })
        )

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                payload: {
                    email: 'test@gmail.com',
                    password: '123456',
                },
                cfToken: 'mock-cf-token',
            })
        })

        expect(toast.success).toHaveBeenCalledWith('Login success')
        expect(push).toHaveBeenCalledWith('/')
    })

    it('does nothing when login returns no response', async () => {
        const user = userEvent.setup()

        trigger.mockResolvedValue(undefined)

        render(<FormLogin />)

        await user.type(
            screen.getByLabelText(/email/i),
            'test@gmail.com'
        )

        await user.type(
            screen.getByLabelText(/mật khẩu/i),
            '123456'
        )

        // verify Cloudflare
        await user.click(screen.getByTestId('turnstile'))

        await user.click(
            screen.getByRole('button', { name: /đăng nhập/i })
        )

        await waitFor(() => {
            expect(trigger).toHaveBeenCalled()
        })

        expect(toast.success).not.toHaveBeenCalled()

        expect(push).not.toHaveBeenCalled()
    })

})
