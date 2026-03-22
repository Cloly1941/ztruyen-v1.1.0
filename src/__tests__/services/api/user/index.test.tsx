// ** Libs
import {authFetcherWithRefresh} from '@/lib/auth-fetch'
import {removeAccessToken} from '@/lib/localStorage'

// ** Configs
import {CONFIG_API} from '@/configs/api'

// ** Services & Types
import {TUploadProfileImagePayload, UserService} from '@/services/api/user'
import {TUpdateProfilePayload} from "@/modules/tai-khoan/thong-tin-ca-nhan/FormUpdateProfile";

// =============================== Mocks =============================//
jest.mock('@/lib/auth-fetch', () => ({
    authFetcherWithRefresh: jest.fn(),
}))

jest.mock('@/lib/localStorage', () => ({
    removeAccessToken: jest.fn(),
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

    describe('updateProfile', () => {

        it('calls authFetcherWithRefresh with correct params', async () => {
            const payload: TUpdateProfilePayload = {
                name: 'John Doe',
                birthday: '2000-01-01',
                age: 25,
                gender: 'male',
                bio: 'Hello world',
            };

            (authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await UserService.updateProfile(payload)

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                CONFIG_API.USER.PROFILE,
                {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                }
            )
        })

        it('returns response from authFetcherWithRefresh', async () => {
            const payload: TUpdateProfilePayload = {
                name: 'John Doe',
                birthday: '2000-01-01',
                age: 25,
            }

            const mockResponse = {
                    data: {
                        id: 1,
                        name: 'John Doe',
                        birthday: '2000-01-01',
                        age: 25,
                    },
                };

            (authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await UserService.updateProfile(payload)

            expect(res).toEqual(mockResponse)
        })

        it('throws error when authFetcherWithRefresh rejects', async () => {
            const payload: TUpdateProfilePayload = {
                name: 'John Doe',
                birthday: '2000-01-01',
                age: 25,
            }

            const error = new Error('Update failed');

            (authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(UserService.updateProfile(payload))
                .rejects
                .toThrow('Update failed')
        })
    })

    describe('updateProfileImage', () => {

        it('calls authFetcherWithRefresh with correct params', async () => {
            const payload: TUploadProfileImagePayload = {
                avatar: 'base64-avatar',
                avatar_frame: 'gold-frame',
                cover: 'base64-cover',
            };

            (authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await UserService.updateProfileImage(payload)

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                CONFIG_API.USER.PROFILE,
                {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                }
            )
        })

        it('returns response from authFetcherWithRefresh', async () => {
            const payload: TUploadProfileImagePayload = {
                avatar: 'base64-avatar',
            }

            const mockResponse = {
                    data: {
                        id: 1,
                        avatar: 'avatar.png',
                    },
                };

            (authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await UserService.updateProfileImage(payload)

            expect(res).toEqual(mockResponse)
        })

        it('throws error when authFetcherWithRefresh rejects', async () => {
            const payload: TUploadProfileImagePayload = {
                avatar: 'base64-avatar',
            }

            const error = new Error('Upload failed');

            (authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(UserService.updateProfileImage(payload))
                .rejects
                .toThrow('Upload failed')
        })
    })

    describe('deleteProfile', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it('calls authFetcherWithRefresh with correct params', async () => {
            (authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                message: 'Profile deleted successfully',
            })

            await UserService.deleteProfile()

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                CONFIG_API.USER.PROFILE,
                {
                    method: 'DELETE',
                }
            )
        })

        it('calls removeAccessToken after successful deletion', async () => {
            (authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                message: 'Profile deleted successfully',
            })

            await UserService.deleteProfile()

            expect(removeAccessToken).toHaveBeenCalledTimes(1)
        })

        it('removes access token before returning response', async () => {
            const callOrder: string[] = []

            ;(removeAccessToken as jest.Mock).mockImplementation(() => {
                callOrder.push('removeAccessToken')
            })

            ;(authFetcherWithRefresh as jest.Mock).mockImplementation(async () => {
                callOrder.push('authFetcherWithRefresh')
                return { message: 'Success' }
            })

            await UserService.deleteProfile()

            expect(callOrder).toEqual(['authFetcherWithRefresh', 'removeAccessToken'])
        })
    })

})
