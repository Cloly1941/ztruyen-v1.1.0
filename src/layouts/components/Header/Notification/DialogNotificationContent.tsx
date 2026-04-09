'use client'

// ** React
import {useCallback, useRef, useState} from "react";

// ** Next
import Link from "next/link";

// ** Shadcn ui
import {DialogHeader, DialogTitle} from "@/components/ui/dialog";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

// ** Hook
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Type
import {IComment, IPageOfReply, IUserProfile} from "@/types/api";

// ** Tag
import {CONFIG_TAG} from "@/configs/tag";

// ** Services
import {CommentService} from "@/services/api/comment";
import {UserService} from "@/services/api/user";

// ** Module
import CommentItem from "@/modules/truyen-tranh/Comment/CommentItem";
import {CommentItemSkeleton} from "@/skeletons/truyen-tranh/CommentSectionSkeleton";

// ** Skeleton


type TDialogNotificationContent = {
    replyId?: string;
    parentId: string;
    comicName: string;
    comicSlug: string;
    type: "detail" | "reading";
}

const DialogNotificationContent = ({
                                       comicName, comicSlug, parentId, replyId, type
                                   }: TDialogNotificationContent) => {

    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const hasScrolled = useRef(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const {data: profile} = useGetMethod<IUserProfile>({
        api: () => UserService.getProfile(),
        key: CONFIG_TAG.USER.PROFILE,
        revalidateIfStale: false,
    })

    const {data: comment, mutate, isLoading: isCommentLoading} = useGetMethod<IComment>({
        api: () => CommentService.detail(parentId),
        key: `${CONFIG_TAG.COMMENT.DETAIL}-${parentId}`,
        revalidateIfStale: false,
    })

    const {data: pageOfReply, isLoading: isPageOfReplyLoading} = useGetMethod<IPageOfReply>({
        api: () => CommentService.pageOfReply(replyId!),
        key: `${CONFIG_TAG.COMMENT.DETAIL}-${replyId}`,
        revalidateIfStale: false,
        enabled: !!replyId,
    })

    const detailKey = `${CONFIG_TAG.COMMENT.LIST}-detail-${comicSlug}-${profile?._id ?? 'guest'}`

    const handleHighlightReady = useCallback((id: string) => {
        if (hasScrolled.current) return;

        const el = document.getElementById(id);
        const container = scrollContainerRef.current;
        if (!el || !container) return;

        requestAnimationFrame(() => {
            const elTop = el.getBoundingClientRect().top;
            const containerTop = container.getBoundingClientRect().top;
            const offset = elTop - containerTop + container.scrollTop - container.clientHeight / 2;

            container.scrollTo({top: offset, behavior: 'smooth'});
            hasScrolled.current = true;

            el.classList.add('bg-primary/10', 'rounded-sm', 'transition-all', 'duration-700');
            setTimeout(() => el.classList.remove('bg-primary/10'), 2000);
        });
    }, []);

    const isLoading = isCommentLoading || (!!replyId && isPageOfReplyLoading);

    if (isLoading) return (
        <>
            <DialogHeader>
                <DialogTitle className='hover:text-destructive'>
                    <Link href={`/${CONFIG_SLUG.DETAIL}/${comicSlug}`}>
                        {comicName}
                    </Link>
                </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-4 my-4 pr-4 h-[50vh]">
                <CommentItemSkeleton/>
            </div>
        </>
    );

    if (!comment) return null;
    if (replyId && !pageOfReply) return null;

    return (
        <>
            <DialogHeader>
                <DialogTitle className='hover:text-destructive'>
                    <Link href={`/${CONFIG_SLUG.DETAIL}/${comicSlug}`}>
                        {comicName}
                    </Link>
                </DialogTitle>
            </DialogHeader>
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden -mx-4 my-4 pr-4 h-[50vh]"
            >
                <CommentItem
                    user={comment.userId}
                    comment={comment}
                    comicName={comicName}
                    comicSlug={comicSlug}
                    mutate={mutate}
                    activeCommentId={activeCommentId}
                    onSetActiveCommentId={setActiveCommentId}
                    profile={profile}
                    detailKey={detailKey}
                    type={type}
                    isNotification
                    replyPage={pageOfReply?.page ?? 1}
                    highlightReplyId={replyId}
                    onHighlightReady={replyId ? handleHighlightReady : undefined}
                />
            </div>
        </>
    )
}

export default DialogNotificationContent;