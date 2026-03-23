'use client'

// ** Modules
import FormDeleteComment from "@/modules/truyen-tranh/Comment/FormDeleteComment";
import FormReportComment from "@/modules/truyen-tranh/Comment/FormReportComment";

// ** Type
import {IUserProfile} from "@/types/api";

type TCommentAction = {
    isOwner: boolean;
    commentId: string;
    mutate: () => void
    profile?: IUserProfile
}

const CommentAction = ({isOwner, commentId, mutate, profile}: TCommentAction) => {

    if (!profile?._id) return null;

    return (
        <div className='ml-auto visible lg:invisible lg:group-hover/header:visible'>
            <div className='md:mr-5'>
                {isOwner ? (
                    <FormDeleteComment id={commentId} mutate={mutate}/>
                ) : (
                    <FormReportComment commentId={commentId}/>
                )}
            </div>
        </div>
    )
}

export default CommentAction