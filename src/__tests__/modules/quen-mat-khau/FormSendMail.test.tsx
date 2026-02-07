// ** Testing Library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Component
import FormSendMail from '@/modules/quen-mat-khau/FormSendMail'

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

jest.mock('@/components/auth/TurnstileWidget', () => ({
    __esModule: true,
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button
            data-testid="mock-turnstile"
            onClick={() => onVerify('cf-token')}
        >
            Verify CF
        </button>
    ),
}))

// ================= TESTS =================

describe('<FormSendMail />', () => {
    const push = jest.fn()

    const setup = () => {
        render(<FormSendMail />)

        return {
            emailInput: screen.getByPlaceholderText('Nhập email của bạn'),
            submitButton: screen.getByRole('button', { name: /gửi email/i }),
            turnstileButton: screen.getByTestId('mock-turnstile'),
        }
    }

    beforeEach(() => {
        jest.clearAllMocks()
        ;(useRouter as jest.Mock).mockReturnValue({ push })
    })

    it('Render form correctly', () => {
        const { emailInput, submitButton } = setup()

        expect(emailInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
    })

    it('Show validation error when email is invalid', async () => {
        const user = userEvent.setup()
        const { emailInput, submitButton } = setup()

        await user.type(emailInput, 'invalid-email')
        await user.click(submitButton)

        expect(
            await screen.findByText('Email không hợp lệ')
        ).toBeInTheDocument()
    })

    it('Show error if Cloudflare token is missing', async () => {
        const user = userEvent.setup()
        const { emailInput, submitButton } = setup()

        await user.type(emailInput, 'test@gmail.com')
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Vui lòng xác thực bạn không phải bot'
            )
        })

        expect(AuthService.forgotPassword).not.toHaveBeenCalled()
    })

    it('Submit forgot password successfully', async () => {
        const user = userEvent.setup()

        ;(AuthService.forgotPassword as jest.Mock).mockResolvedValue({
            message: 'Đã gửi email',
        })

        const {
            emailInput,
            submitButton,
            turnstileButton,
        } = setup()

        await user.type(emailInput, 'test@gmail.com')
        await user.click(turnstileButton)
        await user.click(submitButton)

        await waitFor(() => {
            expect(AuthService.forgotPassword).toHaveBeenCalledWith(
                { email: 'test@gmail.com' },
                'cf-token'
            )
        })

        expect(toast.success).toHaveBeenCalledWith('Đã gửi email')
        expect(push).toHaveBeenCalledWith('/')
    })

    it('Show error message when API throws Error', async () => {
        const user = userEvent.setup()

        ;(AuthService.forgotPassword as jest.Mock).mockRejectedValue(
            new Error('Email không tồn tại')
        )

        const {
            emailInput,
            submitButton,
            turnstileButton,
        } = setup()

        await user.type(emailInput, 'test@gmail.com')
        await user.click(turnstileButton)
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Email không tồn tại')
        })
    })

    it('Show generic error when API throws non-Error', async () => {
        const user = userEvent.setup()

        ;(AuthService.forgotPassword as jest.Mock).mockRejectedValue('ERROR')

        const {
            emailInput,
            submitButton,
            turnstileButton,
        } = setup()

        await user.type(emailInput, 'test@gmail.com')
        await user.click(turnstileButton)
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Đã có lỗi xảy ra khi gửi email, vui lòng thử lại sau!'
            )
        })
    })
})
