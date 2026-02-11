/* eslint-disable @typescript-eslint/no-explicit-any */

// ** Testing Library
import { render, screen, fireEvent } from '@testing-library/react'

// ** Hooks
import { useProfile } from '@/hooks/auth/useProfile'
import { useUploadAvatar } from '@/hooks/user/useUploadAvatar'

// ** Module component
import FormUploadAvatar from "@/modules/tai-khoan/anh-dai-dien/FormUploadAvatar";

// ---------------- MOCKS ----------------

jest.mock('@/hooks/auth/useProfile')
jest.mock('@/hooks/user/useUploadAvatar')

jest.mock('@/modules/tai-khoan/anh-dai-dien/AvatarAcc', () => ({
    __esModule: true,
    default: () => <div data-testid="avatar">Avatar</div>,
}))

jest.mock('@/components/ui/separator', () => ({
    Separator: () => <div data-testid="separator" />,
}))

const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>
const mockUseUploadAvatar =
    useUploadAvatar as jest.MockedFunction<typeof useUploadAvatar>

describe('FormUploadAvatar', () => {
    const mockTrigger = jest.fn()
    const mockMutate = jest.fn()

    beforeEach(() => {

        mockUseProfile.mockReturnValue({
            data: { name: 'John' },
            isLoading: false,
            mutate: mockMutate,
        } as unknown as any)

        mockUseUploadAvatar.mockReturnValue({
            trigger: mockTrigger,
            isMutating: false,
        } as unknown as any)
    })

    it('render upload button and avatar', () => {
        render(<FormUploadAvatar />)

        expect(screen.getByText('Chọn ảnh đại diện')).toBeInTheDocument()
        expect(screen.getByTestId('avatar')).toBeInTheDocument()
    })

    it('show loading state when isMutating = true', () => {
        mockUseUploadAvatar.mockReturnValue({
            trigger: mockTrigger,
            isMutating: true,
        } as unknown as any)

        render(<FormUploadAvatar />)

        expect(screen.getByText('Đang upload...')).toBeInTheDocument()

        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
    })

    it('trigger upload when file selected', () => {
        const { container } = render(<FormUploadAvatar />)

        const file = new File(['avatar'], 'avatar.png', {
            type: 'image/png',
        })

        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement

        expect(input).toBeInTheDocument()

        fireEvent.change(input, {
            target: { files: [file] },
        })

        expect(mockTrigger).toHaveBeenCalledWith({
            file,
            userName: 'John',
        })
    })

    it('do not trigger when no file selected', () => {
        const { container } = render(<FormUploadAvatar />)

        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement

        fireEvent.change(input, {
            target: { files: [] },
        })

        expect(mockTrigger).not.toHaveBeenCalled()
    })

    it('click button triggers file input click when not mutating', () => {
        render(<FormUploadAvatar />)

        const button = screen.getByRole('button')
        const input = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement

        const clickSpy = jest.spyOn(input, 'click')

        fireEvent.click(button)

        expect(clickSpy).toHaveBeenCalled()
    })

    it('click button does nothing when mutating', () => {
        mockUseUploadAvatar.mockReturnValue({
            trigger: mockTrigger,
            isMutating: true,
        } as unknown as any)

        render(<FormUploadAvatar />)

        const button = screen.getByRole('button')
        const input = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement

        const clickSpy = jest.spyOn(input, 'click')

        fireEvent.click(button)

        expect(clickSpy).not.toHaveBeenCalled()
    })

    it('calls mutate after successful upload', async () => {
        const { } = render(<FormUploadAvatar />)

        const onSuccessCallback = mockUseUploadAvatar.mock.calls[0][0]

        await onSuccessCallback?.()

        expect(mockMutate).toHaveBeenCalled()
    })
})
