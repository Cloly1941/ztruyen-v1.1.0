'use client';

// ** React
import {useState} from 'react';

// ** Shadcn ui
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

// ** Component
import ComicItemHorizontal from "@/components/common/ComicItemHorizontal";

// ** Lucide Icon
import {SearchIcon} from 'lucide-react';

// ** Hooks
import useInfiniteLoadOtruyen from "@/hooks/common/useInfiniteLoadOtruyen";
import useSentinel from "@/hooks/common/useSentinel";
import {useDebounce} from "@/hooks/common/useDebounce";

// ** Services
import {getListBySearch} from "@/services/api-otruyen/search";

// ** Types
import {IOtruyenSearchComic} from "@/types/api.otruyen";

// ** Skeleton
import SearchComicItemSkeleton from "@/skeletons/layouts/SearchComicItemSkeleton";

type TSearch = {
    isSheet?: boolean;
}

const Search = ({isSheet = false}: TSearch) => {

    const [open, setOpen] = useState(false)

    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 500);

    const {data, isLoading, totalItems, loadMore, isValidating} = useInfiniteLoadOtruyen<IOtruyenSearchComic>({
        key: `search-${debouncedKeyword}`,
        api: (page) => getListBySearch(debouncedKeyword, page),
        enabled: open && !!debouncedKeyword,
    });

    const {sentinelRef} = useSentinel({onIntersect: loadMore});

    return (
        <div className="flex flex-col gap-4" onClick={(e) => isSheet && e.stopPropagation()}>
            {isSheet ? (
                <div onClick={() => setOpen(true)} className='hover:text-primary py-2 pl-3 flex items-center gap-2'>
                    <SearchIcon className='size-4'/>
                    <span>Tìm kiếm truyện</span>
                </div>
            ) : (
                <InputGroup
                    className="max-w-[180px] h-8 rounded-full border border-zinc-300 dark:border-zinc-600 bg-transparent hover:border-zinc-400 dark:hover:border-zinc-400 transition-colors"
                    onClick={() => setOpen(true)}
                >
                    <InputGroupInput
                        className="text-[13px] placeholder:text-[13px] placeholder:text-zinc-600 dark:placeholder:text-zinc-400"
                        placeholder="Tìm tên truyện..."
                    />
                    <InputGroupAddon>
                        <SearchIcon className='size-4 text-zinc-400 dark:text-zinc-600'/>
                    </InputGroupAddon>
                </InputGroup>
            )}


            <CommandDialog
                className='top-[10%] translate-y-0 md:!max-w-2xl'
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) setKeyword('');
                }}
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Tìm kiếm tên truyện..."
                        value={keyword}
                        onValueChange={setKeyword}
                        className='text-[13px] placeholder:text-[13px] placeholder:text-zinc-600 dark:placeholder:text-zinc-400'
                    />
                    {keyword && data.length > 0 && (
                        <div className='text-setting text-sm py-2 ml-3'>
                            {`Hiển thị ${data.length} / ${totalItems} kết quả cho "${keyword}"`}
                        </div>
                    )}
                    <CommandList className='max-h-[60vh] overflow-y-auto'>
                        {!debouncedKeyword && (
                            <CommandEmpty>Nhập từ khoá để tìm kiếm truyện nhé _(:з」∠)_</CommandEmpty>
                        )}
                        {debouncedKeyword && isLoading && (
                            <SearchComicItemSkeleton/>
                        )}
                        {debouncedKeyword && !isLoading && data.length === 0 && (
                            <CommandEmpty>Không tìm thấy truyện nào với từ
                                khoá &quot;{debouncedKeyword}&quot;</CommandEmpty>
                        )}
                        {debouncedKeyword && data.length > 0 && (
                            <CommandGroup>
                                {data.map((item, index) => (
                                    <CommandItem
                                        key={`${item.slug}-${index}`}
                                        className='border mb-2'
                                    >
                                        <ComicItemHorizontal
                                            slug={item.slug}
                                            name={item.name}
                                            chapterApiData={item?.chaptersLatest?.[0]?.chapter_api_data}
                                            chapterName={item?.chaptersLatest?.[0]?.chapter_name}
                                            status={item.status}
                                            author={item.author}
                                            thumbUrl={item.thumb_url}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {isValidating && !isLoading && (
                            <SearchComicItemSkeleton/>
                        )}
                        <div ref={sentinelRef}/>
                    </CommandList>
                </Command>
            </CommandDialog>
        </div>
    )
};

export default Search;