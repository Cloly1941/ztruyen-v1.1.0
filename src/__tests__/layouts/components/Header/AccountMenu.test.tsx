// ** Testing Library
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ** Layout Component
import AccountMenu from '@/layouts/components/Header/AccountMenu'

// ** Hooks
import useGetMethod from '@/hooks/common/useGetMethod'

// ** Services
import { UserService } from '@/services/api/user'

// ** Types
import { IUserProfile } from '@/types/api'

// ================== MOCKS ==================
jest.mock('@/hooks/common/useGetMethod')
jest.mock('@/services/api/user', () => ({
    UserService: {
        getProfile: jest.fn(),
    },
}))
jest.mock('@/layouts/components/Header/Logout', () => ({
    __esModule: true,
    default: () => <div data-testid="logout">Logout</div>,
}))
jest.mock('@/skeletons/layouts/AvatarSkeletons', () => ({
    __esModule: true,
    default: () => <div data-testid="avatar-skeleton" />,
}))
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => children,
}))

// ================== TYPES ==================
type TUseGetMethodReturn = {
    data: IUserProfile | undefined
    isLoading: boolean
    error: unknown
    mutate: jest.Mock
}

// ================== TESTS ==================
describe('AccountMenu', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    const mockGetMethod = (data: IUserProfile | undefined, isLoading: boolean) => {
        ;(useGetMethod as jest.Mock).mockReturnValue({
            data,
            isLoading,
            error: undefined,
            mutate: jest.fn(),
        } as TUseGetMethodReturn)
    }

    it('renders skeleton when loading', () => {
        mockGetMethod(undefined, true)

        render(<AccountMenu />)

        expect(screen.getByTestId('avatar-skeleton')).toBeInTheDocument()
    })

    it('renders nothing when user is null', () => {
        mockGetMethod(undefined, false)

        const { container } = render(<AccountMenu />)

        expect(container.firstChild).toBeNull()
    })

    it('renders avatar fallback with first letter of name', () => {
        mockGetMethod({ name: 'Nguyen Van A', avatar: { url: 'https://example.com/avatar.png' } } as IUserProfile, false)

        render(<AccountMenu />)

        expect(screen.getByText('N')).toBeInTheDocument()
    })

    it('renders dropdown menu items after clicking avatar', async () => {
        const user = userEvent.setup()

        mockGetMethod({ name: 'Nguyen Van A', avatar: { url: 'https://example.com/avatar.png' } } as IUserProfile, false)

        render(<AccountMenu />)

        await user.click(screen.getByText('N'))

        expect(await screen.findByText('Nguyen Van A')).toBeInTheDocument()
        expect(screen.getByText(/tài khoản/i)).toBeInTheDocument()
        expect(screen.getByText(/yêu thích/i)).toBeInTheDocument()
        expect(screen.getByTestId('logout')).toBeInTheDocument()
    })

    it('passes correct key and api to useGetMethod', () => {
        mockGetMethod(undefined, false)

        render(<AccountMenu />)

        const options = (useGetMethod as jest.Mock).mock.calls[0][0]

        expect(options.key).toBeDefined()
        expect(typeof options.api).toBe('function')
    })

    it('calls UserService.getProfile when api is invoked', async () => {
        mockGetMethod(undefined, false)

        render(<AccountMenu />)

        const options = (useGetMethod as jest.Mock).mock.calls[0][0]

        await options.api()

        expect(UserService.getProfile).toHaveBeenCalledTimes(1)
    })
})