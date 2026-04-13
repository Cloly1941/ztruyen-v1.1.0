'use client'

// ** Modules
import FormDeleteComment from "@/modules/truyen-tranh/Comment/FormDeleteComment";
import FormReportComment from "@/modules/truyen-tranh/Comment/FormReportComment";

// ** Type
import {IUserProfile} from "@/types/api";

type TCommentAction = {
    isOwner: boolean;
    commentId: string;
    mutate: () => Promise<unknown>;
    mutateReply?: () => Promise<unknown>;
    profile?: IUserProfile
    onDelete?: () => void;
}

const CommentAction = ({isOwner, commentId, mutate, mutateReply, profile, onDelete}: TCommentAction) => {

    if (!profile?._id) return null;

    return (
        <div className='ml-auto visible lg:invisible lg:group-hover/header:visible'>
            <div className='md:mr-5'>
                {isOwner ? (
                    <FormDeleteComment id={commentId} mutate={mutate} mutateReply={mutateReply} onDelete={onDelete}/>
                ) : (
                    <FormReportComment commentId={commentId}/>
                )}
            </div>
        </div>
    )
}

export default CommentAction