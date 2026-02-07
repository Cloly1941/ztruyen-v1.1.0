// ** Testing Library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** react hot toast
import toast from 'react-hot-toast'

// ** Next
import { useRouter } from 'next/navigation'

// ** Module
import FormChangePassword from '@/modules/quen-mat-khau/FormChangePassword'

// ** Services
import { AuthService } from '@/services/auth'

// =============================== Mocks =======================================

jest.mock('@/services/auth', () => ({
    AuthService: {
        resetPassword: jest.fn(),
    },
}))

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

// =============================== Tests =======================================

describe('FormChangePassword', () => {
    const pushMock = jest.fn()

    beforeEach(() => {
        ;(useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const setup = (token?: string) => {
        render(<FormChangePassword token={token} />)

        const newPasswordInput = screen.getByLabelText('Mật khẩu')
        const confirmPasswordInput = screen.getByLabelText('Nhập lại mật khẩu')
        const submitButton = screen.getByRole('button', { name: 'Đổi mật khẩu' })

        return {
            newPasswordInput,
            confirmPasswordInput,
            submitButton,
        }
    }

    it('Render form correctly', () => {
        setup('token-123')

        expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument()
        expect(screen.getByLabelText('Nhập lại mật khẩu')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Đổi mật khẩu' })).toBeInTheDocument()
    })

    it('Show error if token is missing', async () => {
        const user = userEvent.setup()
        const {
            newPasswordInput,
            confirmPasswordInput,
            submitButton,
        } = setup(undefined)

        await user.type(newPasswordInput, '123456')
        await user.type(confirmPasswordInput, '123456')
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Đổi mật khẩu thất bại, vui lòng thử lại sau!'
            )
        })

        expect(AuthService.resetPassword).not.toHaveBeenCalled()
    })


    it('Show validation error when passwords do not match', async () => {
        const user = userEvent.setup()
        const { newPasswordInput, confirmPasswordInput, submitButton } =
            setup('token-123')

        await user.type(newPasswordInput, '123456')
        await user.type(confirmPasswordInput, '654321')
        await user.click(submitButton)

        expect(
            await screen.findByText('Mật khẩu không khớp')
        ).toBeInTheDocument()

        expect(AuthService.resetPassword).not.toHaveBeenCalled()
    })

    it('Call resetPassword and redirect on success', async () => {
        const user = userEvent.setup()

        ;(AuthService.resetPassword as jest.Mock).mockResolvedValue({
            message: 'Đổi mật khẩu thành công',
        })

        const { newPasswordInput, confirmPasswordInput, submitButton } =
            setup('token-123')

        await user.type(newPasswordInput, '123456')
        await user.type(confirmPasswordInput, '123456')
        await user.click(submitButton)

        await waitFor(() => {
            expect(AuthService.resetPassword).toHaveBeenCalledWith(
                { newPassword: '123456' },
                'token-123'
            )
        })

        expect(toast.success).toHaveBeenCalledWith('Đổi mật khẩu thành công')
        expect(pushMock).toHaveBeenCalledWith('/dang-nhap')
    })

    it('Show error toast when resetPassword fails', async () => {
        const user = userEvent.setup()

        ;(AuthService.resetPassword as jest.Mock).mockRejectedValue(
            new Error('Server error')
        )

        const { newPasswordInput, confirmPasswordInput, submitButton } =
            setup('token-123')

        await user.type(newPasswordInput, '123456')
        await user.type(confirmPasswordInput, '123456')
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Server error')
        })
    })

    it('Show generic error when error is not instance of Error', async () => {
        const user = userEvent.setup()

        ;(AuthService.resetPassword as jest.Mock).mockRejectedValue('some error')

        const {
            newPasswordInput,
            confirmPasswordInput,
            submitButton,
        } = setup('valid-token')

        await user.type(newPasswordInput, '123456')
        await user.type(confirmPasswordInput, '123456')
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Đã có lỗi xảy ra khi đổi mật khẩu, vui lòng thử lại sau!'
            )
        })
    })

})
