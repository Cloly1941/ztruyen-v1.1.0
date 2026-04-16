'use client'

// ** React
import {useEffect} from "react"

// ** Types
import {IComment, IUserProfile} from "@/types/api";

// ** Dayjs
import dayjs from "dayjs";

// ** Modules
import LikeComment from "@/modules/truyen-tranh/Comment/LikeComment";
import AvatarWithName from "@/modules/truyen-tranh/Comment/AvatarWithName";
import CommentAction from "@/modules/truyen-tranh/Comment/CommentAction";
import CommentContent from "@/modules/truyen-tranh/Comment/CommentContent";

type TReplyItem = {
    reply: IComment;
    isReplyOpen: boolean;
    onToggleReply: () => void;
    mutateReply: () => Promise<unknown>;
    profile?: IUserProfile
    mutateDeleteReply: () => Promise<unknown>;
    mutate: () => Promise<unknown>;
    detailKey?: string;
    page?: number | null
    chapterName?: string | null
    highlightReplyId?: string;
    onHighlightReady?: (id: string) => void;
    comicSlug: string
}

const ReplyItem = ({
                       reply,
                       isReplyOpen,
                       onToggleReply,
                       mutateReply,
                       profile,
                       mutateDeleteReply,
                       mutate, detailKey,
                       highlightReplyId, onHighlightReady,
                       comicSlug
                   }: TReplyItem) => {

    const isOwner = profile?._id === reply.userId._id

    useEffect(() => {
        if (reply._id !== highlightReplyId) return;
        onHighlightReady?.(reply._id);
    }, [reply._id, highlightReplyId, onHighlightReady]);

    return (
        <li className='group/header'>
            <AvatarWithName
                size={40}
                mobileSize={36}
                name={reply.userId.name}
                avatarUrl={reply.userId.avatar?.url}
                frameName={reply.userId.avatar_frame?.name}
                frameUrl={reply.userId.avatar_frame?.image?.url}
                chapterId={reply.chapterId}
                slug={comicSlug}
            />
            <div className='ml-[43px] sm:ml-[46px]'>
                <div className='-mt-3 dark:text-gray-200 text-[13px] sm:text-[15px] break-words flex' id={reply._id}>
                    {reply.replyTo && (
                        <span className='text-primary mr-1.5'>@{reply.replyTo.name}</span>
                    )}
                    <CommentContent content={reply.content} className='inline'/>
                </div>
                <div
                    className='flex gap-2 sm:gap-5 flex-col sm:flex-row text-[13px] sm:text-sm mt-1 text-[#9499A0] dark:text-gray-400'>
                    <div className='shrink-0'>{dayjs(reply.createdAt).format("DD-MM-YYYY HH:mm")}</div>
                    <div className='flex gap-5 w-full items-center'>
                        <LikeComment
                            likeCount={reply.likeCount}
                            commentId={reply._id}
                            mutate={mutateReply}
                            isLiked={reply.isLiked}
                            profile={profile}
                            detailKey={detailKey}
                        />
                        <span
                            onClick={onToggleReply}
                            className='cursor-pointer hover:text-primary'
                        >
                        {isReplyOpen ? 'Huỷ' : 'Phản hồi'}
                    </span>
                        <CommentAction
                            isOwner={isOwner}
                            commentId={reply._id}
                            mutate={mutate}
                            mutateReply={mutateDeleteReply}
                            profile={profile}
                        />
                    </div>
                </div>
            </div>
        </li>
    );
};

export default ReplyItem;