/* eslint-disable @typescript-eslint/no-explicit-any */

// ** testing-library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Component
import FormRegister from '@/modules/dang-ky/FormRegister'

// ** Next router
import { useRouter } from 'next/navigation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import { useRegister } from '@/hooks/auth/useRegister'

// ================= MOCKS =================

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock('@/hooks/auth/useRegister', () => ({
    useRegister: jest.fn(),
}))

jest.mock('@/components/auth/TurnstileWidget', () => ({
    __esModule: true,
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button onClick={() => onVerify('cf-token')}>
            Verify CF
        </button>
    ),
}))

jest.mock('@/components/ui/select', () => ({
    Select: ({ value, onValueChange }: any) => (
        <select
            data-testid="gender-select"
            value={value ?? ''}
            onChange={(e) => onValueChange(e.target.value)}
        >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="lgbt">LGBT</option>
        </select>
    ),
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <>{placeholder}</>,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children }: any) => <>{children}</>,
}))

jest.mock('@/components/ui/popover', () => ({
    Popover: ({ children }: any) => <div>{children}</div>,
    PopoverTrigger: ({ children }: any) => <div>{children}</div>,
    PopoverContent: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/components/ui/calendar', () => ({
    Calendar: ({ onSelect, disabled, formatters }: any) => {
        disabled?.(new Date('1990-01-01'))
        disabled?.(new Date())

        formatters?.formatMonthDropdown?.(new Date('2024-01-01'))

        return (
            <button
                type="button"
                onClick={() => onSelect(new Date('2000-01-01'))}
            >
                Pick birthday
            </button>
        )
    },
}))

// ================= TESTS =================

describe('<FormRegister /> (with useRegister hook)', () => {
    const push = jest.fn()
    const trigger = jest.fn()

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push });

        (useRegister as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        })
    })

    const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(
            screen.getByPlaceholderText('Tên hiển thị của bạn'),
            'Nguyen Van A'
        )

        await user.type(
            screen.getByPlaceholderText('Email bạn dùng để đăng ký'),
            'test@gmail.com'
        )

        await user.type(screen.getByLabelText('Mật khẩu'), '123456')
        await user.type(screen.getByLabelText('Nhập lại mật khẩu'), '123456')

        await user.selectOptions(
            screen.getByTestId('gender-select'),
            'male'
        )

        await user.click(screen.getByText('Pick birthday'))
    }

    it('renders all register form fields', () => {
        render(<FormRegister />)

        expect(
            screen.getByPlaceholderText('Tên hiển thị của bạn')
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText('Email bạn dùng để đăng ký')
        ).toBeInTheDocument()

        expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument()
        expect(screen.getByLabelText('Nhập lại mật khẩu')).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: /đăng ký/i })
        ).toBeInTheDocument()
    })

    it('shows error toast when Cloudflare verification is missing', async () => {
        const user = userEvent.setup()

        render(<FormRegister />)

        await fillValidForm(user)

        await user.click(
            screen.getByRole('button', { name: /đăng ký/i })
        )

        expect(toast.error).toHaveBeenCalledWith(
            'Vui lòng xác thực bạn không phải bot'
        )

        expect(trigger).not.toHaveBeenCalled()
    })

    it('submits form successfully, calls register and redirects to login page', async () => {
        const user = userEvent.setup()

        trigger.mockResolvedValue({
            message: 'Register success',
        })

        render(<FormRegister />)

        await user.click(screen.getByText('Verify CF'))

        await fillValidForm(user)

        await user.click(
            screen.getByRole('button', { name: /đăng ký/i })
        )

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                payload: expect.objectContaining({
                    name: 'Nguyen Van A',
                    email: 'test@gmail.com',
                    gender: 'male',
                }),
                cfToken: 'cf-token',
            })
        })

        expect(toast.success).toHaveBeenCalledWith('Register success')
        expect(push).toHaveBeenCalledWith('/dang-nhap')
    })
})
