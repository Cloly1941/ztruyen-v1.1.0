'use client'

// ** React
import {useEffect, useRef} from "react";

// ** Types
import {IComment, IUserProfile} from "@/types/api";

// ** Module
import ReplyItem from "@/modules/truyen-tranh/Comment/ReplyItem";

// ** Icons
import {ChevronLeft, ChevronRight} from "lucide-react";

// ** Lib
import {cn} from "@/lib/utils";

// ** Utils
import {getPaginationPages} from "@/utils/pagination";

// ** Skeleton
import {ListReplyCommentSkeleton} from "@/skeletons/truyen-tranh/CommentSectionSkeleton";

type TReplyList = {
    show: boolean;
    replies: IComment[];
    totalPages: number;
    page: number;
    isValidating: boolean;
    onPageChange: (page: number) => void;
    activeReplyId: string | null;
    onToggleReply: (id: string, replyTo: string, name: string) => void;
    mutateReply: () => Promise<unknown>;
    profile?: IUserProfile
    mutateDeleteReply: () => Promise<unknown>;
    mutate: () => Promise<unknown>;
    detailKey?: string;
    chapterPage?: number | null
    chapterName?: string | null
    highlightReplyId?: string;
    onHighlightReady?: (id: string) => void;
}

const ReplyList = ({
                       show,
                       replies,
                       totalPages,
                       page,
                       isValidating,
                       onPageChange,
                       activeReplyId,
                       onToggleReply,
                       mutateReply,
                       profile,
                       mutateDeleteReply,
                       mutate,
                       detailKey,
                       highlightReplyId, onHighlightReady
                   }: TReplyList) => {

    const isInitialLoading = isValidating && replies.length === 0;
    const isPageLoading = isValidating && replies.length > 0;

    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [page]);

    if (isInitialLoading) return <ListReplyCommentSkeleton/>

    return (
        <div className={cn('mt-4', !show && 'hidden')}>
            <ul ref={listRef}
                className={cn('flex flex-col gap-y-5 transition-opacity duration-200', isPageLoading && 'opacity-50 pointer-events-none')}>
                {replies.map((reply) => (
                    <ReplyItem
                        key={reply._id}
                        reply={reply}
                        isReplyOpen={activeReplyId === reply._id}
                        onToggleReply={() => onToggleReply(reply._id, reply.userId._id, reply.userId.name)}
                        mutateReply={mutateReply}
                        profile={profile}
                        mutateDeleteReply={mutateDeleteReply}
                        mutate={mutate}
                        detailKey={detailKey}
                        highlightReplyId={highlightReplyId}
                        onHighlightReady={onHighlightReady}
                    />
                ))}
            </ul>

            {totalPages > 1 && (
                <div className='flex items-center gap-1 mt-4 text-xs sm:text-sm text-[#9499A0]'>
                    <span className='mr-3'>
                        {isValidating ? 'Đang tải...' : `Tổng ${totalPages} trang`}
                    </span>

                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1 || isValidating}
                        className={cn('hover:text-primary', (page === 1 || isValidating) && 'opacity-50 pointer-events-none')}
                    >
                        <ChevronLeft className='size-4'/>
                    </button>

                    {getPaginationPages(page, totalPages).map((p, index) =>
                        p === '...' ? (
                            <span key={`ellipsis-${index}`}>...</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p as number)}
                                disabled={isValidating}
                                className={cn(
                                    'w-7 h-7 rounded text-xs',
                                    page === p ? 'bg-primary text-white' : 'hover:text-primary',
                                    isValidating && 'pointer-events-none'
                                )}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages || isValidating}
                        className={cn('hover:text-primary', (page === totalPages || isValidating) && 'opacity-50 pointer-events-none')}
                    >
                        <ChevronRight className='size-4'/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReplyList;