'use client'

// ** Next
import {useRouter} from "next/navigation";

// ** React hot toast
import toast from "react-hot-toast";

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

// ** Type
import {IUserProfile} from "@/types/api";

type TLikeComment = {
    commentId: string;
    likeCount: number;
    isLiked: boolean;
    mutate: () => void;
    profile?: IUserProfile
}

const LikeComment = ({likeCount, commentId, isLiked, mutate, profile}: TLikeComment) => {


    const router = useRouter();

    const { trigger, isMutating } = useMutateMethod<void, void>({
        api: () => CommentService.toggleLike(commentId),
        key: CONFIG_TAG.COMMENT.LIKE,
        onSuccess: () => {
            mutate()
        }
    })

    const handleToggleLike = async () => {
        if (!profile?._id) {
            router.push('/dang-nhap')
            return toast.error("Bạn cần đăng nhập để thích bình luận này")
        }

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