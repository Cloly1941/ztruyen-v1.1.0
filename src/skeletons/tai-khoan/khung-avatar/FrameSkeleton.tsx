// ** Shadcn ui
import {Skeleton} from "@/components/ui/skeleton";

export const FrameSkeleton = () => (
    <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
        {Array.from({length: 10}).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 py-4">
                <Skeleton className="size-16 rounded-full"/>
                <Skeleton className="h-3 w-18 rounded"/>
            </div>
        ))}
    </div>
)