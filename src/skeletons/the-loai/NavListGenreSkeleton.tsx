// ** Shadcn ui
import { Skeleton } from "@/components/ui/skeleton";

const NavListGenreSkeleton = () => {
    return (
        <nav className="container flex gap-4 pt-6 pb-3">
            <Skeleton className="flex-shrink-0 h-[20px] w-[60px]"/>
            <ul className="flex gap-2 flex-wrap sm:hidden">
                {Array.from({ length: 12 }).map((_, index) => (
                    <li key={index}>
                        <Skeleton className="h-[22.5px] w-[70px] rounded-[5px]" />
                    </li>
                ))}
            </ul>

            <ul className="hidden sm:flex gap-2 flex-wrap">
                {Array.from({ length: 67 }).map((_, index) => (
                    <li key={index}>
                        <Skeleton className="h-[20px] w-[70px] rounded-[5px]" />
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavListGenreSkeleton;