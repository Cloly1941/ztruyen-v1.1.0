// ** testing-library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Next router
import { useRouter } from 'next/navigation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import useMutateMethod from '@/hooks/common/useMutateMethod'

// ** Services
import { AuthService } from '@/services/api/auth'

// ** Module and type
import FormSendMail, {TForgotPassForm} from "@/modules/quen-mat-khau/FormSendMail";

// ================= TYPES =================
type TForgotPasswordArgs = {
    payload: TForgotPassForm
    cfToken: string
}

type TMutateOptions = {
    onSuccess?: (data: IApiRes<null>) => void
    onError?: (error: BackendError) => void
    api?: (arg: TForgotPasswordArgs) => Promise<IApiRes<null>>
}

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
        forgotPassword: jest.fn().mockResolvedValue({ message: 'Gửi email thành công' }),
    },
}))
jest.mock('@/components/auth/TurnstileWidget', () => ({
    __esModule: true,
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button onClick={() => onVerify('mock-cf-token')}>Verify CF</button>
    ),
}))

// ================== TESTS =================
describe('FormSendMail', () => {
    const push = jest.fn()
    const trigger = jest.fn()

    beforeEach(() => {
        ;(useRouter as jest.Mock).mockReturnValue({ push })
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const captureMutateOptions = () => {
        let captured: TMutateOptions = {}

        ;(useMutateMethod as jest.Mock).mockImplementation((options: TMutateOptions) => {
            captured = options
            return { trigger, isMutating: false }
        })

        render(<FormSendMail />)

        return captured
    }

    it('renders email input and submit button', () => {
        render(<FormSendMail />)

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Nhập email của bạn')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /gửi email/i })).toBeInTheDocument()
    })

    it('shows validation error when email is empty', async () => {
        const user = userEvent.setup()
        render(<FormSendMail />)

        await user.click(screen.getByRole('button', { name: /gửi email/i }))

        expect(await screen.findByText(/email không hợp lệ/i)).toBeInTheDocument()
        expect(trigger).not.toHaveBeenCalled()
    })

    it('shows validation error when email is invalid', async () => {
        const user = userEvent.setup()
        render(<FormSendMail />)

        await user.type(screen.getByPlaceholderText('Nhập email của bạn'), 'invalid-email')
        await user.click(screen.getByRole('button', { name: /gửi email/i }))

        expect(await screen.findByText(/email không hợp lệ/i)).toBeInTheDocument()
        expect(trigger).not.toHaveBeenCalled()
    })

    it('shows error toast when cfToken is missing', async () => {
        const user = userEvent.setup()
        render(<FormSendMail />)

        await user.type(screen.getByPlaceholderText('Nhập email của bạn'), 'test@gmail.com')
        // không click Verify CF → cfToken = null
        await user.click(screen.getByRole('button', { name: /gửi email/i }))

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Vui lòng xác thực bạn không phải bot'
            )
        })

        expect(trigger).not.toHaveBeenCalled()
    })

    it('calls trigger with correct payload when form is valid', async () => {
        const user = userEvent.setup()
        render(<FormSendMail />)

        await user.type(screen.getByPlaceholderText('Nhập email của bạn'), 'test@gmail.com')
        await user.click(screen.getByText('Verify CF'))
        await user.click(screen.getByRole('button', { name: /gửi email/i }))

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                payload: { email: 'test@gmail.com' },
                cfToken: 'mock-cf-token',
            })
        })
    })

    it('onSuccess: shows toast and redirects to home', async () => {
        const user = userEvent.setup()

        ;(useMutateMethod as jest.Mock).mockImplementation(({ onSuccess }: TMutateOptions) => ({
            isMutating: false,
            trigger: jest.fn().mockImplementation(async () => {
                onSuccess?.({ message: 'Gửi email thành công' } as IApiRes<null>)
            }),
        }))

        render(<FormSendMail />)

        await user.type(screen.getByPlaceholderText('Nhập email của bạn'), 'test@gmail.com')
        await user.click(screen.getByText('Verify CF'))
        await user.click(screen.getByRole('button', { name: /gửi email/i }))

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Gửi email thành công')
            expect(push).toHaveBeenCalledWith('/')
        })
    })

    it('shows loading state while submitting', () => {
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger,
            isMutating: true,
        })

        render(<FormSendMail />)

        expect(screen.getByRole('button', { name: /đợi xíu nhe/i })).toBeDisabled()
    })

    it('calls AuthService.forgotPassword with correct args when api is invoked', async () => {
        const { api } = captureMutateOptions()

        await api?.({
            payload: { email: 'test@gmail.com' },
            cfToken: 'mock-cf-token',
        })

        expect(AuthService.forgotPassword).toHaveBeenCalledWith(
            { email: 'test@gmail.com' },
            'mock-cf-token'
        )
    })
})