// ** testing-library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Component
import FormChangePassword from '@/modules/quen-mat-khau/FormChangePassword'

// ** Next router
import { useRouter } from 'next/navigation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import { useChangePassword } from '@/hooks/auth/useChangePassword'

// ================= MOCKS =================

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock('@/hooks/auth/useChangePassword', () => ({
    useChangePassword: jest.fn(),
}))

// ================= TESTS =================

describe('<FormChangePassword />', () => {
    const push = jest.fn()
    const trigger = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()

        ;(useRouter as jest.Mock).mockReturnValue({ push })

        ;(useChangePassword as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        })
    })

    const fillValidForm = async (
        user: ReturnType<typeof userEvent.setup>
    ) => {
        await user.type(
            screen.getByLabelText(/^mật khẩu$/i),
            '123456'
        )

        await user.type(
            screen.getByLabelText(/nhập lại mật khẩu/i),
            '123456'
        )
    }

    it('renders change password form fields', () => {
        render(<FormChangePassword token="valid-token" />)

        expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument()
        expect(
            screen.getByLabelText('Nhập lại mật khẩu')
        ).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: /đổi mật khẩu/i })
        ).toBeInTheDocument()
    })

    it('shows error toast when token is missing', async () => {
        const user = userEvent.setup()

        render(<FormChangePassword />)

        await fillValidForm(user)

        await user.click(
            screen.getByRole('button', { name: /đổi mật khẩu/i })
        )

        expect(toast.error).toHaveBeenCalledWith(
            'Đổi mật khẩu thất bại, vui lòng thử lại sau!'
        )

        expect(trigger).not.toHaveBeenCalled()
    })

    it('submits successfully and redirects to login page', async () => {
        const user = userEvent.setup()

        trigger.mockResolvedValue({
            message: 'Change password success',
        })

        render(<FormChangePassword token="valid-token" />)

        await fillValidForm(user)

        await user.click(
            screen.getByRole('button', { name: /đổi mật khẩu/i })
        )

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                payload: {
                    newPassword: '123456',
                },
                token: 'valid-token',
            })
        })

        expect(toast.success).toHaveBeenCalledWith(
            'Change password success'
        )

        expect(push).toHaveBeenCalledWith('/dang-nhap')
    })

    it('shows success toast when response has message', async () => {
        const user = userEvent.setup()

        trigger.mockResolvedValue({
            message: 'Đổi mật khẩu thành công',
        })

        render(<FormChangePassword token="valid-token" />)

        await fillValidForm(user)

        await user.click(
            screen.getByRole('button', { name: /đổi mật khẩu/i })
        )

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                'Đổi mật khẩu thành công'
            )
        })
    })

    it('does nothing when response has no message', async () => {
        const user = userEvent.setup()

        trigger.mockResolvedValue({})

        render(<FormChangePassword token="valid-token" />)

        await user.type(
            screen.getByLabelText(/^mật khẩu$/i),
            '123456'
        )

        await user.type(
            screen.getByLabelText(/nhập lại mật khẩu/i),
            '123456'
        )

        await user.click(
            screen.getByRole('button', { name: /đổi mật khẩu/i })
        )

        await waitFor(() => {
            expect(trigger).toHaveBeenCalled()
        })

        expect(toast.success).not.toHaveBeenCalled()
        expect(push).not.toHaveBeenCalled()
    })

})
