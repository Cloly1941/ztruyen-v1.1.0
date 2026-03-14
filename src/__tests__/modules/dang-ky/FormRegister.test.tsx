// ** testing-library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Component
import FormRegister, { TRegisterForm, TRegisterPayload } from '@/modules/dang-ky/FormRegister'

// ** Next router
import { useRouter } from 'next/navigation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import useMutateMethod from '@/hooks/common/useMutateMethod'

// ** Services
import { AuthService } from '@/services/api/auth'

// ** Types
import { IRegister } from '@/types/api'

// ================= TYPES =================
type TRegisterArgs = {
    payload: TRegisterPayload
    cfToken: string
}

type TMutateOptions = {
    onSuccess?: (data: IApiRes<IRegister>) => void
    onError?: (error: BackendError) => void
    api?: (arg: TRegisterArgs) => Promise<IApiRes<IRegister>>
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
        register: jest.fn().mockResolvedValue({ message: 'Đăng ký thành công' }),
    },
}))
jest.mock('@/components/auth/TurnstileWidget', () => ({
    __esModule: true,
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button onClick={() => onVerify('cf-token')}>Verify CF</button>
    ),
}))
jest.mock('@/components/ui/select', () => ({
    Select: ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => (
        <select
            data-testid="gender-select"
            value={value ?? ''}
            onChange={(e) => onValueChange(e.target.value)}
        >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="lgbt">LGBT</option>
        </select>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectValue: ({ placeholder }: { placeholder: string }) => <>{placeholder}</>,
    SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectItem: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
jest.mock('@/components/ui/popover', () => ({
    Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/components/ui/calendar', () => ({
    Calendar: ({
                   onSelect,
                   disabled,
                   formatters,
               }: {
        onSelect: (date: Date) => void
        disabled?: (date: Date) => boolean
        formatters?: { formatMonthDropdown?: (date: Date) => string }
    }) => {
        disabled?.(new Date('1990-01-01'))
        disabled?.(new Date())
        formatters?.formatMonthDropdown?.(new Date('2024-01-01'))
        return (
            <button type="button" onClick={() => onSelect(new Date('2000-01-01'))}>
                Pick birthday
            </button>
        )
    },
}))

// ================== TESTS =================
describe('FormRegister', () => {
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

    // helper: fill tất cả field hợp lệ
    const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(screen.getByPlaceholderText('Tên hiển thị của bạn'), 'Nguyen Van A')
        await user.type(screen.getByPlaceholderText('Email bạn dùng để đăng ký'), 'test@gmail.com')
        await user.type(screen.getByLabelText('Mật khẩu'), '123456')
        await user.type(screen.getByLabelText('Nhập lại mật khẩu'), '123456')
        await user.selectOptions(screen.getByTestId('gender-select'), 'male')
        await user.click(screen.getByText('Pick birthday'))
    }

    // helper: capture options từ useMutateMethod
    const captureMutateOptions = () => {
        let captured: TMutateOptions = {}

        ;(useMutateMethod as jest.Mock).mockImplementation((options: TMutateOptions) => {
            captured = options
            return { trigger, isMutating: false }
        })

        render(<FormRegister />)

        return captured
    }

    it('renders all register form fields', () => {
        render(<FormRegister />)

        expect(screen.getByPlaceholderText('Tên hiển thị của bạn')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Email bạn dùng để đăng ký')).toBeInTheDocument()
        expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument()
        expect(screen.getByLabelText('Nhập lại mật khẩu')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /đăng ký/i })).toBeInTheDocument()
    })

    it('shows validation errors when submitting empty form', async () => {
        const user = userEvent.setup()
        render(<FormRegister />)

        await user.click(screen.getByRole('button', { name: /đăng ký/i }))

        expect(await screen.findByText(/tên không được để trống/i)).toBeInTheDocument()
        expect(await screen.findByText(/email không hợp lệ/i)).toBeInTheDocument()
        expect(await screen.findByText(/mật khẩu không được để trống/i)).toBeInTheDocument()
    })

    it('shows error toast when cfToken is missing', async () => {
        const user = userEvent.setup()
        render(<FormRegister />)

        await fillValidForm(user)
        // không click Verify CF → cfToken = null
        await user.click(screen.getByRole('button', { name: /đăng ký/i }))

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Vui lòng xác thực bạn không phải bot'
            )
        })

        expect(trigger).not.toHaveBeenCalled()
    })

    it('calls trigger with correct payload when form is valid', async () => {
        const user = userEvent.setup()
        render(<FormRegister />)

        await user.click(screen.getByText('Verify CF'))
        await fillValidForm(user)
        await user.click(screen.getByRole('button', { name: /đăng ký/i }))

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                payload: expect.objectContaining({
                    name: 'Nguyen Van A',
                    email: 'test@gmail.com',
                    gender: 'male',
                    birthday: new Date('2000-01-01').toISOString(),
                }),
                cfToken: 'cf-token',
            })
        })
    })

    it('onSuccess: shows toast and redirects to login', async () => {
        const user = userEvent.setup()

        ;(useMutateMethod as jest.Mock).mockImplementation(({ onSuccess }: TMutateOptions) => ({
            isMutating: false,
            trigger: jest.fn().mockImplementation(async () => {
                onSuccess?.({ message: 'Đăng ký thành công' } as IApiRes<IRegister>)
            }),
        }))

        render(<FormRegister />)

        await user.click(screen.getByText('Verify CF'))
        await fillValidForm(user)
        await user.click(screen.getByRole('button', { name: /đăng ký/i }))

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Đăng ký thành công')
            expect(push).toHaveBeenCalledWith('/dang-nhap')
        })
    })

    it('shows loading state while submitting', () => {
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger,
            isMutating: true,
        })

        render(<FormRegister />)

        const submitBtn = screen.getByRole('button', { name: /đợi xíu nhe/i })
        expect(submitBtn).toBeDisabled()
    })

    it('calls AuthService.register with correct args when api is invoked', async () => {
        const { api } = captureMutateOptions()

        await api?.({
            payload: {
                name: 'Nguyen Van A',
                email: 'test@gmail.com',
                password: '123456',
                gender: 'male',
                birthday: new Date('2000-01-01').toISOString(),
                age: 24,
            },
            cfToken: 'cf-token',
        })

        expect(AuthService.register).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Nguyen Van A', email: 'test@gmail.com' }),
            'cf-token'
        )
    })
})