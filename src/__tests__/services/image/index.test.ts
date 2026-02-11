// ** Service
import { ImageService } from '@/services/image'

// ** Lib
import { authFetcherWithRefresh } from '@/lib/auth-fetch'

// ** Config
import { CONFIG_API } from '@/configs/api'

// ================= MOCKS =================

jest.mock('@/lib/auth-fetch', () => ({
    authFetcherWithRefresh: jest.fn(),
}))
describe('ImageService', () => {
    describe('upload', () => {
        const mockFile = new File(['avatar'], 'avatar.png', {
            type: 'image/png',
        })

        const mockResponse = {
            success: true,
            data: {
                _id: 'image-id-123',
                url: 'https://image.com/avatar.png',
            },
        }

        it('calls authFetcherWithRefresh with correct params', async () => {
            (authFetcherWithRefresh as jest.Mock).mockResolvedValue(
                mockResponse
            )

            const result = await ImageService.upload({
                file: mockFile,
                caption: 'avatar test',
            })

            // Check fetch called
            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)

            const [url, options] =
                (authFetcherWithRefresh as jest.Mock).mock.calls[0]

            expect(url).toBe(CONFIG_API.IMAGE.UPLOAD)
            expect(options.method).toBe('POST')
            expect(options.body).toBeInstanceOf(FormData)

            const formData = options.body as FormData

            expect(formData.get('file')).toBe(mockFile)
            expect(formData.get('caption')).toBe('avatar test')

            expect(result).toEqual(mockResponse)
        })

        it('throws error if fetcher rejects', async () => {
            (authFetcherWithRefresh as jest.Mock).mockRejectedValue(
                new Error('Upload failed')
            )

            await expect(
                ImageService.upload({
                    file: mockFile,
                    caption: 'avatar test',
                })
            ).rejects.toThrow('Upload failed')
        })
    })
})