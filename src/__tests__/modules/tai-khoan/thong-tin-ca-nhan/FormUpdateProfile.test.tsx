// ** testing-library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Toast
import toast from 'react-hot-toast'

// ** Component
import FormUpdateProfile, { TUpdateProfilePayload } from '@/modules/tai-khoan/thong-tin-ca-nhan/FormUpdateProfile'

// ** Hook
import useMutateMethod from '@/hooks/common/useMutateMethod'

// ** Services
import { UserService } from '@/services/api/user'

// ** Types
import { IUserProfile } from '@/types/api'

// ================= TYPES =================
type TMutateOptions = {
    onSuccess?: (data: IApiRes<IUserProfile>) => void
    onError?: (error: BackendError) => void
    api?: (payload: TUpdateProfilePayload) => Promise<IApiRes<IUserProfile>>
}

// ================= MOCKS =================
jest.mock('@/hooks/common/useMutateMethod')
jest.mock('@/services/api/user', () => ({
    UserService: {
        updateProfile: jest.fn().mockResolvedValue({ message: 'Cập nhật thành công' }),
    },
}))
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
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
        formatters?.formatMonthDropdown?.(new Date('2024-01-01'))
        return (
            <button type="button" onClick={() => onSelect(new Date('2000-01-01'))}>
                Pick birthday
            </button>
        )
    },
}))
jest.mock('@/utils/date', () => ({
    getAgeToBirthday: jest.fn(() => 26),
    getDefaultBirthdayMonth: jest.fn(() => new Date()),
    isBirthdayValid: jest.fn(() => true),
}))

// ================= FIXTURES =================
const mockUser: IUserProfile = {
    _id: '1',
    name: 'Test User',
    email: 'test@gmail.com',
    birthday: '2000-01-01T00:00:00.000Z',
    age: 24,
    gender: 'male',
    role: 'user',
    provider: 'local',
    createdAt: '',
    updatedAt: '',
} as IUserProfile

// ================== TESTS =================
describe('FormUpdateProfile', () => {
    const trigger = jest.fn()

    const setup = (isMutating = false, userOverride?: Partial<IUserProfile>) => {
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger,
            isMutating,
        })

        render(<FormUpdateProfile user={{ ...mockUser, ...userOverride }} />)
    }

    const captureMutateOptions = () => {
        let captured: TMutateOptions = {}

        ;(useMutateMethod as jest.Mock).mockImplementation((options: TMutateOptions) => {
            captured = options
            return { trigger, isMutating: false }
        })

        render(<FormUpdateProfile user={mockUser} />)

        return captured
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders all profile fields', () => {
        setup()

        expect(screen.getByPlaceholderText('Tên hiển thị của bạn')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Tiểu sử của bạn (tối đa 160 ký tự)')).toBeInTheDocument()
        expect(screen.getByTestId('gender-select')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cập nhật/i })).toBeInTheDocument()
    })

    it('pre-fills form with user data', () => {
        setup()

        expect(screen.getByPlaceholderText('Tên hiển thị của bạn')).toHaveValue('Test User')
        expect(screen.getByTestId('gender-select')).toHaveValue('male')
    })

    it('shows validation error when name is empty', async () => {
        const user = userEvent.setup()
        setup()

        await user.clear(screen.getByPlaceholderText('Tên hiển thị của bạn'))
        await user.click(screen.getByRole('button', { name: /cập nhật/i }))

        expect(await screen.findByText('Tên không được để trống')).toBeInTheDocument()
        expect(trigger).not.toHaveBeenCalled()
    })

    it('shows validation error when bio exceeds 160 characters', async () => {
        const user = userEvent.setup()
        setup()

        await user.type(
            screen.getByPlaceholderText('Tiểu sử của bạn (tối đa 160 ký tự)'),
            'a'.repeat(161)
        )
        await user.click(screen.getByRole('button', { name: /cập nhật/i }))

        expect(await screen.findByText(/tiểu sử không được vượt quá 160 ký tự/i)).toBeInTheDocument()
    })

    it('calls trigger with correct payload on submit', async () => {
        const user = userEvent.setup()
        trigger.mockResolvedValue({})
        setup()

        await user.click(screen.getByText('Pick birthday'))
        await user.click(screen.getByRole('button', { name: /cập nhật/i }))

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledWith({
                name: 'Test User',
                gender: 'male',
                bio: undefined,
                birthday: new Date('2000-01-01').toISOString(),
                age: 26,
            })
        })
    })

    it('shows loading state when isMutating is true', () => {
        setup(true)

        expect(screen.getByRole('button', { name: /đợi xíu/i })).toBeDisabled()
    })

    it('shows "Chưa cập nhật" when birthday is undefined', () => {
        setup(false, { birthday: undefined })

        expect(screen.getByDisplayValue('Chưa cập nhật')).toBeInTheDocument()
    })

    it('updates age display when birthday is selected', async () => {
        const user = userEvent.setup()
        setup()

        await user.click(screen.getByText('Pick birthday'))

        expect(screen.getByDisplayValue('26')).toBeInTheDocument()
    })

    it('onSuccess: shows success toast', () => {
        const { onSuccess } = captureMutateOptions()

        onSuccess?.({ message: 'Cập nhật thành công' } as IApiRes<IUserProfile>)

        expect(toast.success).toHaveBeenCalledWith('Cập nhật thành công')
    })

    it('calls UserService.updateProfile with correct payload when api is invoked', async () => {
        const { api } = captureMutateOptions()

        const payload: TUpdateProfilePayload = {
            name: 'Test User',
            gender: 'male',
            birthday: new Date('2000-01-01').toISOString(),
            age: 26,
        }

        await api?.(payload)

        expect(UserService.updateProfile).toHaveBeenCalledWith(payload)
    })
})