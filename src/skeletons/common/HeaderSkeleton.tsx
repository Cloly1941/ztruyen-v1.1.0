// ** Skeleton
import { Skeleton } from '@/components/ui/skeleton';

const HeaderSkeleton = ({ asChild = false }: { asChild?: boolean }) => {
    return (
        <div className="shadow-layout z-40 fixed left-0 top-0 right-0 bg-background">
            <div className="container flex justify-between items-center py-2.5 font-medium text-header">
                {/* Left */}
                <div className="flex items-center gap-10">
                    {/* Logo */}
                    <Skeleton className="h-8 w-28 rounded-md" />

                    {/* NavHeader */}
                    {!asChild && (
                        <div className="hidden md:flex gap-4">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-14" />
                            <Skeleton className="h-5 w-18" />
                        </div>
                    )}
                </div>

                {/* Center slot (asChild) */}
                {asChild && (
                    <Skeleton className="h-5 w-[260px] hidden md:block" />
                )}

                {/* Right */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    {!asChild && <Skeleton className="h-9 w-56 hidden lg:block" />}

                    {/* Reading history */}
                    <Skeleton className="h-9 w-9 rounded-full" />

                    {/* Mode toggle */}
                    <Skeleton className="h-9 w-9 rounded-full hidden xl:block" />

                    {/* Account / Login */}
                    <Skeleton className="h-5 w-20 hidden xl:block" />

                    {/* Mobile menu */}
                    <Skeleton className="h-9 w-9 rounded-md xl:hidden" />
                </div>
            </div>
        </div>
    );
};

export default HeaderSkeleton;