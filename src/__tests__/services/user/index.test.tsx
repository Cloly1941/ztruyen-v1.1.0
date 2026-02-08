// ** Libs
import {authFetcherWithRefresh} from '@/lib/auth-fetch'

// ** Configs
import {CONFIG_API} from '@/configs/api'

// ** Services
import {UserService} from '@/services/user'

// =============================== Mocks =============================//
jest.mock('@/lib/auth-fetch', () => ({
    authFetcherWithRefresh: jest.fn(),
}))

// ============================== Tests =============================//
describe('UserService', () => {

    describe('getProfile', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it('calls authFetcherWithRefresh with correct endpoint', async () => {
            (authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await UserService.getProfile()

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                CONFIG_API.USER.PROFILE
            )
        })

        it('returns response from authFetcherWithRefresh', async () => {
            const mockResponse = {
                    data: {
                        id: 1,
                        name: 'John Doe',
                    },
                };

            (authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await UserService.getProfile()

            expect(res).toEqual(mockResponse)
        })

        it('throws error when authFetcherWithRefresh rejects', async () => {
            const error = new Error('Unauthorized');

            (authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(UserService.getProfile()).rejects.toThrow('Unauthorized')
        })
    })
})
