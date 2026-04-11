'use client'

// ** Layout component
import Search from "@/layouts/components/Header/Search/index";

// ** Hooks
import useTailwindBreakpoints from "@/hooks/common/useTailwindBreakpoints";
import useMounted from "@/hooks/common/useMounted";

// ** Skeleton
import SearchSkeleton from "@/skeletons/layouts/SearchSkeleton";

const SearchWrapper = () => {

    const mount = useMounted()
    const {isSm} = useTailwindBreakpoints()

    if (!mount) return <SearchSkeleton/>

    if (isSm) return (
        <Search/>
    )
}

export default SearchWrapper