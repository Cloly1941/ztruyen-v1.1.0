// ** Testing Library
import { render, screen, fireEvent } from '@testing-library/react'

// ** Hook
import { useLogout } from '@/hooks/auth/useLogout'

// ** Component
import Logout from '@/layouts/components/Header/Logout'

// ================== MOCKS ==================
jest.mock('@/hooks/auth/useLogout')

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
        })
    })

    it('renders logout button', () => {
        render(<Logout />)

        expect(
            screen.getByText(/đăng xuất/i)
        ).toBeInTheDocument()
    })

    it('calls trigger when clicking logout', () => {
        render(<Logout />)

        fireEvent.click(screen.getByText(/đăng xuất/i))

        expect(trigger).toHaveBeenCalledTimes(1)
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

    it('does not call trigger if not clicked', () => {
        render(<Logout />)

        expect(trigger).not.toHaveBeenCalled()
    })
})
