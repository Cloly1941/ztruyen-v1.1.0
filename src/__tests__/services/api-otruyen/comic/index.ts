/* eslint-disable @typescript-eslint/no-explicit-any */

// ** Types
import { IOtruyenDetailComic } from "@/types/api.otruyen";

// =============================== Mocks =============================//
jest.mock("next/cache", () => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    unstable_cache: (fn: Function) => fn,
}));

jest.mock("@/lib/fetcher");
jest.mock("@/configs/api-otruyen", () => ({
    CONFIG_API_OTRUYEN: {
        COMIC: "https://api.example.com/truyen-tranh",
    },
}));
jest.mock("@/configs/tag-otruyen", () => ({
    CONFIG_TAG_OTRUYEN: {
        DETAIL: "detail-tag",
    },
}));

import { fetcher } from "@/lib/fetcher";
import {getDetailComic} from "@/services/api-otruyen/comic";


const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

const mockDetailComic: IOtruyenDetailComic = {
    _id: "1",
    name: "One Piece",
    slug: "one-piece",
    origin_name: ["ワンピース"],
    content: "Nội dung truyện One Piece",
    status: "ongoing",
    thumb_url: "thumb-one-piece.jpg",
    sub_docquyen: false,
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
                {
                    filename: "chapter-1099",
                    chapter_name: "1099",
                    chapter_title: "Tiêu đề chương 1099",
                    chapter_api_data: "https://api.example.com/chapter/1099",
                },
            ],
        },
    ],
};

const mockResponse = {
    status: true,
    message: "success",
    data: {
        item: mockDetailComic,
        seoOnPage: {
            titleHead: "One Piece",
            descriptionHead: "Đọc truyện One Piece",
        },
    },
};

// ============================== Tests =============================//
describe("getDetailComic", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call fetcher with correct url", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getDetailComic("one-piece");

        expect(mockedFetcher).toHaveBeenCalledTimes(1);
        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/truyen-tranh/one-piece"
        );
    });

    it("should call fetcher with correct url for different slug", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        await getDetailComic("naruto");

        expect(mockedFetcher).toHaveBeenCalledWith(
            "https://api.example.com/truyen-tranh/naruto"
        );
    });

    it("should return correct detail comic data", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        const result = await getDetailComic("one-piece");

        expect(result?.data?.item).toMatchObject({
            _id: "1",
            name: "One Piece",
            slug: "one-piece",
            status: "ongoing",
            sub_docquyen: false,
        });
    });

    it("should return correct author", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        const result = await getDetailComic("one-piece");

        expect(result?.data?.item?.author).toEqual(["Eiichiro Oda"]);
    });

    it("should return correct categories", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        const result = await getDetailComic("one-piece");

        expect(result?.data?.item?.category).toHaveLength(2);
        expect(result?.data?.item?.category[0]).toMatchObject({
            _id: "cat1",
            name: "Action",
            slug: "action",
        });
    });

    it("should return correct chapters", async () => {
        mockedFetcher.mockResolvedValueOnce(mockResponse as any);

        const result = await getDetailComic("one-piece");

        expect(result?.data?.item?.chapters).toHaveLength(1);
        expect(result?.data?.item?.chapters[0].server_name).toBe("Server 1");
        expect(result?.data?.item?.chapters[0].server_data).toHaveLength(2);
    });

    it("should return comic with empty chapters", async () => {
        const emptyChaptersResponse = {
            ...mockResponse,
            data: {
                ...mockResponse.data,
                item: {
                    ...mockDetailComic,
                    chapters: [],
                },
            },
        };

        mockedFetcher.mockResolvedValueOnce(emptyChaptersResponse as any);

        const result = await getDetailComic("one-piece");

        expect(result?.data?.item?.chapters).toHaveLength(0);
    });

    it("should throw when fetcher rejects", async () => {
        mockedFetcher.mockRejectedValueOnce(new Error("Network error"));

        await expect(getDetailComic("one-piece")).rejects.toThrow("Network error");
    });
});