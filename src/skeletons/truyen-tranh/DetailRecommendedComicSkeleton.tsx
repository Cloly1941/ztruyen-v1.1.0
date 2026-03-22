// ** Skeleton
import {Skeleton} from "@/components/ui/skeleton";

const DetailRecommendedComicSkeleton = () => {
    return (
        <section className="bg-section-detail p-5 lg:w-[29%] xl:w-[23%] h-min">
            <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2'>
                {Array.from({ length: 6 }).map((_, index) => (
                    <li key={index} className="flex mt-4 gap-3">
                        {/* Thumbnail */}
                        <div className="lg:w-[35%]">
                            <Skeleton className="w-[135px] h-[180px] lg:w-full lg:h-auto  aspect-[3/4] rounded-[2px]" />
                        </div>

                        {/* Content */}
                        <div className="w-[64%] flex flex-col justify-between">
                            {/* Title */}
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-1">
                                <Skeleton className="size-3.5 rounded-full" />
                                <Skeleton className="h-3 w-16" />
                            </div>

                            {/* Chapter */}
                            <div className="flex items-center gap-1">
                                <Skeleton className="size-3.5 rounded-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default DetailRecommendedComicSkeleton;