'use client'

import {useRef, useState} from "react";
import {Separator} from "@/components/ui/separator";
import {IComment, IUserComment, IUserProfile} from "@/types/api";
import {ChevronDown, ChevronUp} from "lucide-react";
import dayjs from "dayjs";
import ReplyList from "@/modules/truyen-tranh/Comment/ReplyList";
import SendComment from "@/modules/truyen-tranh/Comment/SendComment";
import useGetMethod from "@/hooks/common/useGetMethod";
import {CommentService} from "@/services/api/comment";
import LikeComment from "@/modules/truyen-tranh/Comment/LikeComment";
import AvatarWithName from "@/modules/truyen-tranh/Comment/AvatarWithName";
import CommentAction from "@/modules/truyen-tranh/Comment/CommentAction";

type TCommentItem = {
    user: IUserComment;
    comment: IComment;
    comicSlug: string;
    comicName: string;
    mutate: () => void;
    activeCommentId: string | null;
    onSetActiveCommentId: (id: string | null) => void;
    profile?: IUserProfile
}

const REPLY_LIMIT = 10;
const PARENT_REPLY_ID = (commentId: string) => `parent-${commentId}`;

const CommentItem = ({
                         user, comment, comicSlug, comicName, profile,
                         mutate, activeCommentId, onSetActiveCommentId
                     }: TCommentItem) => {
    const [showReplies, setShowReplies] = useState(false);
    const [page, setPage] = useState(1);
    const hasFetchedRef = useRef(false);
    const [fetchEnabled, setFetchEnabled] = useState(false);

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
                    name={user.name}
                    avatarUrl={user.avatar?.url}
                    frameName={user.avatar_frame?.name}
                    frameUrl={user.avatar_frame?.image?.url}
                />

                <div className='ml-[76px]'>
                    <div className='-mt-6 dark:text-gray-200'>
                        {comment.content}
                    </div>

                    <div className='flex gap-5 text-sm mt-1 text-[#9499A0] dark:text-gray-400'>
                        <div>{dayjs(comment.createdAt).format("DD-MM-YYYY HH:mm")}</div>
                        <LikeComment
                            likeCount={comment.likeCount}
                            mutate={mutate}
                            commentId={comment._id}
                            isLiked={comment.isLiked}
                            profile={profile}
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
                        />
                    </div>
                </div>
            </div>

            <div className='ml-[76px]'>
                {comment.replyCount > 0 && (
                    <button
                        onClick={handleToggleShowReplies}
                        className='flex items-center gap-1 text-sm text-primary mt-2 hover:underline'
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
                        />
                    </div>
                ) : null}

                <Separator className='bg-[#E3E5E7] dark:bg-zinc-700 mt-6'/>
            </div>
        </li>
    );
};

export default CommentItem;