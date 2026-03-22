// ** Shadcn ui
import {Skeleton} from "@/components/ui/skeleton";

// ** Skeleton
import HeaderSkeleton from "@/skeletons/common/HeaderSkeleton";

const ListImageChapterSkeleton = () => {
    return (
        <>
            <HeaderSkeleton asChild/>
            <div className='flex flex-col items-center'>
                <Skeleton className='lg:w-[50%] h-screen'/>
            </div>
        </>
    )
}

export default ListImageChapterSkeleton;