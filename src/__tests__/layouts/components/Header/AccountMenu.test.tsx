// ** Testing Library
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Layout components
import AccountMenu from '@/layouts/components/Header/AccountMenu'

// ** Services
import { UserService } from '@/services/user'

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('@/layouts/components/Header/Logout', () => ({
    __esModule: true,
    default: () => <div>Logout</div>,
}))

jest.mock('@/services/user', () => ({
    UserService: {
        getProfile: jest.fn(),
    },
}))

jest.mock('@/skeletons/layouts/AvatarSkeletons', () => ({
    __esModule: true,
    default: () => <div data-testid="avatar-skeleton" />,
}))

const mockUser = {
    id: 1,
    name: 'John Doe',
    avatar: {
        url: 'https://avatar.test/john.png',
    },
}

describe('AccountMenu', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('shows skeleton while loading', () => {
        (UserService.getProfile as jest.Mock).mockResolvedValueOnce({
            data: mockUser,
        })

        render(<AccountMenu />)

        expect(screen.getByTestId('avatar-skeleton')).toBeInTheDocument()
    })

    it('renders avatar and dropdown when profile is loaded', async () => {
        (UserService.getProfile as jest.Mock).mockResolvedValueOnce({
            data: mockUser,
        })

        render(<AccountMenu />)

        const avatarFallback = await screen.findByText('J')
        expect(avatarFallback).toBeInTheDocument()

        await userEvent.click(avatarFallback)

        expect(await screen.findByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Thông tin')).toBeInTheDocument()
        expect(screen.getByText('Yêu thích')).toBeInTheDocument()
        expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('renders nothing when profile fetch fails', async () => {
        (UserService.getProfile as jest.Mock).mockRejectedValueOnce(
            new Error('Unauthorized')
        )

        const { container } = render(<AccountMenu />)

        await waitFor(() => {
            expect(container.firstChild).toBeNull()
        })
    })

    it('renders nothing when profile is null', async () => {
        (UserService.getProfile as jest.Mock).mockResolvedValueOnce({
            data: null,
        })

        const { container } = render(<AccountMenu />)

        await waitFor(() => {
            expect(container.firstChild).toBeNull()
        })
    })
})
