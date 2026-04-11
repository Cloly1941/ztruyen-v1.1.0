'use client'

// ** React
import {useEffect, useRef, useState} from "react";

// ** Shadcn ui
import {Separator} from "@/components/ui/separator";

// ** Types
import {IComment, IUserComment, IUserProfile} from "@/types/api";

// ** Icons
import {ChevronDown, ChevronUp} from "lucide-react";

// ** Dayjs
import dayjs from "dayjs";

// ** Modules
import ReplyList from "@/modules/truyen-tranh/Comment/ReplyList";
import SendComment from "@/modules/truyen-tranh/Comment/SendComment";
import LikeComment from "@/modules/truyen-tranh/Comment/LikeComment";
import AvatarWithName from "@/modules/truyen-tranh/Comment/AvatarWithName";
import CommentAction from "@/modules/truyen-tranh/Comment/CommentAction";
import CommentContent from "@/modules/truyen-tranh/Comment/CommentContent";

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Service
import {CommentService} from "@/services/api/comment";
import {REFRESH_EVENT} from "@/lib/invalidate-cache/events";

type TCommentItem = {
    user: IUserComment;
    comment: IComment;
    comicSlug: string;
    comicName: string;
    mutate: () => Promise<unknown>;
    activeCommentId: string | null;
    onSetActiveCommentId: (id: string | null) => void;
    profile?: IUserProfile
    detailKey?: string
    type: "detail" | "reading";
    isNotification?: boolean;
    replyPage?: number;
    highlightReplyId?: string;
    onHighlightReady?: (id: string) => void;
}

const REPLY_LIMIT = 10;
const PARENT_REPLY_ID = (commentId: string) => `parent-${commentId}`;

const CommentItem = ({
                         user, comment, comicSlug, comicName, profile,
                         mutate, activeCommentId, onSetActiveCommentId,
                         detailKey, type, isNotification = false, replyPage = 1,
                         highlightReplyId, onHighlightReady
                     }: TCommentItem) => {
    const [showReplies, setShowReplies] = useState(isNotification);
    const [page, setPage] = useState(replyPage);
    const hasFetchedRef = useRef(false);
    const [fetchEnabled, setFetchEnabled] = useState(isNotification);

    // replyTo tương ứng với activeReplyId
    const [activeReplyTo, setActiveReplyTo] = useState<string | null>(null);
    const [activeReplyName, setActiveReplyName] = useState<string | null>(null);

    const {data, isValidating, mutate: mutateReply} = useGetMethod<IModelPaginate<IComment>>({
        api: () => CommentService.listReplies(comment._id, {
            page,
            limit: REPLY_LIMIT,
            userId: profile?._id
        }),
        key: [`replies-${comment._id}-${profile?._id ?? 'guest'}`, page.toString()],
        enabled: fetchEnabled,
        keepPreviousData: true,
    });

    const replies = data?.result ?? [];
    const totalPages = data?.meta?.totalPages ?? 1;

    // revalidate when reply comment
    useEffect(() => {
        const handler = async () => {
            await mutate()
            if (showReplies) await mutateReply()
        }
        window.addEventListener(REFRESH_EVENT, handler)
        return () => window.removeEventListener(REFRESH_EVENT, handler)
    }, [mutate, mutateReply, showReplies])

    const handleToggleReply = (id: string, replyTo: string, name: string) => {
        if (activeCommentId === id) {
            onSetActiveCommentId(null);
            setActiveReplyTo(null);
            setActiveReplyName(null);
        } else {
            onSetActiveCommentId(id);
            setActiveReplyTo(replyTo);
            setActiveReplyName(name);
        }
    };

    const handleToggleShowReplies = () => {
        setShowReplies(prev => !prev);
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            setFetchEnabled(true);
        }
    };

    const handleMutateReply = async () => {
        const res = await mutateReply();
        const newTotalPages = res?.meta?.totalPages ?? totalPages;
        setPage(newTotalPages);
    };

    return (
        <li>
            <div className='group/header'>
                <AvatarWithName
                    size={60}
                    mobileSize={45}
                    name={user?.name}
                    avatarUrl={user.avatar?.url}
                    frameName={user.avatar_frame?.name}
                    frameUrl={user.avatar_frame?.image?.url}
                    chapterName={comment.chapterName}
                    chapterPage={comment.page}
                    type={type}
                />

                <div className='ml-[54px] sm:ml-[76px]'>
                    <CommentContent className='-mt-[18px] sm:-mt-6 dark:text-gray-200 break-words text-sm sm:text-base' content={comment.content}/>

                    <div
                        className='flex gap-2 sm:gap-5 flex-col sm:flex-row text-[13px] sm:text-sm mt-1 text-[#9499A0] dark:text-gray-400'>
                        <div className='shrink-0'>{dayjs(comment.createdAt).format("DD-MM-YYYY HH:mm")}</div>
                        <div className='flex gap-5 w-full items-center'>
                            <LikeComment
                                likeCount={comment.likeCount}
                                mutate={mutate}
                                commentId={comment._id}
                                isLiked={comment.isLiked}
                                profile={profile}
                                detailKey={detailKey}
                            />
                            <span
                                onClick={() => handleToggleReply(
                                    PARENT_REPLY_ID(comment._id),
                                    comment.userId._id,
                                    comment.userId.name
                                )}
                                className='cursor-pointer hover:text-primary'
                            >
                            {activeCommentId === PARENT_REPLY_ID(comment._id) ? 'Huỷ' : 'Phản hồi'}
                        </span>
                            <CommentAction
                                isOwner={profile?._id === comment.userId._id}
                                commentId={comment._id}
                                mutate={mutate}
                                profile={profile}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='ml-[52px] sm:ml-[76px]'>
                {comment.replyCount > 0 && (
                    <button
                        onClick={handleToggleShowReplies}
                        className='flex items-center gap-1 text-[13px] sm:text-sm text-primary mt-2 hover:underline'
                    >
                        {showReplies
                            ? <><ChevronUp className='size-4'/> Thu gọn</>
                            : <><ChevronDown className='size-4'/> {comment.replyCount} phản hồi</>
                        }
                    </button>
                )}

                <ReplyList
                    show={showReplies}
                    replies={replies}
                    totalPages={totalPages}
                    page={page}
                    isValidating={isValidating}
                    onPageChange={setPage}
                    activeReplyId={activeCommentId}
                    onToggleReply={handleToggleReply}
                    mutateReply={handleMutateReply}
                    profile={profile}
                    mutateDeleteReply={mutateReply}
                    mutate={mutate}
                    detailKey={detailKey}
                    highlightReplyId={highlightReplyId}
                    onHighlightReady={onHighlightReady}
                />

                {activeCommentId && activeCommentId.startsWith(`parent-${comment._id}`) ||
                (activeCommentId && replies.some(r => r._id === activeCommentId)) ? (
                    <div className='-ml-3'>
                        <SendComment
                            comicSlug={comicSlug}
                            comicName={comicName}
                            mutate={mutate}
                            mutateReply={handleMutateReply}
                            parent={comment._id}
                            replyTo={activeReplyTo ?? undefined}
                            user={profile}
                            replyName={activeReplyName ?? comment.userId.name}
                            detailKey={detailKey}
                        />
                    </div>
                ) : null}

                <Separator className='bg-[#E3E5E7] dark:bg-zinc-700 mt-6'/>
            </div>
        </li>
    );
};

export default CommentItem;