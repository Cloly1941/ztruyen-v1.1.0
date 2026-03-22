// ** Shadcn ui
import { Skeleton } from "@/components/ui/skeleton"

const ListSearchComicSkeleton = () => {
    return (
        <section className="section-list-comic">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-9">
                {Array.from({ length: 24 }).map((_, index) => (
                    <div key={index} className="flex gap-4">

                        {/* Thumbnail */}
                        <Skeleton className="h-[180px] aspect-[3/4] rounded-md" />

                        <div className="w-[180px] flex flex-col justify-between">

                            {/* Title */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>

                            {/* Chapter */}
                            <Skeleton className="h-3 w-1/2 mt-2" />

                            {/* Status + Author */}
                            <div className="space-y-2 mt-3">
                                <Skeleton className="h-3 w-1/3" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ListSearchComicSkeleton