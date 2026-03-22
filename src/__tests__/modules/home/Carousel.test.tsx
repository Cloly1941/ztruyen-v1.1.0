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

const mockPush = jest.fn();
jest.mock("next-nprogress-bar", () => ({
    useRouter: jest.fn(() => ({
        push: mockPush,
    })),
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
jest.mock("swiper/css/pagination", () => {});

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, className }: any) => (
        <a href={href} className={className}>{children}</a>
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
    default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

jest.mock("@/components/common/Button", () => ({
    __esModule: true,
    default: ({ children, onClick, className }: any) => (
        <button onClick={onClick} className={className}>{children}</button>
    ),
}));

jest.mock("@/skeletons/home/ListComicSkeleton", () => ({
    __esModule: true,
    default: () => <div data-testid="skeleton" />,
}));

jest.mock("@/utils/formatRelativeTime", () => ({
    __esModule: true,
    default: () => "1 giờ trước",
}));

jest.mock("@/utils/getIdFromUrl", () => ({
    __esModule: true,
    default: () => "abc123",
}));

jest.mock("@/configs/slug", () => ({
    CONFIG_SLUG: {
        HOME: "/",
        GENRE: "/the-loai",
        DETAIL: "/truyen-tranh",
        READING: "/doc-truyen",
        LIST: "/danh-sach",
    },
}));

// ** Hook
import useMounted from "@/hooks/common/useMounted";

// ** Module component
import Carousel from "@/modules/home/Carousel";

// ** Type
import { IOtruyenListComic } from "@/types/api.otruyen";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

const mockedUseMounted = useMounted as jest.MockedFunction<typeof useMounted>;

// =============================== Mock Data =============================//
const mockData: IOtruyenListComic[] = Array.from({ length: 5 }, (_, i) => ({
    _id: `${i + 1}`,
    name: `Comic ${i + 1}`,
    slug: `comic-${i + 1}`,
    origin_name: [`Origin ${i + 1}`],
    status: "ongoing",
    thumb_url: `thumb-${i + 1}.jpg`,
    sub_docquyen: false,
    category: [
        { _id: `cat${i}`, name: "Action", slug: "action" },
        { _id: `cat${i + 1}`, name: "Romance", slug: "romance" },
    ],
    updatedAt: "2024-01-01T00:00:00.000Z",
    chaptersLatest: [
        {
            filename: `chapter-${i + 1}`,
            chapter_name: `${i + 1}`,
            chapter_title: `Chương ${i + 1}`,
            chapter_api_data: `https://api.example.com/chapter/${i + 1}/abc123`,
        },
    ],
}));

// =============================== Tests =============================//
describe("Carousel", () => {
    describe("when not mounted", () => {
        it("should render skeleton when not mounted", () => {
            mockedUseMounted.mockReturnValue(false);

            render(<Carousel data={mockData} title="Test Title" />);

            expect(screen.getByTestId("skeleton")).toBeInTheDocument();
            expect(screen.queryByTestId("swiper")).not.toBeInTheDocument();
        });
    });

    describe("when mounted", () => {
        beforeEach(() => {
            mockedUseMounted.mockReturnValue(true);
        });

        // Render
        it("should render title correctly", () => {
            render(<Carousel data={mockData} title="Truyện mới nhất" />);

            expect(screen.getByText("Truyện mới nhất")).toBeInTheDocument();
        });

        it("should render desc when provided", () => {
            render(<Carousel data={mockData} title="Title" desc="Mô tả truyện" />);

            expect(screen.getByText("Mô tả truyện")).toBeInTheDocument();
        });

        it("should not render desc when not provided", () => {
            render(<Carousel data={mockData} title="Title" />);

            expect(screen.queryByText("Mô tả truyện")).not.toBeInTheDocument();
        });

        it("should apply bgColor class when bgColor is true", () => {
            const { container } = render(
                <Carousel data={mockData} title="Title" bgColor={true} />
            );

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.className).toContain("bg-[#f6f9ff]");
        });

        it("should not apply bgColor class when bgColor is false", () => {
            const { container } = render(
                <Carousel data={mockData} title="Title" bgColor={false} />
            );

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.className).not.toContain("bg-[#f6f9ff]");
        });

        // Swiper / Slides
        it("should render swiper with slides", () => {
            render(<Carousel data={mockData} title="Title" />);

            expect(screen.getByTestId("swiper")).toBeInTheDocument();
            expect(screen.getAllByTestId("swiper-slide")).toHaveLength(5);
        });

        it("should limit to 20 slides when data has more than 20 items", () => {
            const largeData: IOtruyenListComic[] = Array.from({ length: 30 }, (_, i) => ({
                ...mockData[0],
                _id: `${i + 1}`,
                name: `Comic ${i + 1}`,
                slug: `comic-${i + 1}`,
            }));

            render(<Carousel data={largeData} title="Title" />);

            expect(screen.getAllByTestId("swiper-slide")).toHaveLength(20);
        });

        // Title Slide
        it("should render comic names", () => {
            render(<Carousel data={mockData} title="Title" />);

            mockData.forEach((item) => {
                expect(screen.getByText(item.name)).toBeInTheDocument();
            });
        });

        it("should render correct detail link for each comic", () => {
            render(<Carousel data={mockData} title="Title" />);

            mockData.forEach((item) => {
                const link = screen.getByText(item.name).closest("a");
                expect(link).toHaveAttribute("href", `/${CONFIG_SLUG.DETAIL}/${item.slug}.html`);
            });
        });

        it("should render chapter tag with correct href", () => {
            render(<Carousel data={[mockData[0]]} title="Title" />);

            const chapterTag = screen.getByText("Chương 1");
            expect(chapterTag).toBeInTheDocument();
            expect(chapterTag).toHaveAttribute(
                "href",
                `/${CONFIG_SLUG.READING}/comic-1-chuong-1-abc123.html`
            );
        });

        it("should render category tags", () => {
            render(<Carousel data={[mockData[0]]} title="Title" />);

            const actionTags = screen.getAllByText("Action");
            expect(actionTags.length).toBeGreaterThan(0);
        });

        it("should render relative time", () => {
            render(<Carousel data={[mockData[0]]} title="Title" />);

            expect(screen.getByText("1 giờ trước")).toBeInTheDocument();
        });

        // Btns
        it("should render prev and next buttons", () => {
            render(<Carousel data={mockData} title="Title" />);

            const buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(2);
        });

        it("should call slidePrev when prev button is clicked", () => {
            const slidePrev = jest.fn();
            const slideNext = jest.fn();

            jest.spyOn(React, "useRef").mockReturnValueOnce({
                current: { slidePrev, slideNext },
            });

            render(<Carousel data={mockData} title="Title" />);

            fireEvent.click(screen.getAllByRole("button")[0]);
            expect(slidePrev).toHaveBeenCalled();
        });

        it("should call slideNext when next button is clicked", () => {
            const slidePrev = jest.fn();
            const slideNext = jest.fn();

            jest.spyOn(React, "useRef").mockReturnValueOnce({
                current: { slidePrev, slideNext },
            });

            render(<Carousel data={mockData} title="Title" />);

            fireEvent.click(screen.getAllByRole("button")[1]);
            expect(slideNext).toHaveBeenCalled();
        });

        // Router
        it("should navigate to detail page when overlay is clicked", () => {
            render(<Carousel data={[mockData[0]]} title="Title" />);

            const overlay = document.querySelector('[style*="linear-gradient"]') as HTMLElement;
            fireEvent.click(overlay);

            expect(mockPush).toHaveBeenCalledWith(`/${CONFIG_SLUG.DETAIL}/comic-1.html`);
        });

        // Swiper
        it("should set atBeginning true when swiper reaches beginning", () => {
            render(<Carousel data={mockData} title="Title" />);

            const { onReachBeginning } = mockSwiperImpl.mock.calls[0][0];
            act(() => onReachBeginning());

            expect(screen.getAllByRole("button")[0].className).toContain("hidden");
        });

        it("should set atEnd true when swiper reaches end", () => {
            render(<Carousel data={mockData} title="Title" />);

            const { onReachEnd } = mockSwiperImpl.mock.calls[0][0];
            act(() => onReachEnd());

            expect(screen.getAllByRole("button")[1].className).toContain("hidden");
        });

        it("should reset atBeginning and atEnd when swiper leaves edge", () => {
            render(<Carousel data={mockData} title="Title" />);

            const { onReachEnd, onFromEdge } = mockSwiperImpl.mock.calls[0][0];

            act(() => onReachEnd());
            expect(screen.getAllByRole("button")[1].className).toContain("hidden");

            act(() => onFromEdge());
            expect(screen.getAllByRole("button")[1].className).not.toContain("hidden");
            expect(screen.getAllByRole("button")[0].className).not.toContain("hidden");
        });

        it("should assign swiper instance to swiperRef via onBeforeInit", () => {
            render(<Carousel data={mockData} title="Title" />);

            const { onBeforeInit } = mockSwiperImpl.mock.calls[0][0];

            const mockSwiper = { slidePrev: jest.fn(), slideNext: jest.fn() };
            act(() => onBeforeInit(mockSwiper));

            fireEvent.click(screen.getAllByRole("button")[0]);
            expect(mockSwiper.slidePrev).toHaveBeenCalled();
        });
    });
});