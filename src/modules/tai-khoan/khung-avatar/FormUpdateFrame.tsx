'use client'

// ** React
import {useEffect, useState} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** Hooks
import {useDebounce} from "@/hooks/common/useDebounce";
import useMutateMethod from "@/hooks/common/useMutateMethod";
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Services
import {UserService} from "@/services/api/user"
import {FrameService} from "@/services/api/frame";

// ** Config
import {CONFIG_TAG} from "@/configs/tag"

// ** Type
import {IFrame, IUserProfile} from "@/types/api"

// ** Components
import AvatarWithFrame from "@/components/common/AvatarWithFrame";
import Button from "@/components/common/Button";
import {PaginationLocal} from "@/components/common/PaginationLocal";

// ** Shadcn ui
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";

// ** Utils
import {cn} from "@/lib/utils";

// ** Icons
import {ArrowUpDown, Check, Search} from "lucide-react";

// ** Skeleton
import {FrameSkeleton} from "@/skeletons/tai-khoan/khung-avatar/FrameSkeleton";

// ** Type
import {TSortOption} from "@/types/component";

const SORT_OPTIONS: TSortOption[] = [
    {label: "Mới nhất", value: "-updatedAt"},
    {label: "Cũ nhất", value: "updatedAt"},
    {label: "A → Z", value: "name"},
    {label: "Z → A", value: "-name"},
];

const FormUpdateFrame = () => {

    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("-updatedAt");

    const debouncedSearch = useDebounce(search, 400);

    const queryParams = {
        page,
        limit,
        sort,
        search: debouncedSearch,
        searchField: "name",
    };

    const {data: user, isLoading: isUserLoading, mutate} = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
        revalidateIfStale: false,
    })

    const {data: frame, isLoading: isFrameLoading} = useGetMethod<IModelPaginate<IFrame>>({
        api: () => FrameService.list(queryParams),
        key: [CONFIG_TAG.FRAME.INDEX, page.toString(), limit.toString(), sort, debouncedSearch],
        revalidateIfStale: false,
    })

    const { trigger, isMutating } = useMutateMethod<IUserProfile, void>({
        api: () => UserService.updateProfileImage({ avatar_frame: selectedId }),
        key: CONFIG_TAG.FRAME.UPDATE,
        showToast: false,
        onSuccess: async () => {
            toast.success('Cập nhật khung thành công!')
            await mutate()
        }
    })

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, sort]);

    useEffect(() => {
        setSelectedId(user?.avatar_frame?._id)
    }, [user])

    const listFrame = frame?.result;
    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? "Sắp xếp";

    const handleSubmit = async () => {
        await trigger()
    }

    return (
        <div className="space-y-6">
            {/* Search + Sort */}
            <div className="flex items-center gap-2">
                <InputGroup className="flex-1">
                    <InputGroupInput
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm tên khung..."
                    />
                    <InputGroupAddon>
                        <Search className="size-4"/>
                    </InputGroupAddon>
                    {!isFrameLoading && (
                        <InputGroupAddon align="inline-end">
                            <span className="text-xs text-muted-foreground">
                                {listFrame?.length ?? 0} khung
                            </span>
                        </InputGroupAddon>
                    )}
                </InputGroup>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" sizeCustom="xs" className="gap-1.5 whitespace-nowrap shrink-0">
                            <ArrowUpDown className="size-3.5"/>
                            <span className="hidden sm:inline">{currentSortLabel}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {SORT_OPTIONS.map(option => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setSort(option.value)}
                                className="gap-2"
                            >
                                <Check className={cn("size-4", sort === option.value ? "opacity-100" : "opacity-0")}/>
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Frame list */}
            {isFrameLoading || isUserLoading ? (
                <FrameSkeleton/>
            ) : !listFrame?.length ? (
                <div className="text-center py-10 text-sm text-muted-foreground">
                    {search ? `Không tìm thấy khung "${search}"` : "Không có khung nào."}
                </div>
            ) : (
                <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                    {listFrame.map((frame: IFrame) => {
                        const isSelected = selectedId === frame._id;
                        return (
                            <div
                                key={frame._id}
                                onClick={() => setSelectedId(frame._id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 py-4 rounded-lg cursor-pointer",
                                    "border-2 transition-all duration-150",
                                    isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-transparent hover:bg-muted/50"
                                )}
                            >
                                <div className="relative">
                                    <AvatarWithFrame
                                        size={80}
                                        avatarName={user?.name}
                                        avatarUrl={user?.avatar?.url}
                                        frameUrl={frame.image.url}
                                        frameName={frame.name}
                                    />
                                    {isSelected && (
                                        <span
                                            className="absolute top-0 -right-8 hidden md:flex items-center justify-center size-5 bg-primary rounded-full">
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <polyline
                                                    points="1.5,5 4,7.5 8.5,2.5"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-tight px-1 truncate w-full text-center">
                                    {frame.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className='pt-6'>
                {/* Pagination */}
                <PaginationLocal
                    totalCount={frame?.meta?.totalItems ?? 0}
                    pageSize={limit}
                    page={page}
                    onPageChange={setPage}
                    pageSizeOptions={[5, 10, 20, 40, 50, 100]}
                    onPageSizeChange={(size) => {
                        setLimit(size)
                        setPage(1)
                    }}
                />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
                <Button
                    className="btn-acc"
                    onClick={handleSubmit}
                    isLoading={isMutating}
                    disabled={!selectedId || isUserLoading}
                >
                    Cập nhật
                </Button>
            </div>
        </div>
    )
}

export default FormUpdateFrame;