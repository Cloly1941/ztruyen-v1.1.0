'use client'

import {useState} from "react";
import SendComment from "@/modules/truyen-tranh/Comment/SendComment";
import ListComment from "@/modules/truyen-tranh/Comment/ListComment";
import {CommentService} from "@/services/api/comment";
import {cn} from "@/lib/utils";
import {IComment, IUserProfile} from "@/types/api";
import {TSortOption} from "@/types/component";
import {CONFIG_TAG} from "@/configs/tag";
import useLazyLoad from "@/hooks/common/useLazyLoad";
import useInfiniteLoad from "@/hooks/common/useInfiniteLoad";
import useSentinel from "@/hooks/common/useSentinel";
import useGetMethod from "@/hooks/common/useGetMethod";
import {UserService} from "@/services/api/user";
import CommentSectionSkeleton from "@/skeletons/truyen-tranh/CommentSectionSkeleton";

type TCommentSection = {
    slug: string;
    name: string;
};

const SORT_OPTIONS: TSortOption[] = [
    {label: "Mới nhất", value: "-createdAt"},
    {label: "Nổi bật", value: "-replyCount"},
];

const LIMIT = 10;

const CommentSection = ({name, slug}: TCommentSection) => {
    const [sort, setSort] = useState("-createdAt");

    const {ref: containerRef, enabled} = useLazyLoad({threshold: 0.1});

    const {data: profile, isLoading: isProfileLoading} = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
        revalidateIfStale: false,
    })

    const profileReady = !isProfileLoading;

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
        key: `${CONFIG_TAG.COMMENT.LIST}-${slug}-${profile?._id ?? 'guest'}`,
        enabled: enabled && profileReady,
        sort,
        api: (page) =>
            CommentService.list({
                page,
                limit: LIMIT,
                sort,
                filters: {comicSlug: [slug]},
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
            <div className="mt-10 flex gap-20">
                <div className="relative inline-block">
                    <h2 className="text-lg font-medium">Bình luận</h2>
                    <span className="absolute top-2 left-full ml-2 -translate-y-1/2 text-sm text-img whitespace-nowrap">
                        {totalCount}
                    </span>
                </div>
                <div className="flex gap-5 text-sm items-center text-third">
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
                <div className="mt-4 text-sm text-third text-center">Đang tải...</div>
            ) : (
                <>
                    <SendComment comicName={name} comicSlug={slug} mutate={() => mutate()} user={profile}/>

                    <ListComment
                        listComment={comments}
                        comicSlug={slug}
                        comicName={name}
                        mutate={() => mutate()}
                        profile={profile}
                    />

                    {/* Sentinel */}
                    <div ref={sentinelRef} className="mt-16 mb-[100px] text-sm text-third text-center">
                        {isValidating && <CommentSectionSkeleton/>}
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