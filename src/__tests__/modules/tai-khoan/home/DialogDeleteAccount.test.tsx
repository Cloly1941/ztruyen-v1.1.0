// ** Testing Library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Module
import DialogDeleteAccount from "@/modules/tai-khoan/home/DialogDeleteAccount";

// ** Next
import { useRouter } from 'next/navigation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import useMutateMethod from '@/hooks/common/useMutateMethod'

// ** SWR
import { mutate } from 'swr'

// ** Services
import { UserService } from '@/services/api/user'

// ================= TYPES =================
type TMutateOptions = {
    onSuccess?: (data: IApiRes<void>) => void
    onError?: (error: BackendError) => void
    api?: () => Promise<IApiRes<void>>
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
jest.mock('swr', () => ({
    mutate: jest.fn(),
}))
jest.mock('@/services/api/user', () => ({
    UserService: {
        deleteProfile: jest.fn().mockResolvedValue({ message: 'Xoá tài khoản thành công' }),
    },
}))

// ================== TESTS =================
describe('DialogDeleteAccount', () => {
    const trigger = jest.fn()
    const refresh = jest.fn()

    beforeEach(() => {
        ;(useRouter as jest.Mock).mockReturnValue({ refresh })
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByRole('button', { name: '' }))
    }

    const captureMutateOptions = () => {
        let captured: TMutateOptions = {}

        ;(useMutateMethod as jest.Mock).mockImplementation((options: TMutateOptions) => {
            captured = options
            return { trigger, isMutating: false }
        })

        render(<DialogDeleteAccount userName="Nguyen Van A" />)

        return captured
    }

    it('renders trigger button', () => {
        render(<DialogDeleteAccount userName="Nguyen Van A" />)

        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('opens dialog when trigger button is clicked', async () => {
        const user = userEvent.setup()
        render(<DialogDeleteAccount userName="Nguyen Van A" />)

        await openDialog(user)

        expect(screen.getByText('Xoá tài khoản cá nhân')).toBeInTheDocument()
        expect(screen.getByText(/hành động này không thể hoàn tác/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /xoá tài khoản/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /huỷ/i })).toBeInTheDocument()
    })

    it('shows userName in confirmation message', async () => {
        const user = userEvent.setup()
        render(<DialogDeleteAccount userName="Nguyen Van A" />)

        await openDialog(user)

        expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    })

    it('shows validation error when confirm field is empty', async () => {
        const user = userEvent.setup()
        render(<DialogDeleteAccount userName="Nguyen Van A" />)

        await openDialog(user)
        await user.click(screen.getByRole('button', { name: /xoá tài khoản/i }))

        expect(await screen.findByText(/vui lòng nhập tên xác nhận/i)).toBeInTheDocument()
        expect(trigger).not.toHaveBeenCalled()
    })

    it('shows validation error when confirm name does not match', async () => {
        const user = userEvent.setup()
        render(<DialogDeleteAccount userName="Nguyen Van A" />)

        await openDialog(user)
        await user.type(screen.getByLabelText(/xác nhận tên/i), 'wrong name')
        await user.click(screen.getByRole('button', { name: /xoá tài khoản/i }))

        expect(await screen.findByText(/tên xác nhận không đúng/i)).toBeInTheDocument()
        expect(trigger).not.toHaveBeenCalled()
    })

    it('calls trigger when confirm name matches', async () => {
        const user = userEvent.setup()
        render(<DialogDeleteAccount userName="Nguyen Van A" />)

        await openDialog(user)
        await user.type(screen.getByLabelText(/xác nhận tên/i), 'Nguyen Van A')
        await user.click(screen.getByRole('button', { name: /xoá tài khoản/i }))

        await waitFor(() => {
            expect(trigger).toHaveBeenCalledTimes(1)
        })
    })

    it('shows loading state while submitting', async () => {
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger,
            isMutating: true,
        })

        const user = userEvent.setup()
        render(<DialogDeleteAccount userName="Nguyen Van A" />)

        await openDialog(user)

        expect(screen.getByRole('button', { name: /đợi xíu nhe/i })).toBeDisabled()
    })

    it('onSuccess: shows toast, clears profile cache and calls router.refresh', () => {
        const { onSuccess } = captureMutateOptions()

        onSuccess?.({ message: 'Xoá tài khoản thành công' } as IApiRes<void>)

        expect(toast.success).toHaveBeenCalledWith('Xoá tài khoản thành công')
        expect(mutate).toHaveBeenCalledWith(
            expect.any(String),
            null,
            false
        )
        expect(refresh).toHaveBeenCalledTimes(1)
    })

    it('calls UserService.deleteProfile when api is invoked', async () => {
        const { api } = captureMutateOptions()

        await api?.()

        expect(UserService.deleteProfile).toHaveBeenCalledTimes(1)
    })
})