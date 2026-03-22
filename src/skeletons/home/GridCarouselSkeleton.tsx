// ** shadcn ui
import { Skeleton } from '@/components/ui/skeleton';

const GridCarouselSkeleton = () => {
    const gridPositions = [
        'col-span-2 row-span-6',
        'row-span-3 col-start-3',
        'row-span-3 col-start-3 row-start-4',
        'row-span-3 col-start-6 row-start-1',
        'row-span-3 col-start-6 row-start-4',
        'col-span-2 row-span-6 col-start-4 row-start-1',
        'row-span-3 col-start-7 row-start-1',
        'row-span-3 col-start-7 row-start-4',
    ];

    const gridPositionsDesktop = [
        // Slide 1 - cols 1-7
        'col-span-2 row-span-6 col-start-1 row-start-1',
        'row-span-3 col-start-3 row-start-1',
        'row-span-3 col-start-3 row-start-4',
        'row-span-3 col-start-6 row-start-1',
        'row-span-3 col-start-6 row-start-4',
        'col-span-2 row-span-6 col-start-4 row-start-1',
        'row-span-3 col-start-7 row-start-1',
        'row-span-3 col-start-7 row-start-4',

        // Slide 2 (visible ~0.5) - cols 8-13
        'col-span-2 row-span-6 col-start-8 row-start-1',
        'row-span-3 col-start-10 row-start-1',
        'row-span-3 col-start-10 row-start-4',
        'col-span-2 row-span-6 col-start-11 row-start-1',
    ];

    return (
        <div className="bg-black relative py-2">
            <div className="grid md:hidden grid-cols-7 grid-rows-6 gap-0.5">
                {gridPositions.map((position, index) => (
                    <div
                        key={index}
                        className={`${position} relative`}
                    >
                        <Skeleton className="aspect-[3/4] size-full rounded-[2px]" />
                    </div>
                ))}
            </div>
            <div className="hidden md:grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-6 gap-1.5 overflow-hidden">
                {gridPositionsDesktop.map((pos, i) => (
                    <div key={i} className={`${pos} relative`}>
                        <Skeleton className="aspect-[3/4] size-full rounded-[2px]" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridCarouselSkeleton;