/* eslint-disable @typescript-eslint/no-explicit-any */

// ** Types
import { IOtruyenSearchComic } from "@/types/api.otruyen";

// =============================== Mocks =============================//
jest.mock("next/cache", () => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    unstable_cache: (fn: Function) => fn,
}));

jest.mock("@/lib/fetcher");
jest.mock("@/configs/api-otruyen", () => ({
    CONFIG_API_OTRUYEN: {
        SEARCH: "https://api.example.com/tim-kiem",
    },
}));
jest.mock("@/configs/tag-otruyen", () => ({
    CONFIG_TAG_OTRUYEN: {
        LIST: "list-tag",
    },
}));

import { fetcher } from "@/lib/fetcher";
import { getListBySearch } from "@/services/api-otruyen/search";

const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

// =============================== Mock Data =============================//
const mockSearchComic: IOtruyenSearchComic = {
    name: "One Piece",
    slug: "one-piece",
    status: "ongoing",
    thumb_url: "thumb-one-piece.jpg",
    author: ["Eiichiro Oda"],
    category: [
        { _id: "cat1", name: "Action", slug: "action" },
        { _id: "cat2", name: "Adventure", slug: "adventure" },
    ],
    chapters: [
        {
            server_name: "Server 1",
            server_data: [
                {
                    filename: "chapter-1100",
                    chapter_name: "1100",
                    chapter_title: "Tiêu đề chương 1100",
                    chapter_api_data: "https://api.example.com/chapter/1100",
                },
            ],
        },
    ],
    updatedAt: "2024-01-01T00:00:00.000Z",
    chaptersLatest: [
        {
            filename: "chapter-1100",
            chapter_name: "1100",
            chapter_title: "Tiêu đề chương 1100",
            chapter_api_data: "https://api.example.com/chapter/1100",
        },
    ],
};

const mockResponse = {
    status: true,
    message: "success",
    data: {
        items: [mockSearchComic],
        params: {
            pagination: {
                totalItems: 1,
                totalPages: 1,
                currentPage: 1,
            },
        },
    },
};

// ============================== Tests =============================//
describe("getListBySearch", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //  URL
    it("should call fetcher with keyword and default page", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListBySearch("one piece");

        expect(mockedFetcher).toHaveBeenCalledTimes(1);
        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/tim-kiem?keyword=one piece&page=1"
        );
    });

    it("should call fetcher with keyword and custom page", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListBySearch("naruto", 3);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/tim-kiem?keyword=naruto&page=3"
        );
    });

    it("should call fetcher with empty keyword", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListBySearch("");

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/tim-kiem?keyword=&page=1"
        );
    });

    it("should call fetcher with keyword containing special characters", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListBySearch("one-piece");

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/tim-kiem?keyword=one-piece&page=1"
        );
    });

    //  Return data
    it("should return correct search result data", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        const result = await getListBySearch("one piece");

        expect(result?.data?.items).toHaveLength(1);
        expect(result?.data?.items[0]).toMatchObject({
            name: "One Piece",
            slug: "one-piece",
            status: "ongoing",
        });
    });

    it("should return correct author and category", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        const result = await getListBySearch("one piece");

        expect(result?.data?.items[0].author).toEqual(["Eiichiro Oda"]);
        expect(result?.data?.items[0].category).toHaveLength(2);
    });

    it("should return correct pagination", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        const result = await getListBySearch("one piece");

        expect(result?.data?.params?.pagination?.totalItems).toBe(1);
        expect(result?.data?.params?.pagination?.currentPage).toBe(1);
    });

    it("should return empty items when no results found", async () => {
        const emptyResponse = {
            ...mockResponse,
            data: { items: [] },
            params: {
                pagination: { totalItems: 0, totalPages: 0, currentPage: 1 },
            },
        };

        mockedFetcher.mockResolvedValueOnce(emptyResponse as any);

        const result = await getListBySearch("nonexistent");

        expect(result?.data?.items).toHaveLength(0);
    });

    it("should return multiple results", async () => {
        const multiResponse = {
            ...mockResponse,
            data: {
                items: [
                    mockSearchComic,
                    { ...mockSearchComic, name: "Naruto", slug: "naruto" },
                ],
            },
            params: {
                pagination: { totalItems: 2, totalPages: 1, currentPage: 1 },
            },
        };

        mockedFetcher.mockResolvedValueOnce(multiResponse as any);

        const result = await getListBySearch("anime");

        expect(result?.data?.items).toHaveLength(2);
        expect(result?.data?.items[1].name).toBe("Naruto");
    });

    //  Error
    it("should throw when fetcher rejects", async () => {
        mockedFetcher.mockRejectedValueOnce(new Error("Network error"));

        await expect(getListBySearch("one piece")).rejects.toThrow("Network error");
    });
});