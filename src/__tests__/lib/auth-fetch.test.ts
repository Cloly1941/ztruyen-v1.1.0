// ** Libs
import { authFetcher, authFetcherWithRefresh } from '@/lib/auth-fetch'
import { fetcher } from '@/lib/fetcher'
import { ApiError } from '@/lib/api-error'
import { getAccessToken, removeAccessToken } from '@/lib/localStorage'

// ** Services
import { AuthService } from '@/services/auth'

jest.mock('@/lib/fetcher')
jest.mock('@/lib/localStorage')
jest.mock('@/services/auth')

describe('authFetcher', () => {

    it('Attach Authorization header when accessToken exists', async () => {
        (getAccessToken as jest.Mock).mockReturnValue('token-123');
        (fetcher as jest.Mock).mockResolvedValue({ data: 'ok' })

        await authFetcher('/api/me')

        expect(fetcher).toHaveBeenCalledWith(
            '/api/me',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer token-123',
                }),
            })
        )
    })

    it('Do not attach Authorization header when accessToken is null', async () => {
        (getAccessToken as jest.Mock).mockReturnValue(null);
        (fetcher as jest.Mock).mockResolvedValue({ data: 'ok' })

        await authFetcher('/api/me')

        expect(fetcher).toHaveBeenCalledWith(
            '/api/me',
            expect.not.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.any(String),
                }),
            })
        )
    })
})

describe('authFetcherWithRefresh', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Return response directly when request succeeds', async () => {
        (fetcher as jest.Mock).mockResolvedValue({ data: 'ok' })

        const res = await authFetcherWithRefresh('/api/me')

        expect(res).toEqual({ data: 'ok' })
        expect(AuthService.refreshToken).not.toHaveBeenCalled()
    })

    it('Throw error when error is not ApiError', async () => {
        (fetcher as jest.Mock).mockRejectedValue(new Error('Boom'))

        await expect(authFetcherWithRefresh('/api/me')).rejects.toThrow('Boom')
    })

    it('Throw error when ApiError status is not 401', async () => {
        (fetcher as jest.Mock).mockRejectedValue(
            new ApiError('Forbidden', 403)
        )

        await expect(authFetcherWithRefresh('/api/me')).rejects.toThrow('Forbidden')
        expect(AuthService.refreshToken).not.toHaveBeenCalled()
    })

    it('Refresh token and retry request when 401', async () => {
        (fetcher as jest.Mock)
            .mockRejectedValueOnce(new ApiError('Unauthorized', 401))
            .mockResolvedValueOnce({ data: 'success' });

        (AuthService.refreshToken as jest.Mock).mockResolvedValue({})

        const res = await authFetcherWithRefresh('/api/me')

        expect(AuthService.refreshToken).toHaveBeenCalledTimes(1)
        expect(fetcher).toHaveBeenCalledTimes(2)
        expect(res).toEqual({ data: 'success' })
    })

    it('Remove accessToken when refreshToken fails', async () => {
        (fetcher as jest.Mock).mockRejectedValue(
            new ApiError('Unauthorized', 401)
        );

        (AuthService.refreshToken as jest.Mock).mockRejectedValue(
            new Error('Refresh failed')
        )

        await expect(authFetcherWithRefresh('/api/me')).rejects.toThrow(
            'Refresh failed'
        )

        expect(removeAccessToken).toHaveBeenCalled()
    })

    it('Only refresh token once for multiple parallel 401 requests', async () => {
        (fetcher as jest.Mock)
            .mockRejectedValueOnce(new ApiError('Unauthorized', 401))
            .mockRejectedValueOnce(new ApiError('Unauthorized', 401))
            .mockResolvedValue({ data: 'ok' });

        (AuthService.refreshToken as jest.Mock).mockResolvedValue({})

        await Promise.all([
            authFetcherWithRefresh('/api/1'),
            authFetcherWithRefresh('/api/2'),
        ])

        expect(AuthService.refreshToken).toHaveBeenCalledTimes(1)
    })

})
