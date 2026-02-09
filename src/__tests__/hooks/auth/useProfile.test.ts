// ** Testing Library
import {renderHook} from '@testing-library/react'

// ** SWR
import useSWR from 'swr'

// ** Hook
import {useProfile} from '@/hooks/auth/useProfile'

// ** Services
import {UserService} from '@/services/user'

// ** Configs
import {CONFIG_TAG} from '@/configs/tag'

// ** Types
import {IUserProfile} from '@/types/api'

// ================= MOCKS =================
jest.mock('swr', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('@/services/user', () => ({
    UserService: {
        getProfile: jest.fn(),
    },
}))

// ================= TESTS =================
describe('useProfile hook', () => {
    beforeEach(() => {
        (useSWR as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('calls useSWR with correct key, fetcher and options', () => {
        renderHook(() => useProfile())

        expect(useSWR).toHaveBeenCalledWith(
            CONFIG_TAG.USER.PROFILE,
            expect.any(Function),
            {
                revalidateOnFocus: false,
                shouldRetryOnError: false,
            }
        )
    })

    it('fetcher returns profile data when API returns data', async () => {
        const mockProfile: IUserProfile = {
            _id: '1',
            email: 'test@gmail.com',
            name: 'Test User',
            birthday: '1990-01-01',
            age: 34,
            gender: 'lgbt',
            role: 'user',
            provider: 'local',
            createdAt: '2020-01-01T00:00:00.000Z',
            updatedAt: '2020-01-01T00:00:00.000Z',
        };

        (UserService.getProfile as jest.Mock).mockResolvedValue({
            data: mockProfile,
        })

        renderHook(() => useProfile())

        const [, fetcher] = (useSWR as jest.Mock).mock.calls[0]

        const result = await fetcher()

        expect(UserService.getProfile).toHaveBeenCalled()
        expect(result).toEqual(mockProfile)
    })

    it('fetcher returns null when API returns null data', async () => {
        (UserService.getProfile as jest.Mock).mockResolvedValue({
            data: null,
        })

        renderHook(() => useProfile())

        const [, fetcher] = (useSWR as jest.Mock).mock.calls[0]

        const result = await fetcher()

        expect(result).toBeNull()
    })
})
