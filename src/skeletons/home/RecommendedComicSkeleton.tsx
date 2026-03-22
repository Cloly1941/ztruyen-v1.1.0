import {Skeleton} from '@/components/ui/skeleton';

const RecommendedComicSkeleton = () => {
    return (
        <section className="section-home">
            <div className="section-header py-5">
                <Skeleton className="w-[125px] sm:w-[160px] lg:w-[200px] h-7 sm:h-8 lg:h-[36px]"/>
                <Skeleton className="w-[207px] sm:w-[241px] h-4 sm:h-5"/>
            </div>
            <figure
                className="rounded-2xl bg-black p-6 flex flex-col justify-between relative h-[280px] sm:h-[300px]">
                <div className="z-10 w-[49%]">
                    <Skeleton className="w-[270px] sm:w-[310px] md:w-[320px] lg:w-[323px] h-6"/>

                    <ul className="flex gap-1 sm:gap-2 md:gap-2.5 lg:gap-3 items-center lg:overflow-hidden mt-5">
                        {[...Array(4)].map((_, index) => (
                            <li
                                key={index}
                                className="rounded-sm text-white text-xs h-[20px] py-[1px] px-1.5 flex-shrink-0"
                            >
                                <Skeleton className="h-4 w-[40px] lg:w-[49px]"/>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="h-[1px] bg-gray-500 lg:w-[49%] z-10"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end z-10">
                    <div
                        className="grid grid-flow-col auto-cols-[calc(100%/5-10px)] sm:auto-cols-[calc(100%/7-12px)] gap-3 overflow-hidden">
                        {[...Array(7)].map((_, index) => (
                            <div
                                key={index}
                                className="aspect-[3/4] rounded-[5px] overflow-hidden cursor-pointer"
                            >
                                <Skeleton className="object-cover size-full"/>
                            </div>
                        ))}
                    </div>

                    <div
                        className="hidden lg:block rounded-2xl overflow-hidden aspect-video absolute right-6 -top-8 w-[45%]">
                        <Skeleton className="object-cover size-full"/>
                    </div>
                </div>

                <div className="absolute inset-0 bg-[#1b2022f2] rounded-2xl"></div>
            </figure>
        </section>
    )
}

export default RecommendedComicSkeleton;