/* eslint-disable @typescript-eslint/no-explicit-any */

// ** Types
import { IOtruyenListComic } from "@/types/api.otruyen";
import { ESlug, ESortField, ESortType } from "@/types/enum";

// =============================== Mocks =============================//
jest.mock("next/cache", () => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    unstable_cache: (fn: Function) => fn,
}));

jest.mock("@/lib/fetcher");
jest.mock("@/configs/api-otruyen", () => ({
    CONFIG_API_OTRUYEN: {
        LIST: "https://api.example.com/danh-sach",
    },
}));
jest.mock("@/configs/tag-otruyen", () => ({
    CONFIG_TAG_OTRUYEN: {
        LIST: "list-tag",
    },
}));

import { fetcher } from "@/lib/fetcher";
import { getListByStatus } from "@/services/api-otruyen/list";

const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

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
            { _id: "cat1", name: "Action", slug: "action" },
        ],
        updatedAt: "2024-01-01T00:00:00.000Z",
        chaptersLatest: [
            {
                filename: "chapter-1100",
                chapter_name: "1100",
                chapter_title: "Tiêu đề chương",
                chapter_api_data: "https://api.example.com/chapter/1100",
            },
        ],
    },
];

const mockResponse = {
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
describe("getListByStatus", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call fetcher with default page, sortField and sortType", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListByStatus(ESlug.NEW);

        expect(mockedFetcher).toHaveBeenCalledTimes(1);
        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/danh-sach/truyen-moi?page=1&sort_field=updatedAt&sort_type=desc"
        );
    });

    it("should call fetcher with custom page and default sortField, sortType", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListByStatus(ESlug.ONGOING, 3);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/danh-sach/dang-phat-hanh?page=3&sort_field=updatedAt&sort_type=desc"
        );
    });

    it("should call fetcher with custom page and custom sortField and default sortType", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListByStatus(ESlug.COMPLETED, 2, ESortField.CREATED_AT);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/danh-sach/hoan-thanh?page=2&sort_field=createdAt&sort_type=desc"
        );
    });

    it("should call fetcher with all custom params including sortType ASC", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListByStatus(ESlug.COMPLETED, 2, ESortField.CREATED_AT, ESortType.ASC);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/danh-sach/hoan-thanh?page=2&sort_field=createdAt&sort_type=asc"
        );
    });

    it("should call fetcher with COMING_SOON slug", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListByStatus(ESlug.COMING_SOON);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/danh-sach/sap-ra-mat?page=1&sort_field=updatedAt&sort_type=desc"
        );
    });

    it("should call fetcher with sortType DESC explicitly", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getListByStatus(ESlug.NEW, 1, ESortField.UPDATED_AT, ESortType.DESC);

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/danh-sach/truyen-moi?page=1&sort_field=updatedAt&sort_type=desc"
        );
    });

    it("should return correct data", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        const result = await getListByStatus(ESlug.NEW);

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
            ...mockResponse,
            data: {
                items: [],
                params: {
                    pagination: { totalItems: 0, totalPages: 0, currentPage: 1 },
                },
            },
        };

        mockedFetcher.mockResolvedValueOnce(emptyResponse as any);

        const result = await getListByStatus(ESlug.NEW);

        expect(result?.data?.items).toHaveLength(0);
    });

    it("should throw when fetcher rejects", async () => {
        mockedFetcher.mockRejectedValueOnce(new Error("Network error"));

        await expect(getListByStatus(ESlug.NEW)).rejects.toThrow("Network error");
    });
});