'use client'

import {useEffect, useState} from "react";

// Components
import Button from "@/components/common/Button";
import {PaginationLocal} from "@/components/common/PaginationLocal";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Hooks & services
import {useDebounce} from "@/hooks/common/useDebounce";
import useGetMethod from "@/hooks/common/useGetMethod";
import {FavoriteService} from "@/services/api/favorite";

// types & config
import {CONFIG_TAG} from "@/configs/tag";
import {TSortOption} from "@/types/component";
import {IFavorite} from "@/types/api";

// UI
import {ArrowUpDown, Check, Search} from "lucide-react";
import {cn} from "@/lib/utils";

// Modules
import ListFavoriteSkeleton from "@/skeletons/tai-khoan/truyen-yeu-thich/ListFavoriteSkeleton";
import FormDeleteFavorite from "@/modules/tai-khoan/truyen-yeu-thich/FormDeleteFavorite";
import FormDeleteMulti from "@/modules/tai-khoan/truyen-yeu-thich/FormDeleteMulti";
import EmptyFavorite from "@/modules/tai-khoan/truyen-yeu-thich/EmptyFavorite";

const SORT_OPTIONS: TSortOption[] = [
    {label: "Ngày lưu mới", value: "-updatedAt"},
    {label: "Ngày lưu cũ", value: "updatedAt"},
    {label: "A → Z", value: "comic_name"},
    {label: "Z → A", value: "-comic_name"},
];

const ListFavorite = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("-updatedAt");
    const [deleteMulti, setDeleteMulti] = useState(false)
    const [selected, setSelected] = useState<string[]>([]);

    const debouncedSearch = useDebounce(search, 400);

    const {data, isLoading, mutate} = useGetMethod<IModelPaginate<IFavorite>>({
        api: () =>
            FavoriteService.list({
                page,
                limit,
                sort,
                search: debouncedSearch,
                searchField: "comic_name",
            }),
        key: [CONFIG_TAG.FAVORITE.LIST, page.toString(), limit.toString(), sort, debouncedSearch],
        revalidateIfStale: false,
    });

    useEffect(() => setPage(1), [debouncedSearch, sort]);

    const list = data?.result || [];
    const total = data?.meta?.totalItems || 0;
    const currentSort = SORT_OPTIONS.find(o => o.value === sort)?.label ?? "Sắp xếp";

    const renderContent = () => {
        if (isLoading) return <ListFavoriteSkeleton/>;

        if (!list.length) {
            return (
                <div className="text-center py-10 text-sm text-muted-foreground">
                    {search ? `Không tìm thấy truyện "${search}"` : <EmptyFavorite/>}
                </div>
            );
        }

        return (
            <FormDeleteFavorite
                listFavorite={list}
                deleteMulti={deleteMulti}
                setSelected={setSelected}
                selected={selected}
            />
        );
    };

    return (
        <div className="space-y-6">
            {/* Search + Sort */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                <div className='flex gap-2 flex-1'>
                    <InputGroup>
                        <InputGroupInput
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm tên truyện..."
                        />
                        <InputGroupAddon>
                            <Search className="size-4"/>
                        </InputGroupAddon>
                        {!isLoading && (
                            <InputGroupAddon align="inline-end">
                                  <span className="text-xs text-muted-foreground">
                                    {list.length} truyện
                                  </span>
                            </InputGroupAddon>
                        )}
                    </InputGroup>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" sizeCustom="xs" className="gap-1.5">
                                <ArrowUpDown className="size-3.5"/>
                                <span className="hidden sm:inline">{currentSort}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {SORT_OPTIONS.map(o => (
                                <DropdownMenuItem
                                    key={o.value}
                                    onClick={() => setSort(o.value)}
                                >
                                    <Check className={cn("size-4", sort === o.value ? "opacity-100" : "opacity-0")}/>
                                    {o.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {list.length >= 2 && !isLoading && (
                    <FormDeleteMulti
                        deleteMulti={deleteMulti}
                        setDeleteMulti={setDeleteMulti}
                        mutate={mutate}
                        selected={selected}
                        setSelected={setSelected}
                        listFavorite={list}
                    />
                )}
            </div>

            {/* List */}
            <div className="max-h-[65vh] overflow-y-auto pr-2 -mr-3">
                {renderContent()}
            </div>

            {/* Pagination */}
            <PaginationLocal
                totalCount={total}
                pageSize={limit}
                page={page}
                onPageChange={setPage}
                pageSizeOptions={[5, 10, 20, 40, 50, 100]}
                onPageSizeChange={(size) => {
                    setLimit(size);
                    setPage(1);
                }}
            />
        </div>
    );
};

export default ListFavorite;