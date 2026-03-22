// ** Next
import {Metadata} from "next";

// ** React
import {Suspense} from "react";

// ** Layout components
import DefaultLayout from "@/layouts/DefaultLayout";

// ** Module component
import GridCarousel from "@/modules/home/GridCarousel";
import NavbarGenre from "@/modules/home/NavbarGenre";
import RecommendedComic from "@/modules/home/RecommendedComic";
import GenderComicO from "@/modules/home/GenderComicO";
import GenderComicTw from "@/modules/home/GenderComicTw";
import GenderComicTh from "@/modules/home/GenderComicTh";

// ** Skeletons
import NavbarGenreSkeleton from "@/skeletons/home/NavbarGenreSkeleton";
import RecommendedComicSkeleton from "@/skeletons/home/RecommendedComicSkeleton";
import GridCarouselSkeleton from "@/skeletons/home/GridCarouselSkeleton";
import ListComicSkeleton from "@/skeletons/home/ListComicSkeleton";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_YOUR_WEBSITE || ''),
    title: 'Đọc truyện tranh Manhwa, Manga, Manhua Online - Ztruyện ',
    description:
        'Web đọc truyện tranh manhwa, manhua, manga, ngôn tình, tiên hiệp, kiếm hiệp online hay và mới nhất cập nhật liên tục tại ztruyen.io.vn',
    keywords: [
        'doc truyen tranh',
        'manga',
        'doc manga',
        'ngon tinh',
        'tien hiep',
    ],
    alternates: {
        canonical: `/`,
        languages: {
            vi: '/vi',
        },
    },
};

export default function Home() {
    return (
        <DefaultLayout>
            <Suspense fallback={<GridCarouselSkeleton/>}>
                <GridCarousel/>
            </Suspense>

            <Suspense fallback={<NavbarGenreSkeleton/>}>
                <NavbarGenre/>
            </Suspense>
            
            <Suspense fallback={<RecommendedComicSkeleton/>}>
                <RecommendedComic/>
            </Suspense>

            <Suspense fallback={<ListComicSkeleton bgColor/>}>
                <GenderComicO />
            </Suspense>

            <Suspense fallback={<ListComicSkeleton />}>
                <GenderComicTw />
            </Suspense>

            <Suspense fallback={<ListComicSkeleton bgColor/>}>
                <GenderComicTh />
            </Suspense>

        </DefaultLayout>
    );
}
