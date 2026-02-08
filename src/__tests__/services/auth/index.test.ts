// ** Services
import { AuthService } from '@/services/auth'

// ** Libs
import { fetcher } from '@/lib/fetcher'
import { authFetcher } from '@/lib/auth-fetch'
import { removeAccessToken } from '@/lib/localStorage'
import { setAccessToken } from '@/lib/localStorage'

// ** Configs
import { CONFIG_API } from '@/configs/api'
import { VARIABLE } from '@/configs/variable'

// =============================== Mocks =============================//
jest.mock('@/lib/fetcher')

jest.mock('@/lib/auth-fetch', () => ({
    authFetcher: jest.fn(),
}))

jest.mock('@/lib/localStorage', () => ({
    removeAccessToken: jest.fn(),
    setAccessToken: jest.fn(),
}))


// ============================== Tests =============================//
describe('AuthService', () => {

    describe('login', () => {
        it('Call fetcher with correct payload', async () => {
            const mockRes = {
                    data: {
                        access_token: 'token-123',
                    },
                };

            (fetcher as jest.Mock).mockResolvedValue(mockRes)

            const payload = {
                email: 'test@gmail.com',
                password: '123456',
            }

            const res = await AuthService.login(payload, 'cf-token')

            expect(fetcher).toHaveBeenCalledWith(
                CONFIG_API.AUTH.LOGIN,
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        ...payload,
                        cfToken: 'cf-token',
                    }),
                })
            )

            expect(res).toEqual(mockRes)
        })

        it('calls setAccessToken after login success', async () => {
            (fetcher as jest.Mock).mockResolvedValue({
                data: { access_token: 'token-123' },
            })

            await AuthService.login(
                { email: 'a', password: 'b' },
                'cf-token'
            )

            expect(setAccessToken).toHaveBeenCalledWith('token-123')
        })
    })

    describe('refreshToken', () => {
        it('Call refresh endpoint correctly', async () => {
            const mockRes = {
                    data: {
                        access_token: 'new-token',
                    },
                };

            (fetcher as jest.Mock).mockResolvedValue(mockRes)

            const res = await AuthService.refreshToken()

            expect(fetcher).toHaveBeenCalledWith(CONFIG_API.AUTH.REFRESH)
            expect(res).toEqual(mockRes)
        })

        it('calls setAccessToken when refresh token success', async () => {
            (fetcher as jest.Mock).mockResolvedValue({
                data: { access_token: 'new-token' },
            })

            await AuthService.refreshToken()

            expect(setAccessToken).toHaveBeenCalledWith('new-token')
        })
    })

    describe('register', () => {
        it('Call register endpoint with correct payload', async () => {
            const mockRes = {
                data: {
                    _id: 1,
                    createdAt: '2004-02-04T17:00:00.000Z',
                },
            };

            (fetcher as jest.Mock).mockResolvedValue(mockRes)

            const payload = {
                name: 'test user',
                email: 'test@gmail.com',
                password: '123456',
                birthday: "2004-02-04T17:00:00.000Z",
                age: 22
            }

            const res = await AuthService.register(payload as never, 'cf-token')

            expect(fetcher).toHaveBeenCalledWith(
                CONFIG_API.AUTH.REGISTER,
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        ...payload,
                        cfToken: 'cf-token',
                    }),
                })
            )

            expect(res).toEqual(mockRes)
        })
    })

    describe('forgotPassword', () => {
        it('Call forgot password endpoint with correct payload', async () => {
            const mockRes = {
                    message: 'Email sent',
                    statusCode: 200,
                    data: null,
                }

            ;(fetcher as jest.Mock).mockResolvedValue(mockRes)

            const payload = {
                email: 'test@gmail.com',
            }

            const res = await AuthService.forgotPassword(payload, 'cf-token')

            expect(fetcher).toHaveBeenCalledWith(
                CONFIG_API.AUTH.FORGOT,
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        ...payload,
                        cfToken: 'cf-token',
                    }),
                })
            )

            expect(res).toEqual(mockRes)
        })
    })

    describe('resetPassword', () => {
        it('Call reset password endpoint with correct payload and token', async () => {
            const mockRes = {
                    message: 'Password reset success',
                    statusCode: 200,
                    data: null,
                };

            (fetcher as jest.Mock).mockResolvedValue(mockRes)

            const payload = {
                newPassword: 'new-password',
            }

            const token = 'reset-token-123'

            const res = await AuthService.resetPassword(payload as never, token)

            expect(fetcher).toHaveBeenCalledWith(
                CONFIG_API.AUTH.RESET,
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        ...payload,
                        token,
                    }),
                })
            )

            expect(res).toEqual(mockRes)
        })
    })

    describe('logout', () => {
        it('calls logout endpoint and removes access token', async () => {
            const mockRes = {
                    message: 'Logout success',
                    statusCode: 200,
                    data: null,
                };

            (authFetcher as jest.Mock).mockResolvedValueOnce(mockRes)

            const res = await AuthService.logout()

            expect(authFetcher).toHaveBeenCalledTimes(1)
            expect(authFetcher).toHaveBeenCalledWith(
                CONFIG_API.AUTH.LOGOUT,
                expect.objectContaining({
                    method: 'POST',
                })
            )

            expect(removeAccessToken).toHaveBeenCalledTimes(1)

            expect(res).toEqual(mockRes)
        })

        it('does NOT remove access token if logout api fails', async () => {
            (authFetcher as jest.Mock).mockRejectedValueOnce(
                new Error('Unauthorized')
            )

            await expect(AuthService.logout()).rejects.toThrow('Unauthorized')

            expect(removeAccessToken).not.toHaveBeenCalled()
        })
    })
})
