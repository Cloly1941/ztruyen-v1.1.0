// ** Libs
import { fetcher } from '@/lib/fetcher'
import { ApiError } from '@/lib/api-error'

describe('fetcher', () => {

    it('Call fetch with query params correctly', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        })

        await fetcher('/api/test', {
            params: {
                page: 1,
                keyword: 'hello',
                ignore: undefined,
            },
        })

        expect(fetch).toHaveBeenCalledWith(
            '/api/test?page=1&keyword=hello',
            expect.objectContaining({
                credentials: 'include',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                }),
            })
        )
    })

    it('Merge custom headers correctly', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        })

        await fetcher('/api/header', {
            headers: {
                Authorization: 'Bearer token',
            },
        })

        expect(fetch).toHaveBeenCalledWith(
            '/api/header',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token',
                }),
            })
        )
    })

    it('Return body when response is ok', async () => {
        const mockData = { data: { id: 1 } };

        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockData,
        })

        const res = await fetcher<typeof mockData>('/api/success')

        expect(res).toEqual(mockData)
    })

    it('Throw ApiError when payload.message is string', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => ({
                message: 'Bad request',
            }),
        })

        await expect(fetcher('/api/error')).rejects.toBeInstanceOf(ApiError)
        await expect(fetcher('/api/error')).rejects.toThrow('Bad request')
    })

    it('Throw ApiError when payload.message is array', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 422,
            json: async () => ({
                message: ['Email invalid', 'Password required'],
            }),
        })

        await expect(fetcher('/api/error')).rejects.toThrow(
            'Email invalid\nPassword required'
        )
    })

    it('Throw ApiError when payload.error exists', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({
                error: 'Unauthorized',
            }),
        })

        await expect(fetcher('/api/error')).rejects.toThrow('Unauthorized')
    })

    it('Throw default message when response body is not JSON', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => {
                throw new Error('Invalid JSON')
            },
        })

        await expect(fetcher('/api/error')).rejects.toThrow(
            'Request failed (500)'
        )
    })
})
