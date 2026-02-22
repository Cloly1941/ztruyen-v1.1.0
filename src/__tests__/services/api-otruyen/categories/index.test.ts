/* eslint-disable @typescript-eslint/no-explicit-any */

// ** Types
import { IOtruyenListComic, IOtruyenListGenre } from "@/types/api.otruyen";
import { ESortField, ESortType } from "@/types/enum";

// =============================== Mocks =============================//
jest.mock("next/cache", () => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    unstable_cache: (fn: Function) => fn,
}));

jest.mock("@/lib/fetcher");
jest.mock("@/configs/api-otruyen", () => ({
    CONFIG_API_OTRUYEN: {
        CATEGORY: "https://api.example.com/the-loai",
    },
}));
jest.mock("@/configs/tag-otruyen", () => ({
    CONFIG_TAG_OTRUYEN: {
        CATEGORY: "category-tag",
    },
}));

import { fetcher } from "@/lib/fetcher";
import { getListGenre, getListByGender } from "@/services/api-otruyen/categories";

const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

const mockGenreList: IOtruyenListGenre[] = [
    { _id: "g1", name: "Action", slug: "action" },
    { _id: "g2", name: "Romance", slug: "romance" },
    { _id: "g3", name: "Fantasy", slug: "fantasy" },
];

const mockComicList: IOtruyenListComic[] = [
    {
        _id: "1",
        name: "One Piece",
        slug: "one-piece",
        origin_name: ["ワンピース"],
        status: "ongoing",
        thumb_url: "https://img.example.com/one-piece.jpg",
        sub_docquyen: false,
        category: [
            { _id: "g1", name: "Action", slug: "action" },
        ],
        updatedAt: "2024-01-01T00:00:00.000Z",
        chaptersLatest: [
            {
                filename: "chapter-100",
                chapter_name: "100",
                chapter_title: "Tiêu đề chương",
                chapter_api_data: "https://api.example.com/chapter/100",
            },
        ],
    },
];

const mockGenreResponse = {
    status: true,
    message: "success",
    data: {
        items: mockGenreList,
        seoOnPage: {
            titleHead: "Thể loại",
            descriptionHead: "Danh sách thể loại",
        },
    },
};

const mockComicResponse = {
    status: true,
    message: "success",
    data: {
        items: mockComicList,
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
describe("getListGenre", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call fetcher with CONFIG_API_OTRUYEN.CATEGORY", async () => {
        mockedFetcher.mockResolvedValueOnce(mockGenreResponse as any);

        await getListGenre();

        expect(mockedFetcher).toHaveBeenCalledTimes(1);
        expect(mockedFetcher).toHaveBeenCalledWith("https://api.example.com/the-loai");
    });

    it("should return correct genre list", async () => {
        mockedFetcher.mockResolvedValueOnce(mockGenreResponse as any);

        const result = await getListGenre();

        expect(result?.data?.items).toHaveLength(3);
        expect(result?.data?.items[0]).toMatchObject({
            _id: "g1",
            name: "Action",
            slug: "action",
        });
    });

    it("should return empty array when no genres", async () => {
        mockedFetcher.mockResolvedValueOnce({
            ...mockGenreResponse,
            data: {
                items: [],
                seoOnPage: mockGenreResponse.data.seoOnPage,
            },
        } as any);

        const result = await getListGenre();

        expect(result?.data?.items).toHaveLength(0);
    });

    it("should throw when fetcher rejects", async () => {
        mockedFetcher.mockRejectedValueOnce(new Error("Network error"));

        await expect(getListGenre()).rejects.toThrow("Network error");
    });
});

// ============================== Tests =============================//
describe("getListByGender", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call fetcher with default page, sortField and sortType", async () => {
        mockedFetcher.mockResolvedValueOnce(mockComicResponse as any);

        await getListByGender("action");

        expect(mockedFetcher).toHaveBeenCalledTimes(1);
        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/the-loai/action?page=1&sort_field=updatedAt&sort_type=desc"
        );
    });

    it("should call fetcher with custom page and default sortField, sortType", async () => {
        mockedFetcher.mockResolvedValueOnce(mockComicResponse as any);

        await getListByGender("romance", 2);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/the-loai/romance?page=2&sort_field=updatedAt&sort_type=desc"
        );
    });

    it("should call fetcher with custom page and custom sortField and default sortType", async () => {
        mockedFetcher.mockResolvedValueOnce(mockComicResponse as any);

        await getListByGender("fantasy", 3, ESortField.CREATED_AT);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/the-loai/fantasy?page=3&sort_field=createdAt&sort_type=desc"
        );
    });

    it("should call fetcher with all custom params including sortType ASC", async () => {
        mockedFetcher.mockResolvedValueOnce(mockComicResponse as any);

        await getListByGender("action", 2, ESortField.CREATED_AT, ESortType.ASC);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/the-loai/action?page=2&sort_field=createdAt&sort_type=asc"
        );
    });

    it("should call fetcher with sortType DESC explicitly", async () => {
        mockedFetcher.mockResolvedValueOnce(mockComicResponse as any);

        await getListByGender("action", 1, ESortField.UPDATED_AT, ESortType.DESC);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/the-loai/action?page=1&sort_field=updatedAt&sort_type=desc"
        );
    });

    it("should return correct comic data", async () => {
        mockedFetcher.mockResolvedValueOnce(mockComicResponse as any);

        const result = await getListByGender("action");

        expect(result?.data?.items).toHaveLength(1);
        expect(result?.data?.items[0]).toMatchObject({
            _id: "1",
            name: "One Piece",
            slug: "one-piece",
            status: "ongoing",
        });
        expect(result?.data?.params?.pagination?.currentPage).toBe(1);
    });

    it("should return empty items when API returns no comics", async () => {
        const emptyResponse = {
            ...mockComicResponse,
            data: {
                items: [],
                params: {
                    pagination: { totalItems: 0, totalPages: 0, currentPage: 1 },
                },
            },
        };

        mockedFetcher.mockResolvedValueOnce(emptyResponse as any);

        const result = await getListByGender("action");

        expect(result?.data?.items).toHaveLength(0);
    });

    it("should throw when fetcher rejects", async () => {
        mockedFetcher.mockRejectedValueOnce(new Error("Network error"));

        await expect(getListByGender("action")).rejects.toThrow("Network error");
    });
});