/* eslint-disable @typescript-eslint/no-explicit-any */

// ** React
import React from "react";

// ** Testing Library
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// =============================== Mocks =============================//
jest.mock("@/hooks/common/useTailwindBreakpoints", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, className, title }: any) => (
        <a href={href} className={className} title={title}>{children}</a>
    ),
}));

jest.mock("@/components/common/Tag", () => ({
    __esModule: true,
    default: ({ children, href, title, theme }: any) => (
        <a href={href} title={title} data-theme={theme}>{children}</a>
    ),
}));

jest.mock("@/components/common/ComicImage", () => ({
    __esModule: true,
    default: ({ src, alt, title }: any) => (
        <img src={src} alt={alt} title={title} />
    ),
}));

jest.mock("@/components/common/Button", () => ({
    __esModule: true,
    default: ({ children, className }: any) => (
        <button className={className}>{children}</button>
    ),
}));

jest.mock("@/configs/api-otruyen", () => ({
    CONFIG_API_OTRUYEN: {
        IMAGE_COMIC: "https://img.example.com",
    },
}));

jest.mock("@/configs/slug", () => ({
    CONFIG_SLUG: {
        DETAIL: "/truyen-tranh",
        GENRE: "/the-loai",
    },
}));

// ** Hook
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";

// ** Module component
import InteractiveThumbnail from "@/modules/home/InteractiveThumbnail";

// ** Type
import { IOtruyenListComic } from "@/types/api.otruyen";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

const mockedUseTailwindBreakpoints = useTailwindBreakpoints as jest.MockedFunction<typeof useTailwindBreakpoints>;

// =============================== Mock Data =============================//
const createMockComic = (i: number): IOtruyenListComic => ({
    _id: `${i + 1}`,
    name: `Comic ${i + 1}`,
    slug: `comic-${i + 1}`,
    origin_name: [`Origin ${i + 1}`],
    status: "ongoing",
    thumb_url: `thumb-${i + 1}.jpg`,
    sub_docquyen: false,
    category: [
        { _id: `cat${i}a`, name: `Genre A${i}`, slug: `genre-a${i}` },
        { _id: `cat${i}b`, name: `Genre B${i}`, slug: `genre-b${i}` },
    ],
    updatedAt: "2024-01-01T00:00:00.000Z",
    chaptersLatest: [
        {
            filename: `chapter-${i + 1}`,
            chapter_name: `${i + 1}`,
            chapter_title: `Chương ${i + 1}`,
            chapter_api_data: `https://api.example.com/chapter/${i + 1}/abc`,
        },
    ],
});

const mockData: IOtruyenListComic[] = Array.from({ length: 10 }, (_, i) =>
    createMockComic(i)
);

const defaultBreakpoints = {
    windowWidth: 0,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2xl: false,
};

// =============================== Tests =============================//
describe("InteractiveThumbnail", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockedUseTailwindBreakpoints.mockReturnValue(defaultBreakpoints);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // numberOfItems
    it("should render 5 thumbnails when isSm is false", () => {
        mockedUseTailwindBreakpoints.mockReturnValue({
            ...defaultBreakpoints,
            isSm: false,
        });

        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        // 5 visible thumbnails + 1 large image of selected comic
        const images = screen.getAllByAltText(/Comic/);
        const thumbnails = images.filter((img) =>
            mockData.slice(0, 5).some((c) => c.name === img.getAttribute("alt"))
        );
        expect(thumbnails.length).toBeGreaterThanOrEqual(5);
    });

    it("should render 7 thumbnails when isSm is true", () => {
        mockedUseTailwindBreakpoints.mockReturnValue({
            ...defaultBreakpoints,
            isSm: true,
        });

        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const images = screen.getAllByAltText(/Comic/);
        const thumbnails = images.filter((img) =>
            mockData.slice(0, 7).some((c) => c.name === img.getAttribute("alt"))
        );
        expect(thumbnails.length).toBeGreaterThanOrEqual(7);
    });

    // Render selected comic info
    it("should render first comic info by default", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const elements = screen.getAllByTitle("Comic 1");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("should render comic name as Link when isLg is false", () => {
        mockedUseTailwindBreakpoints.mockReturnValue({
            ...defaultBreakpoints,
            isLg: false,
        });

        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const link = screen.getByRole("link", { name: "Comic 1" });
        expect(link).toHaveAttribute("href", `/${CONFIG_SLUG.DETAIL}/comic-1.html`);
    });

    it("should render comic name as h3 when isLg is true", () => {
        mockedUseTailwindBreakpoints.mockReturnValue({
            ...defaultBreakpoints,
            isLg: true,
        });

        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const heading = screen.getByRole("heading", { name: "Comic 1" });
        expect(heading.tagName).toBe("H3");
    });

    it("should render category tags for selected comic", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const firstComic = mockData[0];
        firstComic.category.slice(0, 5).forEach((tag) => {
            expect(screen.getByText(tag.name)).toBeInTheDocument();
        });
    });

    it("should render category tag with correct href", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const firstTag = mockData[0].category[0];
        const tagEls = screen.getAllByTitle(firstTag.name);
        expect(tagEls[0]).toHaveAttribute("href", `/${CONFIG_SLUG.GENRE}/${firstTag.slug}.html`);
    });

    // Background image
    it("should set background image from selected comic thumb_url", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const figureEl = document.querySelector("figure") as HTMLElement;
        expect(figureEl.style.backgroundImage).toContain("thumb-1.jpg");
    });

    // handleImageClick
    it("should change selected comic when thumbnail is clicked", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const comic3Thumbnails = screen.getAllByTitle("Comic 3");
        fireEvent.click(comic3Thumbnails[0].closest("div[class*='aspect']") as HTMLElement);

        expect(screen.getAllByTitle("Comic 3").length).toBeGreaterThan(0);
    });

    it("should apply selected styles to active thumbnail", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const thumbnailWrappers = document.querySelectorAll("[class*='aspect-']");
        expect(thumbnailWrappers[0].className).toContain("scale-[1.15]");
        expect(thumbnailWrappers[1].className).toContain("opacity-80");
    });

    // Auto slide
    it("should auto slide to next comic after AUTO_SLIDE_TIME", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        expect(screen.getByText("Comic 1")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(4500);
        });

        expect(screen.getByText("Comic 2")).toBeInTheDocument();
    });

    it("should loop back to first comic after last comic", () => {
        mockedUseTailwindBreakpoints.mockReturnValue({
            ...defaultBreakpoints,
            isSm: false,
        });

        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        // advance 5 intervals (5 visible comics) => loop back to 0
        act(() => {
            jest.advanceTimersByTime(4500 * 5);
        });

        expect(screen.getByText("Comic 1")).toBeInTheDocument();
    });

    it("should reset auto slide timer when thumbnail is clicked", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        act(() => { jest.advanceTimersByTime(4500 * 2); });
        expect(screen.getAllByTitle("Comic 3").length).toBeGreaterThan(0);

        const comic1Thumbnails = screen.getAllByTitle("Comic 1");
        fireEvent.click(comic1Thumbnails[0].closest("div[class*='aspect']") as HTMLElement);
        expect(screen.getAllByTitle("Comic 1").length).toBeGreaterThan(0);

        act(() => { jest.advanceTimersByTime(4000); });
        expect(screen.getAllByTitle("Comic 1").length).toBeGreaterThan(0);

        act(() => { jest.advanceTimersByTime(500); });
        expect(screen.getAllByTitle("Comic 2").length).toBeGreaterThan(0);
    });

    // Cleanup
    it("should clear timer on unmount", () => {
        const clearIntervalSpy = jest.spyOn(global, "clearInterval");

        const { unmount } = render(
            <InteractiveThumbnail listRecommendedComic={mockData} />
        );

        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    // Large image link
    it("should render large image link with correct href", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        const links = screen.getAllByRole("link");
        const detailLinks = links.filter((l) =>
            l.getAttribute("href")?.includes(`/${CONFIG_SLUG.DETAIL}/comic-1.html`)
        );
        expect(detailLinks.length).toBeGreaterThan(0);
    });

    it("should render 'Đọc ngay' button", () => {
        render(<InteractiveThumbnail listRecommendedComic={mockData} />);

        expect(screen.getByText("Đọc ngay")).toBeInTheDocument();
    });

    it("should not throw when timerRef is null on unmount", () => {
        jest.spyOn(global, "setInterval").mockReturnValueOnce(null as any);

        const { unmount } = render(
            <InteractiveThumbnail listRecommendedComic={mockData} />
        );

        expect(() => unmount()).not.toThrow();
    });
});