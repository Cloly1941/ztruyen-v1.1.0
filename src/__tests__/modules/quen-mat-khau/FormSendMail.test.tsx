// ** testing-library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Component
import FormSendMail from '@/modules/quen-mat-khau/FormSendMail'

// ** Hook
import { useForgotPassword } from '@/hooks/auth/useForgotPassword'

// ================= MOCKS =================

jest.mock('@/hooks/auth/useForgotPassword', () => ({
    useForgotPassword: jest.fn(),
}))

jest.mock('@/components/auth/TurnstileWidget', () => ({
    __esModule: true,
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button onClick={() => onVerify('cf-token')}>
            Verify CF
        </button>
    ),
}))

// ================= TESTS =================

describe('<FormSendMail />', () => {
    const trigger = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()

        ;(useForgotPassword as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        })
    })

    const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(
            screen.getByPlaceholderText('Nhập email của bạn'),
            'test@gmail.com'
        )
    }

    it('renders forgot password form correctly', () => {
        render(<FormSendMail />)

        expect(
            screen.getByPlaceholderText('Nhập email của bạn')
        ).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: /gửi email/i })
        ).toBeInTheDocument()
    })

    it('submits form and calls trigger with email', async () => {
        const user = userEvent.setup()

        render(<FormSendMail />)

        await fillValidForm(user)

        await user.click(
            screen.getByRole('button', { name: /gửi email/i })
        )

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                email: 'test@gmail.com',
            })
        })
    })

    it('submits form after Cloudflare verification', async () => {
        const user = userEvent.setup()

        render(<FormSendMail />)

        await user.click(screen.getByText('Verify CF'))

        await fillValidForm(user)

        await user.click(
            screen.getByRole('button', { name: /gửi email/i })
        )

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                email: 'test@gmail.com',
            })
        })
    })

    it('passes loading state to submit button', () => {
        (useForgotPassword as jest.Mock).mockReturnValue({
            trigger,
            isMutating: true,
        })

        render(<FormSendMail />)

        const submitButton = screen
            .getAllByRole('button')
            .find(btn => btn.getAttribute('type') === 'submit')

        expect(submitButton).toBeDisabled()
    })
})
