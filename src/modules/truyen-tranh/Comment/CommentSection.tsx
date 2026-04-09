'use client'

// ** React
import {useState} from "react";

// ** Modules
import SendComment from "@/modules/truyen-tranh/Comment/SendComment";
import ListComment from "@/modules/truyen-tranh/Comment/ListComment";

// ** Services
import {CommentService} from "@/services/api/comment";
import {UserService} from "@/services/api/user";

// ** Lib
import {cn} from "@/lib/utils";

// ** Types
import {IComment, IUserProfile} from "@/types/api";
import {TSortOption} from "@/types/component";

// ** Tag
import {CONFIG_TAG} from "@/configs/tag";

// ** Hooks
import useLazyLoad from "@/hooks/common/useLazyLoad";
import useInfiniteLoad from "@/hooks/common/useInfiniteLoad";
import useSentinel from "@/hooks/common/useSentinel";
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Skeleton
import {ListCommentSkeleton, CommentSectionSkeleton} from "@/skeletons/truyen-tranh/CommentSectionSkeleton";

type TCommentSection = {
    slug: string;
    name: string;
    type?: "detail" | "reading";
    chapterId?: string;
    page?: number | null
    chapterName?: string | null
};

const SORT_OPTIONS: TSortOption[] = [
    {label: "Mới nhất", value: "-createdAt"},
    {label: "Nổi bật", value: "-replyCount"},
];

const LIMIT = 10;

const CommentSection = (
    {name, slug, chapterId, type = 'detail', page, chapterName}: TCommentSection) => {
    const [sort, setSort] = useState("-createdAt");

    const {ref: containerRef, enabled} = useLazyLoad({threshold: 0.1});

    const {data: profile, isLoading: isProfileLoading} = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
        revalidateIfStale: false,
    })

    const profileReady = !isProfileLoading;

    const detailKey = `${CONFIG_TAG.COMMENT.LIST}-detail-${slug}-${profile?._id ?? 'guest'}`

    const isDetailKey = type === 'reading' ? detailKey : undefined;

    const {
        data: comments,
        meta,
        hasMore,
        isLoading,
        isValidating,
        mutate,
        loadMore,
        reset,
    } = useInfiniteLoad<IComment>({
        key: type === 'detail'
            ? detailKey
            : `${CONFIG_TAG.COMMENT.LIST}-chapter-${chapterId}-${profile?._id ?? 'guest'}`,
        enabled: enabled && profileReady,
        sort,
        api: (page) =>
            CommentService.list({
                page,
                limit: LIMIT,
                sort,
                filters: {
                    ...(type === 'detail'
                            ? {comicSlug: [slug]}
                            : chapterId ? {chapterId: [chapterId]} : {}
                    )
                },
                userId: profile?._id,
            }).then(res => res.data as IModelPaginateComment<IComment>),
    });

    const totalCount = (meta as IModelPaginateComment<IComment>['meta'] & {
        totalComments?: number
    })?.totalComments ?? meta?.totalItems ?? 0;

    const {sentinelRef} = useSentinel({onIntersect: loadMore});

    return (
        <div ref={containerRef}>
            {/* Title Head */}
            <div className={cn("flex justify-between sm:justify-start sm:gap-20", type === 'detail' && 'mt-10')}>
                <div className="relative inline-block">
                    <h2 className="text-base sm:text-lg font-medium">Bình luận</h2>
                    <span className="absolute top-2 left-full ml-2 -translate-y-1/2 text-[13px] sm:text-sm text-img whitespace-nowrap">
                        {totalCount}
                    </span>
                </div>
                <div className="flex gap-5 text-[13px] sm:text-sm items-center text-third pr-2">
                    {SORT_OPTIONS.map((item, index) => (
                        <div key={item.value} className="flex items-center gap-5">
                            <div
                                className={cn(
                                    "cursor-pointer hover:!text-primary",
                                    sort === item.value && "text-black dark:text-white"
                                )}
                                onClick={async () => {
                                    setSort(item.value);
                                    await reset();
                                    await mutate();
                                }}
                            >
                                {item.label}
                            </div>
                            {index < SORT_OPTIONS.length - 1 && (
                                <span className="h-[11px] border-l border-[#9499A0]"/>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {!enabled || isLoading ? (
                <CommentSectionSkeleton/>
            ) : (
                <>
                    <SendComment
                        comicName={name}
                        comicSlug={slug}
                        chapterId={chapterId}
                        chapterName={chapterName}
                        page={page}
                        mutate={() => mutate()}
                        user={profile}
                        detailKey={isDetailKey}
                    />

                    <ListComment
                        listComment={comments}
                        comicSlug={slug}
                        comicName={name}
                        mutate={() => mutate()}
                        profile={profile}
                        detailKey={isDetailKey}
                        type={type}
                    />

                    {/* Sentinel */}
                    {isValidating && <ListCommentSkeleton/>}
                    <div ref={sentinelRef} className="mt-10 sm:mt-16 mb-[80px] sm:mb-[100px] text-[13px] sm:text-sm text-third text-center">
                        {!isValidating && !hasMore && comments.length > 0 && (
                            <span>Không còn bình luận nữa</span>
                        )}
                        {!isValidating && comments.length === 0 && (
                            <span>Chưa có bình luận nào</span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CommentSection;