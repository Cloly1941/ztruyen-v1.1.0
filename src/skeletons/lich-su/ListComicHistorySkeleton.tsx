// ** React
import React from 'react';

// ** Shadcn ui
import { Skeleton } from '@/components/ui/skeleton';

const ListComicHistorySkeleton = () => {
    return (
        <section className="min-h-[54vh] container pt-2 pb-20 animate-pulse">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-baseline">
                <div className="section-header gap-2.5 sm:gap-4 flex-col md:flex-row py-5 w-full">
                    <Skeleton className="h-6 w-56 rounded-md" />
                    <Skeleton className="h-4 w-80 rounded-md" />
                </div>

                <div className="flex gap-2">
                    <Skeleton className="h-8 w-28 rounded-md" />
                </div>
            </div>

            {/* Grid list */}
            <div className="mt-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-4 gap-2 md:gap-2.5 lg:gap-3 mb-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <figure key={i} className="flex flex-col relative">
                            {/* Image */}
                            <Skeleton className="aspect-[3/4] w-full rounded-lg" />

                            {/* Title */}
                            <div className="mt-2 space-y-1">
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-4/5 rounded" />
                            </div>

                            {/* Chapter */}
                            <Skeleton className="h-3 w-2/3 mt-2 rounded" />

                            {/* Delete icon */}
                            <div className="absolute right-1.5 top-1.5">
                                <Skeleton className="size-6 rounded-full" />
                            </div>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ListComicHistorySkeleton;