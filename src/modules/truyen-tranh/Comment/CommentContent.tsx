// ** Next
import Image from "next/image";

// ** Utils
import {parseComment} from "@/utils/parseComment";
import {cn} from "@/lib/utils";

type TCommentContent = {
    content: string
    className?: string
}

const CommentContent = ({content, className}: TCommentContent) => {
    return (
        <p className={className}>
            {parseComment(content).map((part, index) =>
                part.type === 'text'
                    ? <span key={index}>{part.value}</span>
                    : (
                        <span key={index} className={cn('relative size-5 sm:size-6 inline-block align-middle', part.url.includes('gif') && 'size-12 sm:size-20')}>
                            <Image
                                key={index}
                                src={part.url}
                                alt={part.name}
                                fill
                            />
                        </span>
                    )
            )}
        </p>
    )
}

export default CommentContent