// ** Shadcn ui
import {Skeleton} from '@/components/ui/skeleton';

const ListComicSkeleton = ({bgColor = false}: { bgColor?: boolean }) => {
    return (
        <div className={`${bgColor ? 'bg-[#f6f9ff] dark:bg-black' : ''}`}>
            <section className="section-home">
                {/* Header */}
                <div className="section-header mb-5">
                    <Skeleton className="w-[125px] sm:w-[160px] lg:w-[200px] h-7 sm:h-8 lg:h-[36px] mb-2"/>
                    <Skeleton className="w-[207px] sm:w-[241px] h-4 sm:h-5"/>
                </div>

                {/* List */}
                <div className="relative">
                    <div
                        className="
                                grid grid-flow-col
                                gap-1.5 sm:gap-2 md:gap-[10px] lg:gap-3
                                [grid-auto-columns:calc((100%-2*6px)/3)]
                                sm:[grid-auto-columns:calc((100%-2*8px)/3)]
                                md:[grid-auto-columns:calc((100%-3*10px)/4)]
                                lg:[grid-auto-columns:calc((100%-4*12px)/5)] overflow-hidden"
                    >
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex flex-col">
                                <figure className="flex flex-col gap-1.5">

                                    <Skeleton className="aspect-[3/4] w-full rounded-lg"/>

                                    <Skeleton className="h-5 md:h-6 w-[90%] rounded-md mt-1.5 sm:mt-2.5 sm:mb-1"/>

                                    <Skeleton className="h-[13.6px] sm:h-4 md:h-5 w-[60%] rounded-md"/>
                                </figure>
                            </div>
                        ))}
                    </div>

                    <Skeleton
                        className="btn-carousel-skeleton bg-accent -right-6 sm:-right-[34px] size-12 sm:size-[60px] md:size-[64px] lg:size-[74px] rounded-full"/>
                </div>
            </section>
        </div>
    );
};

export default ListComicSkeleton;
