'use client'

// ** Modules
import FormDeleteComment from "@/modules/truyen-tranh/Comment/FormDeleteComment";
import FormReportComment from "@/modules/truyen-tranh/Comment/FormReportComment";

type TCommentAction = {
    isOwner: boolean;
    commentId: string;
    mutate: () => void
}

const CommentAction = ({isOwner, commentId, mutate}: TCommentAction) => {
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