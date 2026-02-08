// ** Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// ** Next
import { useRouter } from 'next/navigation'

// ** Toast
import toast from 'react-hot-toast'

// ** Component
import Logout from '@/layouts/components/Header/Logout'

// ** Services
import { AuthService } from '@/services/auth'

// ======================= Mocks ======================= //
jest.mock('@/services/auth', () => ({
    AuthService: {
        logout: jest.fn(),
    },
}))

jest.mock('@/utils/sleep', () => ({
    sleep: jest.fn(() => Promise.resolve()),
}))

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock('@/components/common/Loading', () => {
    const MockLoading = () => <div data-testid="loading">Loading...</div>
    MockLoading.displayName = 'MockLoading'
    return MockLoading
})

// ======================= Tests ======================= //
describe('Logout component', () => {
    const refreshMock = jest.fn()

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            refresh: refreshMock,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('shows loading and calls logout when clicked', async () => {
        (AuthService.logout as jest.Mock).mockResolvedValue({
            message: 'Logout success',
        })

        render(<Logout />)

        fireEvent.click(screen.getByText('Đăng xuất'))

        expect(screen.getByTestId('loading')).toBeInTheDocument()

        await waitFor(() => {
            expect(AuthService.logout).toHaveBeenCalledTimes(1)
        })
    })

    it('shows success toast and refreshes router on success', async () => {
        (AuthService.logout as jest.Mock).mockResolvedValue({
            message: 'Logout success',
        })

        render(<Logout />)

        fireEvent.click(screen.getByText('Đăng xuất'))

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Logout success')
            expect(refreshMock).toHaveBeenCalledTimes(1)
        })

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
        })
    })

    it('shows error toast when logout fails with Error', async () => {
        (AuthService.logout as jest.Mock).mockRejectedValue(
            new Error('Unauthorized')
        )

        render(<Logout />)

        fireEvent.click(screen.getByText('Đăng xuất'))

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Unauthorized')
        })

        expect(refreshMock).not.toHaveBeenCalled()
    })

    it('shows generic error when logout fails with non-Error', async () => {
        (AuthService.logout as jest.Mock).mockRejectedValue('some error')

        render(<Logout />)

        fireEvent.click(screen.getByText('Đăng xuất'))

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Đã có lỗi xảy ra khi đăng xuất, vui lòng thử lại sau!'
            )
        })
    })
})
