// ** shadcn ui
import { Skeleton } from '@/components/ui/skeleton';

const NavbarGenreSkeleton = () => {
    return (
        <nav className="bg-black/90 flex justify-center py-3.5 sm:py-5">
            <ul className="flex sm:gap-7 gap-5 container justify-center">
                {[...Array(9)].map((_, index) => (
                    <li
                        key={index}
                        className={`${
                            index + 1 === 7 || index + 1 === 8
                                ? 'hidden lg:block'
                                : index + 1 === 5 || index + 1 === 6
                                    ? 'hidden sm:block'
                                    : 'block'
                        }`}
                    >
                        <Skeleton className="h-3 sm:h-4 w-10 sm:w-12" />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavbarGenreSkeleton;
