// ** Testing Library
import { render, screen, fireEvent } from '@testing-library/react'

// ** Hooks
import useGetMethod from '@/hooks/common/useGetMethod'
import { useUploadAvatar } from '@/hooks/user/useUploadAvatar'

// ** Services
import { UserService } from '@/services/api/user'

// ** Module component
import FormUploadAvatar from '@/modules/tai-khoan/anh-dai-dien/FormUploadAvatar'

// ** Types
import { IUserProfile } from '@/types/api'

// ---------------- MOCKS ----------------
jest.mock('@/hooks/common/useGetMethod')
jest.mock('@/hooks/user/useUploadAvatar')
jest.mock('@/services/api/user', () => ({
    UserService: {
        getProfile: jest.fn(),
    },
}))
jest.mock('@/modules/tai-khoan/anh-dai-dien/AvatarAcc', () => ({
    __esModule: true,
    default: () => <div data-testid="avatar">Avatar</div>,
}))
jest.mock('@/components/ui/separator', () => ({
    Separator: () => <div data-testid="separator" />,
}))

// ---------------- TYPES ----------------
type TUseGetMethodReturn = {
    data: IUserProfile | undefined
    isLoading: boolean
    error: unknown
    mutate: jest.Mock
}

type TUseUploadAvatarReturn = {
    trigger: jest.Mock
    isMutating: boolean
}

// ---------------- TESTS ----------------
describe('FormUploadAvatar', () => {
    const mockTrigger = jest.fn()
    const mockMutate = jest.fn()

    const mockUser: IUserProfile = { name: 'John' } as IUserProfile

    beforeEach(() => {
        ;(useGetMethod as jest.Mock).mockReturnValue({
            data: mockUser,
            isLoading: false,
            error: undefined,
            mutate: mockMutate,
        } as TUseGetMethodReturn)

        ;(useUploadAvatar as jest.Mock).mockReturnValue({
            trigger: mockTrigger,
            isMutating: false,
        } as TUseUploadAvatarReturn)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders upload button and avatar', () => {
        render(<FormUploadAvatar />)

        expect(screen.getByText('Chọn ảnh đại diện')).toBeInTheDocument()
        expect(screen.getByTestId('avatar')).toBeInTheDocument()
        expect(screen.getByTestId('separator')).toBeInTheDocument()
    })

    it('shows loading state when isMutating is true', () => {
        ;(useUploadAvatar as jest.Mock).mockReturnValue({
            trigger: mockTrigger,
            isMutating: true,
        } as TUseUploadAvatarReturn)

        render(<FormUploadAvatar />)

        expect(screen.getByText('Đang upload...')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('triggers upload with file and userName when file is selected', () => {
        const { container } = render(<FormUploadAvatar />)

        const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })
        const input = container.querySelector('input[type="file"]') as HTMLInputElement

        fireEvent.change(input, { target: { files: [file] } })

        expect(mockTrigger).toHaveBeenCalledWith({
            file,
            userName: mockUser.name,
        })
    })

    it('does not trigger when no file is selected', () => {
        const { container } = render(<FormUploadAvatar />)

        const input = container.querySelector('input[type="file"]') as HTMLInputElement

        fireEvent.change(input, { target: { files: [] } })

        expect(mockTrigger).not.toHaveBeenCalled()
    })

    it('clicks file input when button is clicked and not mutating', () => {
        render(<FormUploadAvatar />)

        const button = screen.getByRole('button')
        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        const clickSpy = jest.spyOn(input, 'click')

        fireEvent.click(button)

        expect(clickSpy).toHaveBeenCalled()
    })

    it('does not click file input when button is clicked while mutating', () => {
        ;(useUploadAvatar as jest.Mock).mockReturnValue({
            trigger: mockTrigger,
            isMutating: true,
        } as TUseUploadAvatarReturn)

        render(<FormUploadAvatar />)

        const button = screen.getByRole('button')
        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        const clickSpy = jest.spyOn(input, 'click')

        fireEvent.click(button)

        expect(clickSpy).not.toHaveBeenCalled()
    })

    it('calls mutate after successful upload', async () => {
        render(<FormUploadAvatar />)

        const onSuccessCallback = (useUploadAvatar as jest.Mock).mock.calls[0][0]

        await onSuccessCallback?.()

        expect(mockMutate).toHaveBeenCalled()
    })

    it('passes correct key and api to useGetMethod', () => {
        render(<FormUploadAvatar />)

        const options = (useGetMethod as jest.Mock).mock.calls[0][0]

        expect(options.key).toBeDefined()
        expect(typeof options.api).toBe('function')
    })

    it('calls UserService.getProfile when api is invoked', async () => {
        render(<FormUploadAvatar />)

        const options = (useGetMethod as jest.Mock).mock.calls[0][0]

        await options.api()

        expect(UserService.getProfile).toHaveBeenCalledTimes(1)
    })
})