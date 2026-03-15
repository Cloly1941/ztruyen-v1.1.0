// ** Lib
import { authFetcherWithRefresh } from "@/lib/auth-fetch"

// ** Utils
import { buildQueryString, TQueryParams } from "@/utils/buildQueryString"

// ** Config
import { CONFIG_API } from "@/configs/api"

// ** Service
import { FrameService } from "@/services/api/frame"

// =============================== Mocks ============================= //

jest.mock("@/lib/auth-fetch", () => ({
    authFetcherWithRefresh: jest.fn(),
}))

jest.mock("@/utils/buildQueryString", () => ({
    buildQueryString: jest.fn(),
}))

// ============================== Tests ============================== //

describe("FrameService", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("list", () => {

        it("calls buildQueryString with correct params", async () => {

            const params: TQueryParams = {
                    page: 1,
                    limit: 10,
                    sort: "-createdAt",
                }

            ;(buildQueryString as jest.Mock).mockReturnValue(
                "page=1&limit=10&sort=-createdAt"
            )

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await FrameService.list(params)

            expect(buildQueryString).toHaveBeenCalledTimes(1)
            expect(buildQueryString).toHaveBeenCalledWith(params)
        })

        it("calls authFetcherWithRefresh with correct endpoint", async () => {

            const params: TQueryParams = {
                page: 1,
                limit: 10,
            }

            const query = "page=1&limit=10"

            ;(buildQueryString as jest.Mock).mockReturnValue(query)

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: [],
            })

            await FrameService.list(params)

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)

            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                `${CONFIG_API.FRAME.INDEX}?${query}`
            )
        })

        it("returns response from authFetcherWithRefresh", async () => {

            const params: TQueryParams = {
                page: 1,
                limit: 10,
            }

            const mockResponse = {
                    data: {
                        result: [
                            {
                                _id: "frame1",
                                name: "Gold Frame",
                                image: { url: "gold.png" },
                            },
                        ],
                        meta: {
                            totalItems: 1,
                        },
                    },
                }

            ;(buildQueryString as jest.Mock).mockReturnValue("page=1&limit=10")

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await FrameService.list(params)

            expect(res).toEqual(mockResponse)
        })

        it("throws error when authFetcherWithRefresh rejects", async () => {

            const params: TQueryParams = {
                page: 1,
                limit: 10,
            }

            const error = new Error("Fetch frames failed")

            ;(buildQueryString as jest.Mock).mockReturnValue("page=1&limit=10")

            ;(authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(FrameService.list(params))
                .rejects
                .toThrow("Fetch frames failed")
        })
    })
})