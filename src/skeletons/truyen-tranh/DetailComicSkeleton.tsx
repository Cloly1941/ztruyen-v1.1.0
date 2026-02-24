// ** Shadcn ui
import { Skeleton } from '@/components/ui/skeleton'

// ** Skeleton
import ListChapterSkeleton from "@/skeletons/truyen-tranh/ListChapterSkeleton";
import DetailRecommendedComicSkeleton from "@/skeletons/truyen-tranh/DetailRecommendedComicSkeleton";

const DetailComicSkeleton = () => {
    return (
        <div className="bg-[#fafafa] dark:bg-background pt-5 pb-20 min-h-screen">
            <section className="bg-section-detail container flex flex-col items-center md:items-stretch md:flex-row gap-4 md:gap-7 p-5">

                {/* Comic Image */}
                <Skeleton className="w-[192.7px] h-[256.93px] sm:w-[192.7px] sm:h-[258px] rounded-sm shrink-0" />

                {/* Right Content */}
                <div className="flex flex-col justify-between w-full">
                    {/* Title */}
                    <Skeleton className="h-8 w-3/4 md:w-2/3 mx-auto md:mx-0" />

                    {/* Meta list */}
                    <div className="flex flex-col mt-4 gap-3 md:gap-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-center gap-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full hidden md:block" />
                        <Skeleton className="h-4 w-5/6 hidden md:block" />
                        <Skeleton className="h-16 w-full block md:hidden" />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-[41px] rounded-md" />
                    </div>
                </div>
            </section>
            <div className="container flex flex-col justify-between gap-4 lg:gap-0 lg:flex-row mt-3">
                <section className='p-5 lg:w-[70%] xl:w-[76%] h-min bg-section-detail'>
                    <Skeleton className="h-7 w-36 rounded-md" />
                    <ListChapterSkeleton/>
                </section>
                <DetailRecommendedComicSkeleton/>
            </div>
        </div>
    )
}

export default DetailComicSkeleton
