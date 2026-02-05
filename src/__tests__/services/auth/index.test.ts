import { AuthService } from '@/services/auth'
import { fetcher } from '@/lib/fetcher'
import { CONFIG_API } from '@/configs/api'
import { VARIABLE } from '@/configs/variable'

jest.mock('@/lib/fetcher')

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

        it('Save accessToken to localStorage when window exists', async () => {
            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

            (fetcher as jest.Mock).mockResolvedValue({
                data: {
                    access_token: 'token-123',
                },
            })

            await AuthService.login(
                { email: 'a', password: 'b' },
                'cf-token'
            )

            expect(setItemSpy).toHaveBeenCalledWith(
                VARIABLE.ACCESS_TOKEN,
                'token-123'
            )

            setItemSpy.mockRestore()
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

        it('Save refreshed accessToken to localStorage', async () => {
            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

            (fetcher as jest.Mock).mockResolvedValue({
                data: {
                    access_token: 'new-token',
                },
            })

            await AuthService.refreshToken()

            expect(setItemSpy).toHaveBeenCalledWith(
                VARIABLE.ACCESS_TOKEN,
                'new-token'
            )

            setItemSpy.mockRestore()
        })
    })
})
