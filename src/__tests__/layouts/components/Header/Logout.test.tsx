// ** Testing Library
import { render, screen, fireEvent } from '@testing-library/react'

// ** Hooks
import useMutateMethod from '@/hooks/common/useMutateMethod'

// ** Next
import { useRouter } from 'next/navigation'

// ** Toast
import toast from 'react-hot-toast'

// ** SWR
import { mutate } from 'swr'

// ** Component
import Logout from '@/layouts/components/Header/Logout'

// ** Config
import { CONFIG_TAG } from '@/configs/tag'

// ** Services
import { AuthService } from '@/services/api/auth'

// ================== MOCKS ==================
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
jest.mock('@/components/common/Loading', () => () => (
    <div data-testid="loading" />
))

jest.mock('@/services/api/auth', () => ({
    AuthService: {
        logout: jest.fn().mockResolvedValue({ message: 'Đăng xuất thành công' }),
    },
}))

// ================== TESTS ==================
describe('Logout', () => {
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

    // helper: capture onSuccess từ useMutateMethod
    const captureOnSuccess = () => {
        let onSuccess: ((data: any) => void) | undefined

        ;(useMutateMethod as jest.Mock).mockImplementation((options) => {
            onSuccess = options.onSuccess
            return { trigger, isMutating: false }
        })

        render(<Logout />)

        return onSuccess!
    }

    it('renders logout button', () => {
        render(<Logout />)

        expect(screen.getByText(/đăng xuất/i)).toBeInTheDocument()
    })

    it('calls trigger when clicking logout', () => {
        render(<Logout />)

        fireEvent.click(screen.getByText(/đăng xuất/i))

        expect(trigger).toHaveBeenCalledTimes(1)
    })

    it('shows loading when isMutating is true', () => {
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger: jest.fn(),
            isMutating: true,
        })

        render(<Logout />)

        expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('does not call trigger if not clicked', () => {
        render(<Logout />)

        expect(trigger).not.toHaveBeenCalled()
    })

    it('onSuccess: shows success toast', () => {
        const onSuccess = captureOnSuccess()

        onSuccess({ message: 'Đăng xuất thành công' })

        expect(toast.success).toHaveBeenCalledWith('Đăng xuất thành công')
    })

    it('onSuccess: clears profile cache', () => {
        const onSuccess = captureOnSuccess()

        onSuccess({ message: 'Đăng xuất thành công' })

        expect(mutate).toHaveBeenCalledWith(CONFIG_TAG.USER.PROFILE, null, false)
    })

    it('onSuccess: calls router.refresh', () => {
        const onSuccess = captureOnSuccess()

        onSuccess({ message: 'Đăng xuất thành công' })

        expect(refresh).toHaveBeenCalledTimes(1)
    })

    it('calls AuthService.logout when trigger is invoked', () => {
        let capturedApi: (() => Promise<any>) | undefined

        ;(useMutateMethod as jest.Mock).mockImplementation((options) => {
            capturedApi = options.api
            return { trigger, isMutating: false }
        })

        render(<Logout />)

        capturedApi?.()

        expect(AuthService.logout).toHaveBeenCalledTimes(1)
    })
})