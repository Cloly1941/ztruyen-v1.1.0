'use client'

import {useState} from "react";
import {IComment, IUserProfile} from "@/types/api";
import CommentItem from "@/modules/truyen-tranh/Comment/CommentItem";

type TListComment = {
    listComment: IComment[];
    comicSlug: string;
    comicName: string;
    mutate: () => void;
    profile?: IUserProfile
}

const ListComment = ({listComment, comicName, comicSlug, mutate, profile}: TListComment) => {
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

    return (
        <ul className='flex flex-col gap-y-5 mt-10'>
            {listComment.map((comment) => (
                <CommentItem
                    key={comment._id}
                    user={comment.userId}
                    comment={comment}
                    comicName={comicName}
                    comicSlug={comicSlug}
                    mutate={mutate}
                    activeCommentId={activeCommentId}
                    onSetActiveCommentId={setActiveCommentId}
                    profile={profile}
                />
            ))}
        </ul>
    )
}

export default ListComment;