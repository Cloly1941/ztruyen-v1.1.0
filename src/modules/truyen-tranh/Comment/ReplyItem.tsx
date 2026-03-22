'use client'

import {IComment, IUserProfile} from "@/types/api";
import dayjs from "dayjs";
import LikeComment from "@/modules/truyen-tranh/Comment/LikeComment";
import AvatarWithName from "@/modules/truyen-tranh/Comment/AvatarWithName";
import CommentAction from "@/modules/truyen-tranh/Comment/CommentAction";

type TReplyItem = {
    reply: IComment;
    isReplyOpen: boolean;
    onToggleReply: () => void;
    mutateReply: () => void;
    profile?: IUserProfile
    mutateDeleteReply: () => void;
}

const ReplyItem = ({reply, isReplyOpen, onToggleReply, mutateReply, profile, mutateDeleteReply}: TReplyItem) => {

    const isOwner = profile?._id === reply.userId._id

    return (
        <li className='group/header'>
            <AvatarWithName
                size={40}
                name={reply.userId.name}
                avatarUrl={reply.userId.avatar?.url}
                frameName={reply.userId.avatar_frame?.name}
                frameUrl={reply.userId.avatar_frame?.image?.url}
            />
            <div className='ml-[46px]'>
                <div className='-mt-3 dark:text-gray-200 text-[15px]'>
                    {reply.replyTo && (
                        <span className='text-primary mr-1.5'>@{reply.replyTo.name}</span>
                    )}
                    {reply.content}
                </div>
                <div className='flex gap-5 text-sm mt-1 text-[#9499A0] dark:text-gray-400'>
                    <div>{dayjs(reply.createdAt).format("DD-MM-YYYY HH:mm")}</div>
                    <LikeComment
                        likeCount={reply.likeCount}
                        commentId={reply._id}
                        mutate={mutateReply}
                        isLiked={reply.isLiked}
                        profile={profile}
                    />
                    <span
                        onClick={onToggleReply}
                        className='cursor-pointer hover:text-primary'
                    >
                        {isReplyOpen ? 'Huỷ' : 'Phản hồi'}
                    </span>
                    <CommentAction isOwner={isOwner} commentId={reply._id} mutate={mutateDeleteReply}/>
                </div>
            </div>
        </li>
    );
};

export default ReplyItem;