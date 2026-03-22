// ** Lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch"

// ** Utils
import {buildQueryString, TQueryParams} from "@/utils/buildQueryString"

// ** Config
import {CONFIG_API} from "@/configs/api"

// ** Service
import {FavoriteService} from "@/services/api/favorite"

// ** Type
import {TFavoriteBtnPayload} from "@/modules/truyen-tranh/FavoriteBtn"

// =============================== Mocks ============================= //

jest.mock("@/lib/auth-fetch", () => ({
    authFetcherWithRefresh: jest.fn(),
}))

jest.mock("@/utils/buildQueryString", () => ({
    buildQueryString: jest.fn(),
}))

// ============================== Tests ============================== //

describe("FavoriteService", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    // ------------------------------------------------------------------
    // list
    // ------------------------------------------------------------------
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

            await FavoriteService.list(params)

            expect(buildQueryString).toHaveBeenCalledTimes(1)
            expect(buildQueryString).toHaveBeenCalledWith(params)
        })

        it("calls authFetcherWithRefresh with correct endpoint", async () => {

            const params: TQueryParams = {page: 1, limit: 10}
            const query = "page=1&limit=10"

            ;(buildQueryString as jest.Mock).mockReturnValue(query)

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: [],
            })

            await FavoriteService.list(params)

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                `${CONFIG_API.FAVORITE.INDEX}?${query}`
            )
        })

        it("returns response from authFetcherWithRefresh", async () => {

            const params: TQueryParams = {page: 1, limit: 10}

            const mockResponse = {
                    data: {
                        result: [
                            {
                                _id: "fav1",
                                comic: {_id: "comic1", name: "One Piece", slug: "one-piece"},
                            },
                        ],
                        meta: {totalItems: 1},
                    },
                }

            ;(buildQueryString as jest.Mock).mockReturnValue("page=1&limit=10")
            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await FavoriteService.list(params)

            expect(res).toEqual(mockResponse)
        })

        it("throws error when authFetcherWithRefresh rejects", async () => {

            const params: TQueryParams = {page: 1, limit: 10}
            const error = new Error("Fetch favorites failed")

            ;(buildQueryString as jest.Mock).mockReturnValue("page=1&limit=10")
            ;(authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(FavoriteService.list(params))
                .rejects
                .toThrow("Fetch favorites failed")
        })
    })

    // ------------------------------------------------------------------
    // check
    // ------------------------------------------------------------------
    describe("check", () => {

        it("calls authFetcherWithRefresh with correct endpoint", async () => {

            const slug = "one-piece"

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await FavoriteService.check(slug)

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                `${CONFIG_API.FAVORITE.CHECK}/${slug}`
            )
        })

        it("returns response from authFetcherWithRefresh", async () => {

            const slug = "one-piece"

            const mockResponse = {
                    data: {isFavorite: true, favoriteId: "fav1"},
                }

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await FavoriteService.check(slug)

            expect(res).toEqual(mockResponse)
        })

        it("throws error when authFetcherWithRefresh rejects", async () => {

            const error = new Error("Check favorite failed")

            ;(authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(FavoriteService.check("one-piece"))
                .rejects
                .toThrow("Check favorite failed")
        })
    })

    // ------------------------------------------------------------------
    // toggle
    // ------------------------------------------------------------------
    describe("toggle", () => {

        it("calls authFetcherWithRefresh with correct endpoint, method and body", async () => {

            const payload: TFavoriteBtnPayload = {
                    comic_name: "comic1",
                    comic_slug: "one-piece",
                    comic_cover: 'https://images.unsplash.com/photo-1773332611574-d73d8f5cea36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await FavoriteService.toggle(payload)

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                CONFIG_API.FAVORITE.TOGGLE,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
            )
        })

        it("returns response from authFetcherWithRefresh", async () => {

            const payload: TFavoriteBtnPayload = {
                comic_name: "comic1",
                comic_slug: "one-piece",
                comic_cover: 'https://images.unsplash.com/photo-1773332611574-d73d8f5cea36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }

            const mockResponse = {
                    data: {isFavorite: false, favoriteId: null},
                }

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await FavoriteService.toggle(payload)

            expect(res).toEqual(mockResponse)
        })

        it("throws error when authFetcherWithRefresh rejects", async () => {

            const payload: TFavoriteBtnPayload = {
                comic_name: "comic1",
                comic_slug: "one-piece",
                comic_cover: 'https://images.unsplash.com/photo-1773332611574-d73d8f5cea36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }

            const error = new Error("Toggle favorite failed")

            ;(authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(FavoriteService.toggle(payload))
                .rejects
                .toThrow("Toggle favorite failed")
        })
    })

    // ------------------------------------------------------------------
    // delete
    // ------------------------------------------------------------------
    describe("delete", () => {

        it("calls authFetcherWithRefresh with correct endpoint and method", async () => {

            const id = "fav1"

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await FavoriteService.delete(id)

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                `${CONFIG_API.FAVORITE.DELETE}/${id}`,
                {method: "DELETE"}
            )
        })

        it("returns response from authFetcherWithRefresh", async () => {

            const mockResponse = {data: null}

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await FavoriteService.delete("fav1")

            expect(res).toEqual(mockResponse)
        })

        it("throws error when authFetcherWithRefresh rejects", async () => {

            const error = new Error("Delete favorite failed")

            ;(authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(FavoriteService.delete("fav1"))
                .rejects
                .toThrow("Delete favorite failed")
        })
    })

    // ------------------------------------------------------------------
    // deleteMulti
    // ------------------------------------------------------------------
    describe("deleteMulti", () => {

        it("calls authFetcherWithRefresh with correct endpoint, method and body", async () => {

            const ids = ["fav1", "fav2", "fav3"]

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await FavoriteService.deleteMulti(ids)

            expect(authFetcherWithRefresh).toHaveBeenCalledTimes(1)
            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                CONFIG_API.FAVORITE.DELETE_MULTI,
                {
                    method: "DELETE",
                    body: JSON.stringify({ids}),
                }
            )
        })

        it("returns response from authFetcherWithRefresh", async () => {

            const ids = ["fav1", "fav2"]
            const mockResponse = {data: null}

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce(mockResponse)

            const res = await FavoriteService.deleteMulti(ids)

            expect(res).toEqual(mockResponse)
        })

        it("throws error when authFetcherWithRefresh rejects", async () => {

            const error = new Error("Delete multi favorites failed")

            ;(authFetcherWithRefresh as jest.Mock).mockRejectedValueOnce(error)

            await expect(FavoriteService.deleteMulti(["fav1", "fav2"]))
                .rejects
                .toThrow("Delete multi favorites failed")
        })

        it("handles empty ids array", async () => {

            ;(authFetcherWithRefresh as jest.Mock).mockResolvedValueOnce({
                data: null,
            })

            await FavoriteService.deleteMulti([])

            expect(authFetcherWithRefresh).toHaveBeenCalledWith(
                CONFIG_API.FAVORITE.DELETE_MULTI,
                {
                    method: "DELETE",
                    body: JSON.stringify({ids: []}),
                }
            )
        })
    })
})