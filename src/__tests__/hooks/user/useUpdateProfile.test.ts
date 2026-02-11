/* eslint-disable @typescript-eslint/no-explicit-any */

// ** Testing library
import { renderHook } from '@testing-library/react'

// ** SWR
import useSWRMutation from 'swr/mutation'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import { useUpdateProfile } from '@/hooks/user/useUpdateProfile'

// ** Service
import { UserService } from '@/services/user'

// ** Config
import { CONFIG_TAG } from '@/configs/tag'

// ================= MOCKS =================
jest.mock('swr/mutation')
jest.mock('@/services/user', () => ({
    UserService: {
        updateProfile: jest.fn(),
    },
}))
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

describe('useUpdateProfile', () => {
    const payload = {
        name: 'John Doe',
        birthday: '2000-01-01',
        age: 25,
    }

    const mockTrigger = jest.fn()

    beforeEach(() => {
        (useSWRMutation as jest.Mock).mockReturnValue({
            trigger: mockTrigger,
        })
    })

    it('calls useSWRMutation with correct key', () => {
        renderHook(() => useUpdateProfile())

        expect(useSWRMutation).toHaveBeenCalledWith(
            CONFIG_TAG.USER.PROFILE,
            expect.any(Function),
            expect.any(Object)
        )
    })

    it('calls UserService.updateProfile when trigger runs', async () => {
        let fetcherFn: any;

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fetcher) => {
                fetcherFn = fetcher
                return { trigger: jest.fn() }
            }
        )

        renderHook(() => useUpdateProfile())

        await fetcherFn(null, { arg: payload })

        expect(UserService.updateProfile).toHaveBeenCalledWith(payload)
    })

    it('shows success toast onSuccess', async () => {
        const mockResponse = { message: 'Cập nhật thành công' }

        let options: any;

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fetcher, config) => {
                options = config
                return { trigger: jest.fn() }
            }
        )

        renderHook(() => useUpdateProfile())

        await options.onSuccess(mockResponse)

        expect(toast.success).toHaveBeenCalledWith(mockResponse.message)
    })

    it('shows error toast with error message', async () => {
        let options: any;

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fetcher, config) => {
                options = config
                return { trigger: jest.fn() }
            }
        )

        renderHook(() => useUpdateProfile())

        const error = new Error('Update failed')

        options.onError(error)

        expect(toast.error).toHaveBeenCalledWith('Update failed')
    })

    it('shows default error toast when error is not Error instance', async () => {
        let options: any;

        (useSWRMutation as jest.Mock).mockImplementation(
            (key, fetcher, config) => {
                options = config
                return { trigger: jest.fn() }
            }
        )

        renderHook(() => useUpdateProfile())

        options.onError(null)

        expect(toast.error).toHaveBeenCalledWith(
            'Đã có lỗi xảy ra khi câp nhật thông tin cá nhân'
        )
    })
})
