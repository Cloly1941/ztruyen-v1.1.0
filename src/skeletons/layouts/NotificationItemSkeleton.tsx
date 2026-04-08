// ** Shadcn ui
import {Skeleton} from "@/components/ui/skeleton";

const NotificationItemSkeleton = () => {
    return (
        <>
            {Array.from({length: 2}).map((_, i) => (
                <div key={i} className='flex gap-3 items-start py-2 px-2'>
                    <div className='relative flex-shrink-0'>
                        <Skeleton className='size-14 rounded-full'/>
                        <Skeleton className='absolute -bottom-1 -right-1 rounded-full size-6'/>
                    </div>
                    <div className='flex flex-col gap-2 flex-1 pt-1'>
                        <Skeleton className='h-3 w-3/4'/>
                        <Skeleton className='h-3 w-full'/>
                        <Skeleton className='h-3 w-1/2'/>
                        <Skeleton className='h-2 w-16 mt-1'/>
                    </div>
                </div>
            ))}
        </>
    );
};

export default NotificationItemSkeleton;