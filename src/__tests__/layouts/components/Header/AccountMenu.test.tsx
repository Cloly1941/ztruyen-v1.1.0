// ** Testing Library
import { render, screen } from '@testing-library/react'

// ** Layout Component
import AccountMenu from '@/layouts/components/Header/AccountMenu'

// ** Hooks
import { useProfile } from '@/hooks/auth/useProfile'
import userEvent from "@testing-library/user-event";

// ================== MOCKS ==================
jest.mock('@/hooks/auth/useProfile')

// eslint-disable-next-line react/display-name
jest.mock('@/layouts/components/Header/Logout', () => () => (
    <div data-testid="logout">Logout</div>
))

// eslint-disable-next-line react/display-name
jest.mock('@/skeletons/layouts/AvatarSkeletons', () => () => (
    <div data-testid="avatar-skeleton" />
))

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => children,
}))

// ================== TEST ==================
describe('AccountMenu', () => {

    it('renders skeleton when loading profile', () => {
        (useProfile as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
        })

        render(<AccountMenu />)

        expect(
            screen.getByTestId('avatar-skeleton')
        ).toBeInTheDocument()
    })

    it('renders nothing when user is null', () => {
        (useProfile as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
        })

        const { container } = render(<AccountMenu />)

        expect(container.firstChild).toBeNull()
    })

    it('renders account menu when user exists', async () => {
        const user = userEvent.setup();

        (useProfile as jest.Mock).mockReturnValue({
            isLoading: false,
            data: {
                name: 'Nguyen Van A',
                avatar: {
                    url: 'https://example.com/avatar.png',
                },
            },
        })

        render(<AccountMenu />)

        expect(screen.getByText('N')).toBeInTheDocument()

        await user.click(screen.getByText('N'))

        expect(
            await screen.findByText('Nguyen Van A')
        ).toBeInTheDocument()

        expect(
            screen.getByText(/thông tin cá nhân/i)
        ).toBeInTheDocument()

        expect(
            screen.getByText(/truyện yêu thích/i)
        ).toBeInTheDocument()

        expect(
            screen.getByTestId('logout')
        ).toBeInTheDocument()
    })
})
