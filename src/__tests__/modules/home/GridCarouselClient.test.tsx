/* eslint-disable @typescript-eslint/no-explicit-any */

// ** React
import React from "react";

// ** Testing Library
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// =============================== Mocks =============================//
jest.mock("@/hooks/common/useMounted", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockSwiperImpl = jest.fn(({ children }: any) => (
    <div data-testid="swiper">{children}</div>
));
jest.mock("swiper/react", () => ({
    Swiper: (props: any) => mockSwiperImpl(props),
    SwiperSlide: ({ children }: any) => (
        <div data-testid="swiper-slide">{children}</div>
    ),
}));

jest.mock("swiper/modules", () => ({
    Autoplay: {},
    Pagination: {},
}));

jest.mock("swiper/css", () => {});
jest.mock("swiper/css/grid", () => {});
jest.mock("swiper/css/pagination", () => {});

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, className }: any) => (
        <a href={href} className={className}>{children}</a>
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
    default: ({ children, onClick, className, shape }: any) => (
        <button onClick={onClick} className={className} data-shape={shape}>
            {children}
        </button>
    ),
}));

jest.mock("@/skeletons/home/GridCarouselSkeleton", () => ({
    __esModule: true,
    default: () => <div data-testid="grid-carousel-skeleton" />,
}));

import useMounted from "@/hooks/common/useMounted";
import GridCarouselClient from "@/modules/home/GridCarouselClient";
import { IOtruyenListComic } from "@/types/api.otruyen";

const mockedUseMounted = useMounted as jest.MockedFunction<typeof useMounted>;

// =============================== Mock Data =============================//
const createMockComic = (i: number): IOtruyenListComic => ({
    _id: `${i + 1}`,
    name: `Comic ${i + 1}`,
    slug: `comic-${i + 1}`,
    origin_name: [`Origin ${i + 1}`],
    status: "ongoing",
    thumb_url: `thumb-${i + 1}.jpg`,
    sub_docquyen: false,
    category: [{ _id: `cat${i}`, name: "Action", slug: "action" }],
    updatedAt: "2024-01-01T00:00:00.000Z",
    chaptersLatest: [
        {
            filename: `chapter-${i + 1}`,
            chapter_name: `${i + 1}`,
            chapter_title: `Chương ${i + 1}`,
            chapter_api_data: `https://api.example.com/chapter/${i + 1}/abc123`,
        },
    ],
});

// 16 items => 2 groups của 8
const mockData: IOtruyenListComic[] = Array.from({ length: 16 }, (_, i) =>
    createMockComic(i)
);

// =============================== Tests =============================//
describe("GridCarouselClient", () => {
    describe("when not mounted", () => {
        it("should render skeleton when not mounted", () => {
            mockedUseMounted.mockReturnValue(false);

            render(<GridCarouselClient data={mockData} />);

            expect(screen.getByTestId("grid-carousel-skeleton")).toBeInTheDocument();
            expect(screen.queryByTestId("swiper")).not.toBeInTheDocument();
        });
    });

    describe("when mounted", () => {
        beforeEach(() => {
            mockedUseMounted.mockReturnValue(true);
        });

        // Render
        it("should render swiper", () => {
            render(<GridCarouselClient data={mockData} />);

            expect(screen.getByTestId("swiper")).toBeInTheDocument();
        });

        it("should render wrapper with bg-black class", () => {
            const { container } = render(<GridCarouselClient data={mockData} />);

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.className).toContain("bg-black");
        });

        // chunkArray / Slides
        it("should chunk data into groups of 8 and render correct slides", () => {
            render(<GridCarouselClient data={mockData} />);

            // 16 items => 2 slides
            expect(screen.getAllByTestId("swiper-slide")).toHaveLength(2);
        });

        it("should render 1 slide when data has 8 or fewer items", () => {
            const smallData = Array.from({ length: 8 }, (_, i) => createMockComic(i));
            render(<GridCarouselClient data={smallData} />);

            expect(screen.getAllByTestId("swiper-slide")).toHaveLength(1);
        });

        it("should render 3 slides when data has 24 items", () => {
            const largeData = Array.from({ length: 24 }, (_, i) => createMockComic(i));
            render(<GridCarouselClient data={largeData} />);

            expect(screen.getAllByTestId("swiper-slide")).toHaveLength(3);
        });

        it("should render empty swiper when data is empty", () => {
            render(<GridCarouselClient data={[]} />);

            expect(screen.getByTestId("swiper")).toBeInTheDocument();
            expect(screen.queryByTestId("swiper-slide")).not.toBeInTheDocument();
        });

        //  Comic links và images
        it("should render correct href for each comic", () => {
            const singleSlideData = Array.from({ length: 8 }, (_, i) =>
                createMockComic(i)
            );
            render(<GridCarouselClient data={singleSlideData} />);

            singleSlideData.forEach((item) => {
                const link = screen.getByTitle(item.name).closest("a");
                expect(link).toHaveAttribute("href", `/truyen-tranh/${item.slug}.html`);
            });
        });

        it("should render comic images with correct alt and title", () => {
            const singleSlideData = Array.from({ length: 8 }, (_, i) =>
                createMockComic(i)
            );
            render(<GridCarouselClient data={singleSlideData} />);

            singleSlideData.forEach((item) => {
                const img = screen.getByAltText(item.name);
                expect(img).toBeInTheDocument();
                expect(img).toHaveAttribute("title", item.name);
            });
        });

        //  Buttons
        it("should render prev and next buttons", () => {
            render(<GridCarouselClient data={mockData} />);

            const buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(2);
        });

        it("should call slidePrev when prev button is clicked", () => {
            const slidePrev = jest.fn();
            const slideNext = jest.fn();

            jest.spyOn(React, "useRef").mockReturnValueOnce({
                current: { slidePrev, slideNext },
            });

            render(<GridCarouselClient data={mockData} />);

            fireEvent.click(screen.getAllByRole("button")[0]);
            expect(slidePrev).toHaveBeenCalled();
        });

        it("should call slideNext when next button is clicked", () => {
            const slidePrev = jest.fn();
            const slideNext = jest.fn();

            jest.spyOn(React, "useRef").mockReturnValueOnce({
                current: { slidePrev, slideNext },
            });

            render(<GridCarouselClient data={mockData} />);

            fireEvent.click(screen.getAllByRole("button")[1]);
            expect(slideNext).toHaveBeenCalled();
        });

        //  onBeforeInit
        it("should assign swiper instance to swiperRef via onBeforeInit", () => {
            render(<GridCarouselClient data={mockData} />);

            const { onBeforeInit } = mockSwiperImpl.mock.calls[0][0];
            const mockSwiper = { slidePrev: jest.fn(), slideNext: jest.fn() };

            act(() => onBeforeInit(mockSwiper));

            fireEvent.click(screen.getAllByRole("button")[0]);
            expect(mockSwiper.slidePrev).toHaveBeenCalled();
        });

        //  Swiper props
        it("should pass loop and autoplay props to swiper", () => {
            render(<GridCarouselClient data={mockData} />);

            const swiperProps = mockSwiperImpl.mock.calls[0][0];
            expect(swiperProps.loop).toBe(true);
            expect(swiperProps.autoplay).toEqual({
                delay: 4500,
                disableOnInteraction: false,
            });
        });

        it("should pass correct spaceBetween to swiper", () => {
            render(<GridCarouselClient data={mockData} />);

            const swiperProps = mockSwiperImpl.mock.calls[0][0];
            expect(swiperProps.spaceBetween).toBe(6);
        });

        it("should pass pagination clickable true to swiper", () => {
            render(<GridCarouselClient data={mockData} />);

            const swiperProps = mockSwiperImpl.mock.calls[0][0];
            expect(swiperProps.pagination).toEqual({ clickable: true });
        });
    });
});