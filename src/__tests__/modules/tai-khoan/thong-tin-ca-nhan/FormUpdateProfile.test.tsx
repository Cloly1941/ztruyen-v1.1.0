/* eslint-disable @typescript-eslint/no-explicit-any */

// ** testing-library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Component
import FormUpdateProfile from '@/modules/tai-khoan/thong-tin-ca-nhan/FormUpdateProfile'

// ** Hook
import { useUpdateProfile } from '@/hooks/user/useUpdateProfile'

// ** Utils
import * as dateUtils from '@/utils/date'

// ================= MOCKS =================

jest.mock('@/hooks/user/useUpdateProfile', () => ({
    useUpdateProfile: jest.fn(),
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

jest.mock('@/utils/date', () => ({
    getAgeToBirthday: jest.fn(() => 26),
    getDefaultBirthdayMonth: jest.fn(() => new Date()),
    isBirthdayValid: jest.fn(() => true),
}))

// ================= TEST DATA =================

const mockUser = {
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
}

// ================= TESTS =================

describe('<FormUpdateProfile />', () => {
    const trigger = jest.fn()

    const setup = (isMutating = false, userOverride?: any) => {
        (useUpdateProfile as jest.Mock).mockReturnValue({
            trigger,
            isMutating,
        })

        render(
            <FormUpdateProfile user={{ ...mockUser, ...userOverride }} />
        )
    }

    it('renders all profile fields', () => {
        setup()

        expect(
            screen.getByPlaceholderText('Tên hiển thị của bạn')
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText(
                'Tiểu sử của bạn (tối đa 160 ký tự)'
            )
        ).toBeInTheDocument()

        expect(screen.getByTestId('gender-select')).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: /cập nhật/i })
        ).toBeInTheDocument()
    })

    it('submits correct payload', async () => {
        const user = userEvent.setup()

        trigger.mockResolvedValue({})

        setup()

        await user.click(screen.getByText('Pick birthday'))

        await user.click(
            screen.getByRole('button', { name: /cập nhật/i })
        )

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

    it('shows validation error when name is empty', async () => {
        const user = userEvent.setup()

        setup()

        const nameInput = screen.getByPlaceholderText(
            'Tên hiển thị của bạn'
        )

        await user.clear(nameInput)

        await user.click(
            screen.getByRole('button', { name: /cập nhật/i })
        )

        expect(
            await screen.findByText('Tên không được để trống')
        ).toBeInTheDocument()
    })

    it('shows loading state when isMutating true', () => {
        setup(true)

        const button = screen.getByRole('button', {
            name: /đợi xíu/i,
        })

        expect(button).toBeDisabled()
    })

    it('shows "Chưa cập nhật" when birthday is undefined', () => {
        setup(false, { birthday: undefined })

        expect(
            screen.getByDisplayValue('Chưa cập nhật')
        ).toBeInTheDocument()
    })
})
