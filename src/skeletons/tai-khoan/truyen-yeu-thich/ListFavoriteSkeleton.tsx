// ** Skeleton
import {Skeleton} from "@/components/ui/skeleton";

const ListFavoriteSkeleton = () => {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-2 md:gap-2.5 lg:gap-3 mb-4">
            {Array.from({length: 10}).map((_, index) => (
                <div key={index} className="flex flex-col">
                    <Skeleton className="aspect-[3/4] w-full rounded"/>
                    <div className="mt-1.5">
                        <Skeleton className="h-5"/>
                        <Skeleton className="h-5 w-28"/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListFavoriteSkeleton