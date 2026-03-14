// ** testing-library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Component
import FormChangePassword, { TChangePasswordPayload } from '@/modules/quen-mat-khau/FormChangePassword'

// ** Next router
import { useRouter } from 'next/navigation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import useMutateMethod from '@/hooks/common/useMutateMethod'

// ** Services
import { AuthService } from '@/services/api/auth'

// ================= TYPES =================
type TChangePasswordArgs = {
    payload: TChangePasswordPayload
    token: string
}

type TMutateOptions = {
    onSuccess?: (data: IApiRes<null>) => void
    onError?: (error: BackendError) => void
    api?: (arg: TChangePasswordArgs) => Promise<IApiRes<null>>
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
        resetPassword: jest.fn().mockResolvedValue({ message: 'Đổi mật khẩu thành công' }),
    },
}))

// ================== TESTS =================
describe('FormChangePassword', () => {
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

    const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(screen.getByLabelText('Mật khẩu'), '123456')
        await user.type(screen.getByLabelText('Nhập lại mật khẩu'), '123456')
    }

    const captureMutateOptions = () => {
        let captured: TMutateOptions = {}

        ;(useMutateMethod as jest.Mock).mockImplementation((options: TMutateOptions) => {
            captured = options
            return { trigger, isMutating: false }
        })

        render(<FormChangePassword token="valid-token" />)

        return captured
    }

    it('renders change password form fields', () => {
        render(<FormChangePassword token="valid-token" />)

        expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument()
        expect(screen.getByLabelText('Nhập lại mật khẩu')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /đổi mật khẩu/i })).toBeInTheDocument()
    })

    it('shows validation errors when submitting empty form', async () => {
        const user = userEvent.setup()
        render(<FormChangePassword token="valid-token" />)

        await user.click(screen.getByRole('button', { name: /đổi mật khẩu/i }))

        expect(await screen.findByText(/mật khẩu không được để trống/i)).toBeInTheDocument()
        expect(await screen.findByText(/vui lòng nhập lại mật khẩu/i)).toBeInTheDocument()
    })

    it('shows validation error when passwords do not match', async () => {
        const user = userEvent.setup()
        render(<FormChangePassword token="valid-token" />)

        await user.type(screen.getByLabelText('Mật khẩu'), '123456')
        await user.type(screen.getByLabelText('Nhập lại mật khẩu'), 'different')
        await user.click(screen.getByRole('button', { name: /đổi mật khẩu/i }))

        expect(await screen.findByText(/mật khẩu không khớp/i)).toBeInTheDocument()
    })

    it('shows error toast when token is missing', async () => {
        const user = userEvent.setup()
        render(<FormChangePassword />)

        await fillValidForm(user)
        await user.click(screen.getByRole('button', { name: /đổi mật khẩu/i }))

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Đổi mật khẩu thất bại, vui lòng thử lại sau!'
            )
        })

        expect(trigger).not.toHaveBeenCalled()
    })

    it('calls trigger with correct payload when form is valid', async () => {
        const user = userEvent.setup()
        render(<FormChangePassword token="valid-token" />)

        await fillValidForm(user)
        await user.click(screen.getByRole('button', { name: /đổi mật khẩu/i }))

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                payload: { newPassword: '123456' },
                token: 'valid-token',
            })
        })
    })

    it('onSuccess: shows toast and redirects to login', async () => {
        const user = userEvent.setup()

        ;(useMutateMethod as jest.Mock).mockImplementation(({ onSuccess }: TMutateOptions) => ({
            isMutating: false,
            trigger: jest.fn().mockImplementation(async () => {
                onSuccess?.({ message: 'Đổi mật khẩu thành công' } as IApiRes<null>)
            }),
        }))

        render(<FormChangePassword token="valid-token" />)

        await fillValidForm(user)
        await user.click(screen.getByRole('button', { name: /đổi mật khẩu/i }))

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Đổi mật khẩu thành công')
            expect(push).toHaveBeenCalledWith('/dang-nhap')
        })
    })

    it('shows loading state while submitting', () => {
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger,
            isMutating: true,
        })

        render(<FormChangePassword token="valid-token" />)

        const submitBtn = screen.getByRole('button', { name: /đợi xíu nhe/i })
        expect(submitBtn).toBeDisabled()
    })

    it('calls AuthService.resetPassword with correct args when api is invoked', async () => {
        const { api } = captureMutateOptions()

        await api?.({
            payload: { newPassword: '123456' },
            token: 'valid-token',
        })

        expect(AuthService.resetPassword).toHaveBeenCalledWith(
            { newPassword: '123456' },
            'valid-token'
        )
    })
})