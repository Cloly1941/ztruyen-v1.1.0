// ** Shadcn ui
import {Skeleton} from "@/components/ui/skeleton"

const SearchComicItemSkeleton = () => {
    return (
        <div className='mt-4'>
            {[...Array(3)].map((_, index) => (
                <div className='px-2 py-1.5 mb-2' key={index}>
                    <div className="flex gap-4 mx-3">
                        {/* Thumbnail */}
                        <Skeleton className="h-[180px] aspect-[3/4] rounded-md"/>

                        <div className="w-[180px] flex flex-col justify-between">

                            {/* Title */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-5/6"/>
                                <Skeleton className="h-4 w-2/3"/>
                            </div>

                            {/* Chapter */}
                            <Skeleton className="h-3 w-1/2 mt-2"/>

                            {/* Status + Author */}
                            <div className="space-y-2 mt-3">
                                <Skeleton className="h-3 w-1/3"/>
                                <Skeleton className="h-3 w-2/3"/>
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SearchComicItemSkeleton