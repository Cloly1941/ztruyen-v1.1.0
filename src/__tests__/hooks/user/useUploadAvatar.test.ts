// ** Testing
import { renderHook } from '@testing-library/react'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import { useUploadAvatar } from '@/hooks/user/useUploadAvatar'

// ** Services
import { ImageService } from '@/services/image'
import { UserService } from '@/services/user'

// ** Config
import { CONFIG_TAG } from '@/configs/tag'

// ================= MOCKS =================
jest.mock('swr/mutation')
jest.mock('@/services/image', () => ({
    ImageService: {
        upload: jest.fn(),
    },
}))
jest.mock('@/services/user', () => ({
    UserService: {
        updateProfileImage: jest.fn(),
    },
}))
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

describe('useUploadAvatar', () => {
    const file = new File(['avatar'], 'avatar.png', {
        type: 'image/png',
    })

    it('calls uploadAvatar correctly', async () => {
        let fetcher: (
                key: string,
                options: { arg: { file: File; userName?: string } }
            ) => Promise<void>;

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fn) => {
                fetcher = fn
                return { trigger: jest.fn() }
            }
        );

        (ImageService.upload as jest.Mock).mockResolvedValue({
            data: { _id: 'image123' },
        });

        (UserService.updateProfileImage as jest.Mock).mockResolvedValue({})

        renderHook(() => useUploadAvatar())

        await fetcher!(CONFIG_TAG.IMAGE.UPLOAD, {
            arg: { file, userName: 'john' },
        })

        expect(ImageService.upload).toHaveBeenCalledTimes(1)
        expect(UserService.updateProfileImage).toHaveBeenCalledWith({
            avatar: 'image123',
        })
    })

    it('throws error if upload has no imageId', async () => {
        let fetcher: (
                key: string,
                options: { arg: { file: File } }
            ) => Promise<void>;

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fn) => {
                fetcher = fn
                return { trigger: jest.fn() }
            }
        )

        ;(ImageService.upload as jest.Mock).mockResolvedValue({
            data: {},
        })

        renderHook(() => useUploadAvatar())

        await expect(
            fetcher!(CONFIG_TAG.IMAGE.UPLOAD, {
                arg: { file },
            })
        ).rejects.toThrow('Upload thất bại')
    })

    it('shows success toast and calls callback', () => {
        let config: {
            onSuccess?: () => void
        }

        const onSuccessMock = jest.fn();

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fn, options) => {
                config = options
                return { trigger: jest.fn() }
            }
        )

        renderHook(() => useUploadAvatar(onSuccessMock))

        config!.onSuccess?.()

        expect(toast.success).toHaveBeenCalledWith(
            'Cập nhật ảnh đại diện thành công'
        )
        expect(onSuccessMock).toHaveBeenCalled()
    })

    it('shows error toast with error message', () => {
        let config: {
                onError?: (error: unknown) => void
            };

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fn, options) => {
                config = options
                return { trigger: jest.fn() }
            }
        )

        renderHook(() => useUploadAvatar())

        config!.onError?.(new Error('Fail'))

        expect(toast.error).toHaveBeenCalledWith('Fail')
    })

    it('shows default error toast when error is not Error', () => {
        let config: {
                onError?: (error: unknown) => void
            };

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fn, options) => {
                config = options
                return { trigger: jest.fn() }
            }
        )

        renderHook(() => useUploadAvatar())

        config!.onError?.(null)

        expect(toast.error).toHaveBeenCalledWith(
            'Đã có lỗi xảy ra khi câp nhật ảnh đại diện'
        )
    })
})
