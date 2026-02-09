// ** Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// ** Hooks
import { useLogout } from '@/hooks/auth/useLogout'

// ** Services
import { UserService } from '@/services/user'

// ** Layout Component
import Logout from "@/layouts/components/Header/Logout";

// ================== MOCKS ==================
jest.mock('@/hooks/auth/useLogout')
jest.mock('@/services/user', () => ({
    UserService: {
        getProfile: jest.fn(),
    },
}))

jest.mock('@/components/common/Loading', () => () => (
    <div data-testid="loading" />
))

// ================== TEST ==================
describe('Logout', () => {
    const trigger = jest.fn()

    beforeEach(() => {
        (useLogout as jest.Mock).mockReturnValue({
            trigger,
            isMutating: false,
        });

        (UserService.getProfile as jest.Mock).mockResolvedValue({})
    })

    it('renders logout button', () => {
        render(<Logout />)

        expect(
            screen.getByText(/đăng xuất/i)
        ).toBeInTheDocument()
    })

    it('calls getProfile and trigger when clicking logout', async () => {
        render(<Logout />)

        fireEvent.click(screen.getByText(/đăng xuất/i))

        await waitFor(() => {
            expect(UserService.getProfile).toHaveBeenCalledTimes(1)
            expect(trigger).toHaveBeenCalledTimes(1)
        })
    })

    it('shows loading when isMutating is true', () => {
        (useLogout as jest.Mock).mockReturnValue({
            trigger: jest.fn(),
            isMutating: true,
        })

        render(<Logout />)

        expect(
            screen.getByTestId('loading')
        ).toBeInTheDocument()
    })

    it('does not call logout if not clicked', () => {
        render(<Logout />)

        expect(UserService.getProfile).not.toHaveBeenCalled()
        expect(trigger).not.toHaveBeenCalled()
    })
})
