// ** Testing Library
import { render, screen, fireEvent } from '@testing-library/react'

// ** Hooks
import useGetMethod from '@/hooks/common/useGetMethod'
import useMutateMethod from '@/hooks/common/useMutateMethod'

// ** Services
import { UserService } from '@/services/api/user'
import { ImageService } from '@/services/api/image'

// ** Module component
import FormUploadAvatar from '@/modules/tai-khoan/anh-dai-dien/FormUploadAvatar'

// ** Types
import { IUserProfile } from '@/types/api'

// ** Toast
import toast from 'react-hot-toast'

// ---------------- TYPES ----------------
type TUploadAvatarArgs = {
    file: File
    userName?: string
}

type TMutateOptions = {
    onSuccess?: () => Promise<void>
    onError?: (error: BackendError) => void
    api?: (arg: TUploadAvatarArgs) => Promise<IApiRes<IUserProfile>>
}

type TUseGetMethodReturn = {
    data: IUserProfile | undefined
    isLoading: boolean
    error: unknown
    mutate: jest.Mock
}

// ---------------- MOCKS ----------------
jest.mock('@/hooks/common/useGetMethod')
jest.mock('@/hooks/common/useMutateMethod')
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))
jest.mock('@/services/api/user', () => ({
    UserService: {
        getProfile: jest.fn(),
        updateProfileImage: jest.fn().mockResolvedValue({ data: {} }),
    },
}))
jest.mock('@/services/api/image', () => ({
    ImageService: {
        upload: jest.fn().mockResolvedValue({ data: { _id: 'image-123' } }),
    },
}))
jest.mock('@/modules/tai-khoan/anh-dai-dien/AvatarAcc', () => ({
    __esModule: true,
    default: () => <div data-testid="avatar">Avatar</div>,
}))
jest.mock('@/components/ui/separator', () => ({
    Separator: () => <div data-testid="separator" />,
}))

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

        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger: mockTrigger,
            isMutating: false,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const captureMutateOptions = () => {
        let captured: TMutateOptions = {}

        ;(useMutateMethod as jest.Mock).mockImplementation((options: TMutateOptions) => {
            captured = options
            return { trigger: mockTrigger, isMutating: false }
        })

        render(<FormUploadAvatar />)

        return captured
    }

    it('renders upload button and avatar', () => {
        render(<FormUploadAvatar />)

        expect(screen.getByText('Chọn ảnh đại diện')).toBeInTheDocument()
        expect(screen.getByTestId('avatar')).toBeInTheDocument()
        expect(screen.getByTestId('separator')).toBeInTheDocument()
    })

    it('shows loading state when isMutating is true', () => {
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger: mockTrigger,
            isMutating: true,
        })

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
        ;(useMutateMethod as jest.Mock).mockReturnValue({
            trigger: mockTrigger,
            isMutating: true,
        })

        render(<FormUploadAvatar />)

        const button = screen.getByRole('button')
        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        const clickSpy = jest.spyOn(input, 'click')

        fireEvent.click(button)

        expect(clickSpy).not.toHaveBeenCalled()
    })

    it('onSuccess: shows toast and calls mutate', async () => {
        const { onSuccess } = captureMutateOptions()

        await onSuccess?.()

        expect(toast.success).toHaveBeenCalledWith('Cập nhật ảnh đại diện thành công')
        expect(mockMutate).toHaveBeenCalled()
    })

    it('api: uploads image and updates profile', async () => {
        const { api } = captureMutateOptions()

        const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })

        await api?.({ file, userName: 'John' })

        expect(ImageService.upload).toHaveBeenCalledWith(
            expect.objectContaining({ file })
        )
        expect(UserService.updateProfileImage).toHaveBeenCalledWith({
            avatar: 'image-123',
        })
    })

    it('api: throws error when imageId is missing', async () => {
        ;(ImageService.upload as jest.Mock).mockResolvedValue({ data: null })

        const { api } = captureMutateOptions()

        const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })

        await expect(api?.({ file })).rejects.toThrow('Upload thất bại')
    })

    it('passes correct key and api to useGetMethod', () => {
        render(<FormUploadAvatar />)

        const options = (useGetMethod as jest.Mock).mock.calls[0][0]

        expect(options.key).toBeDefined()
        expect(typeof options.api).toBe('function')
    })

    it('calls UserService.getProfile when getMethod api is invoked', async () => {
        render(<FormUploadAvatar />)

        const options = (useGetMethod as jest.Mock).mock.calls[0][0]

        await options.api()

        expect(UserService.getProfile).toHaveBeenCalledTimes(1)
    })
})