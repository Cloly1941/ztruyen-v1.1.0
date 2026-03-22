/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";

// =============================== Mocks =============================//
jest.mock("@/hooks/common/useTailwindBreakpoints", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("@/hooks/common/useMounted", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({href, children, className}: any) => (
        <a href={href} className={className}>{children}</a>
    ),
}));

jest.mock("@/components/ui/button", () => ({
    Button: ({children, onClick, className, variant}: any) => (
        <button onClick={onClick} className={className} data-variant={variant}>
            {children}
        </button>
    ),
}));

jest.mock("@/components/ui/tooltip", () => ({
    Tooltip: ({children}: any) => <div>{children}</div>,
    TooltipTrigger: ({children}: any) => <div>{children}</div>,
    TooltipContent: ({children}: any) => <div>{children}</div>,
    TooltipProvider: ({children}: any) => <div>{children}</div>,
}));

jest.mock("@/skeletons/truyen-tranh/ListChapterSkeleton", () => ({
    __esModule: true,
    default: () => <div data-testid="list-chapter-skeleton"/>,
}));

jest.mock("@/utils/getIdFromUrl", () => ({
    __esModule: true,
    default: () => "abc123",
}));

jest.mock("@/configs/slug", () => ({
    CONFIG_SLUG: {
        READING: "/doc-truyen",
    },
}));

// ** Hooks
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";
import useMounted from "@/hooks/common/useMounted";

// ** Module component
import RangeBtnPagination from "@/modules/truyen-tranh/RangeBtnPagination";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

const mockedUseTailwindBreakpoints = useTailwindBreakpoints as jest.MockedFunction<typeof useTailwindBreakpoints>;
const mockedUseMounted = useMounted as jest.MockedFunction<typeof useMounted>;

const defaultBreakpoints = {
    windowWidth: 0,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2xl: false,
};

// =============================== Mock Data =============================//
const createChapter = (
    name: string,
    title: string = "",
    apiData: string = "https://api.example.com/chapter/abc123"
) => ({
    filename: `chapter-${name}`,
    chapter_name: name,
    chapter_title: title,
    chapter_api_data: apiData,
});

// chapters 0-24 => mobile: 2 ranges (0-19, 20-24), desktop: 1 range (0-24)
const mockChapters = Array.from({length: 25}, (_, i) =>
    createChapter(`${i}`, i % 2 === 0 ? `Tiêu đề ${i}` : "")
);

// =============================== Tests =============================//
describe("RangeBtnPagination", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseMounted.mockReturnValue(true);
        mockedUseTailwindBreakpoints.mockReturnValue(defaultBreakpoints);
    });

    //  Skeleton
    describe("when not mounted", () => {
        it("should render skeleton when not mounted", () => {
            mockedUseMounted.mockReturnValue(false);

            render(<RangeBtnPagination chapters={mockChapters} slug="one-piece"/>);

            expect(screen.getByTestId("list-chapter-skeleton")).toBeInTheDocument();
        });
    });

    describe("when mounted", () => {
        //  Sort chapters
        it("should sort chapters numerically starting from 0", () => {
            const unsortedChapters = [
                createChapter("2"),
                createChapter("0"),
                createChapter("1"),
            ];

            render(<RangeBtnPagination chapters={unsortedChapters} slug="one-piece"/>);

            const chapterButtons = screen.getAllByRole("button").filter((b) =>
                b.textContent?.includes("Chương")
            );
            expect(chapterButtons[0].textContent).toContain("0");
            expect(chapterButtons[1].textContent).toContain("1");
            expect(chapterButtons[2].textContent).toContain("2");
        });

        it("should sort chapters with decimal numbers correctly", () => {
            const decimalChapters = [
                createChapter("10.2"),
                createChapter("10.1"),
                createChapter("0"),
            ];

            render(<RangeBtnPagination chapters={decimalChapters} slug="one-piece"/>);

            const chapterButtons = screen.getAllByRole("button").filter((b) =>
                b.textContent?.includes("Chương")
            );
            expect(chapterButtons[0].textContent).toContain("0");
            expect(chapterButtons[1].textContent).toContain("10.1");
            expect(chapterButtons[2].textContent).toContain("10.2");
        });

        //  Range buttons
        it("should render 2 range buttons on mobile (rangeSize=20) for chapters 0-24", () => {
            mockedUseTailwindBreakpoints.mockReturnValue({
                ...defaultBreakpoints,
                isMd: false,
            });

            render(<RangeBtnPagination chapters={mockChapters} slug="one-piece"/>);

            expect(screen.getByText("0 - 19")).toBeInTheDocument();
            expect(screen.getByText("20 - 24")).toBeInTheDocument();
        });

        it("should render 1 range button on desktop (rangeSize=50) for chapters 0-24", () => {
            mockedUseTailwindBreakpoints.mockReturnValue({
                ...defaultBreakpoints,
                isMd: true,
            });

            render(<RangeBtnPagination chapters={mockChapters} slug="one-piece"/>);

            expect(screen.getByText("0 - 24")).toBeInTheDocument();
            expect(screen.queryByText("20 - 24")).not.toBeInTheDocument();
        });

        it("should highlight first range button by default", () => {
            render(<RangeBtnPagination chapters={mockChapters} slug="one-piece"/>);

            const firstRangeBtn = screen.getByText("0 - 19");
            expect(firstRangeBtn.className).toContain("bg-blue-100");
        });

        it("should apply inactive styles to non-active range buttons", () => {
            render(<RangeBtnPagination chapters={mockChapters} slug="one-piece"/>);

            const secondRangeBtn = screen.getByText("20 - 24");
            expect(secondRangeBtn.className).toContain("bg-gray-100");
        });

        it("should change active range when range button is clicked", () => {
            render(<RangeBtnPagination chapters={mockChapters} slug="one-piece"/>);

            const secondRangeBtn = screen.getByText("20 - 24");
            fireEvent.click(secondRangeBtn);

            expect(secondRangeBtn.className).toContain("bg-blue-100");
            expect(screen.getByText("0 - 19").className).not.toContain("bg-blue-100");
        });

        it("should render single range when all chapters fit", () => {
            const fewChapters = Array.from({length: 5}, (_, i) =>
                createChapter(`${i}`)
            );

            render(<RangeBtnPagination chapters={fewChapters} slug="one-piece"/>);

            expect(screen.getByText("0 - 4")).toBeInTheDocument();
            expect(
                screen.getAllByRole("button").filter((b) =>
                    b.textContent?.match(/^\d+ - \d+$/)
                )
            ).toHaveLength(1);
        });

        //  Chapter 0
        it("should render chapter 0 in first range", () => {
            const chaptersWithZero = [
                createChapter("0", "Chương đặc biệt"),
                createChapter("1"),
            ];

            render(<RangeBtnPagination chapters={chaptersWithZero} slug="one-piece"/>);

            expect(screen.getAllByText("0 - Chương đặc biệt").length).toBeGreaterThan(0);
            expect(screen.getByText("Chương 1")).toBeInTheDocument();
        });

        //  Chapter list
        it("should render chapters in first range (0-19)", () => {
            render(<RangeBtnPagination chapters={mockChapters} slug="one-piece"/>);

            expect(screen.getAllByText("0 - Tiêu đề 0").length).toBeGreaterThan(0);

            expect(screen.getByText("Chương 1")).toBeInTheDocument();

            expect(screen.queryByText("20 - Tiêu đề 20")).not.toBeInTheDocument();
        });

        it("should render chapters of second range when clicked", () => {
            render(<RangeBtnPagination chapters={mockChapters} slug="one-piece"/>);

            fireEvent.click(screen.getByText("20 - 24"));

            expect(screen.getAllByText("20 - Tiêu đề 20").length).toBeGreaterThan(0);

            expect(screen.getByText("Chương 21")).toBeInTheDocument();

            expect(screen.queryByText("0 - Tiêu đề 0")).not.toBeInTheDocument();
        });

        //  Chapter with title
        it("should render chapter name and title when chapter_title exists", () => {
            const chaptersWithTitle = [createChapter("0", "Khởi đầu")];

            render(<RangeBtnPagination chapters={chaptersWithTitle} slug="one-piece"/>);

            expect(screen.getAllByText("0 - Khởi đầu").length).toBeGreaterThan(0);
        });

        it("should render only chapter name when chapter_title is empty", () => {
            const chaptersNoTitle = [createChapter("0", "")];

            render(<RangeBtnPagination chapters={chaptersNoTitle} slug="one-piece"/>);

            expect(screen.getByText("Chương 0")).toBeInTheDocument();
        });

        //  Chapter links
        it("should render correct href for chapter without title", () => {
            const chaptersNoTitle = [createChapter("0", "")];

            render(<RangeBtnPagination chapters={chaptersNoTitle} slug="one-piece"/>);

            const link = screen.getByText("Chương 0").closest("a");
            expect(link).toHaveAttribute(
                "href",
                `/${CONFIG_SLUG.READING}/one-piece-chuong-0-abc123.html`
            );
        });

        it("should render correct href for chapter with title", () => {
            const chaptersWithTitle = [createChapter("0", "Khởi đầu")];

            render(<RangeBtnPagination chapters={chaptersWithTitle} slug="one-piece"/>);

            const links = screen
                .getAllByText("0 - Khởi đầu")
                .map((el) => el.closest("a"));
            expect(links[0]).toHaveAttribute(
                "href",
                `/${CONFIG_SLUG.READING}/one-piece-chuong-0-abc123.html`
            );
        });

        it("should render correct href with different slug", () => {
            const chaptersNoTitle = [createChapter("1", "")];

            render(<RangeBtnPagination chapters={chaptersNoTitle} slug="naruto"/>);

            const link = screen.getByText("Chương 1").closest("a");
            expect(link).toHaveAttribute(
                "href",
                `/${CONFIG_SLUG.READING}/naruto-chuong-1-abc123.html`
            );
        });

        it("should return 0 when two chapters have identical names", () => {
            const duplicateChapters = [
                createChapter("5"),
                createChapter("5"),
            ];

            render(<RangeBtnPagination chapters={duplicateChapters} slug="one-piece"/>);

            expect(screen.getAllByText("Chương 5")).toHaveLength(2);
        });

        it("should handle chapters where one has more decimal parts than the other", () => {
            const chapters = [
                createChapter("10.1.2"),
                createChapter("10.1"),
                createChapter("10"),
            ];

            render(<RangeBtnPagination chapters={chapters} slug="one-piece"/>);

            const chapterButtons = screen.getAllByRole("button").filter((b) =>
                b.textContent?.includes("Chương")
            );
            expect(chapterButtons[0].textContent).toContain("10");
            expect(chapterButtons[1].textContent).toContain("10.1");
            expect(chapterButtons[2].textContent).toContain("10.1.2");
        });

        it("should fallback to 0 when pb has fewer parts than pa", () => {
            const chapters = [
                createChapter("10"),
                createChapter("10.1"),
            ];

            render(<RangeBtnPagination chapters={chapters} slug="one-piece"/>);

            const chapterButtons = screen.getAllByRole("button").filter((b) =>
                b.textContent?.includes("Chương")
            );
            expect(chapterButtons[0].textContent).toContain("10");
            expect(chapterButtons[1].textContent).toContain("10.1");
        });
    });
});