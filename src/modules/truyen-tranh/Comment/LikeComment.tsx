'use client'

// ** Icon
import {ThumbsUp} from "lucide-react";

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

// ** Service
import {CommentService} from "@/services/api/comment";

// ** Utils
import {cn} from "@/lib/utils";

type TLikeComment = {
    commentId: string;
    likeCount: number;
    isLiked: boolean;
    mutate: () => void;
}

const LikeComment = ({likeCount, commentId, isLiked, mutate}: TLikeComment) => {

    const { trigger, isMutating } = useMutateMethod<void, void>({
        api: () => CommentService.toggleLike(commentId),
        key: CONFIG_TAG.COMMENT.LIKE,
        onSuccess: () => {
            mutate()
        }
    })

    const handleToggleLike = async () => {
        await trigger()
    }

    return (
        <div
            className={cn(
                'flex gap-1 items-center cursor-pointer transition-colors',
                isLiked
                    ? 'text-primary hover:text-primary/80'
                    : 'hover:text-primary',
                isMutating && 'opacity-50 pointer-events-none'
            )}
            onClick={handleToggleLike}
        >
            <ThumbsUp
                className={cn(
                    "size-3.5 transition-all",
                    isLiked && "fill-primary"
                )}
            />
            {likeCount > 0 && <span className="text-sm font-medium">{likeCount}</span>}
        </div>
    )
}

export default LikeComment