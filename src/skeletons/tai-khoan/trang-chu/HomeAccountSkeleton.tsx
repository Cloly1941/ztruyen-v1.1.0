// ** Shadcn ui
import {Skeleton} from "@/components/ui/skeleton";

// ** Utils
import {cn} from "@/lib/utils";

type THomeAccountSkeletonProps = {
    name?: boolean
    className?: string
}

const HomeAccountSkeleton = ({name = false, className}: THomeAccountSkeletonProps) => {
    return (
        <div className="flex items-center gap-4">
            {/* Avatar skeleton */}
            <Skeleton className={cn("size-10 lg:size-14 rounded-full", className)}/>

            {/* Name skeleton */}
            {name && (
                <div className="flex flex-col justify-between">
                    <Skeleton className="h-4 w-28 lg:h-5 lg:w-40"/>
                </div>
            )}
        </div>
    )
}

export default HomeAccountSkeleton