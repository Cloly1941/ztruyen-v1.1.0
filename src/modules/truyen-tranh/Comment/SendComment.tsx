'use client'

// ** Next
import Link from "next/link";
import Image from "next/image";

// ** React
import {useEffect, useRef, useState} from "react";

// ** SWR
import {mutate as globalMutate} from 'swr'

// ** Hooks
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Types
import {IUserProfile} from "@/types/api";

// ** Services
import {CommentService} from "@/services/api/comment";

// ** Configs
import {CONFIG_TAG} from "@/configs/tag";

// ** Components
import Button from "@/components/common/Button";
import AvatarWithFrame from "@/components/common/AvatarWithFrame";
import PopoverEmoji from "@/modules/truyen-tranh/Comment/PopoverEmoji";

// ** Icon
import {Send} from "lucide-react";

// ** Toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {Textarea} from "@/components/ui/textarea";

// ** Lib
import {cn} from "@/lib/utils";
import {sanitizeComment} from "@/utils/sanitizeComment";

// ** Config
import {CONFIG_IMG} from "@/configs/img";

export type TSendCommentPayload = {
    comicSlug: string
    comicName: string
    content: string
    parent?: string | null
    replyTo?: string | null
    chapterName?: string | null
    page?: number | null
    chapterId: string | null
}

export type TSendReplyPayload = {
    parent: string
    replyTo?: string | null
    content: string
}

export type TSendComment = {
    comicSlug: string
    comicName: string
    mutate: () => Promise<unknown>
    mutateReply?: () => Promise<unknown>
    parent?: string | null
    replyTo?: string | null
    user?: IUserProfile
    replyName?: string | null
    chapterId?: string | null
    page?: number | null
    chapterName?: string | null
    detailKey?: string
}

const SendComment = ({
                         comicSlug,
                         comicName,
                         mutate,
                         mutateReply,
                         parent = null,
                         replyTo = null,
                         user,
                         replyName,
                         chapterId,
                         page,
                         chapterName,
                         detailKey
                     }: TSendComment) => {
    const [isFocus, setIsFocus] = useState(false);
    const [comment, setComment] = useState<string>("");
    const [openEmoji, setOpenEmoji] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const POPOVER_ATTR = 'data-popover-emoji'

    const {trigger, isMutating} = useMutateMethod<void, TSendCommentPayload | TSendReplyPayload>({
        api: (arg) => parent
            ? CommentService.createReply(arg as TSendReplyPayload)
            : CommentService.create(arg as TSendCommentPayload),
        key: CONFIG_TAG.COMMENT.CREATE,
        onSuccess: async (data) => {
            toast.success(data.message)
            if (parent) {
                await mutateReply?.()
                await mutate()
            } else {
                await mutate()
            }
            if (detailKey) {
                await globalMutate(
                    (key) => Array.isArray(key) && key[0] === detailKey,
                    undefined,
                    {revalidate: true}
                )
            }
            setComment('')
        }
    })

    // auto focus
    useEffect(() => {
        if (parent) {
            setIsFocus(true);
            inputRef.current?.focus();
        }
    }, [parent]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickInsideWrapper = wrapperRef.current?.contains(target);
            const isClickInsidePopover = !!target.closest(`[${POPOVER_ATTR}]`);
            if (!isClickInsideWrapper && !isClickInsidePopover) {
                setIsFocus(false);
                setOpenEmoji(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendComment = async () => {
        if (!comment) {
            return toast.error('Bình luận không được để trống !')
        }

        const result = sanitizeComment(comment)
        if (!result.ok) {
            return toast.error(result.error)
        }

        await trigger(
            parent
                ? {parent, replyTo, content: result.value} satisfies TSendReplyPayload
                : {
                    comicName,
                    comicSlug,
                    content: result.value,
                    chapterId: chapterId ?? null,
                    chapterName: chapterName ?? null,
                    page: page ?? null,
                } satisfies TSendCommentPayload
        )
    }

    const handleEmojiSelect = (value: string) => {
        const textarea = inputRef.current
        if (!textarea) return setComment(prev => prev + value)

        const start = textarea.selectionStart ?? comment.length
        const end = textarea.selectionEnd ?? comment.length

        const newComment = comment.slice(0, start) + value + comment.slice(end)
        setComment(newComment)

        requestAnimationFrame(() => {
            textarea.focus()
            const pos = start + value.length
            textarea.setSelectionRange(pos, pos)
        })
    }

    return (
        <div className='mt-6 flex'>
            {!user ? (
                <>
                    <div className='relative size-12 ml-2 mr-4 sm:mx-4 shrink-0'>
                        <Image
                            src={CONFIG_IMG.AVATAR_FALLBACK}
                            alt='ảnh đại diện dự phòng'
                            fill
                            className='object-cover rounded-full'
                        />
                    </div>
                    <div
                        className='flex justify-center items-center bg-[#f1f2f3] dark:bg-zinc-800 text-sm w-full rounded-md text-third'>
                        <span className='hidden sm:inline-block'>Bạn cần</span>
                        <Link href='/dang-nhap'>
                            <Button size='sm' className='text-xs mx-2 h-6 px-2.5'>
                                Đăng nhập
                            </Button>
                        </Link>
                        <span className='hidden sm:inline-block'>để bình luận đó nhe (・ω・)</span>
                    </div>
                </>
            ) : (
                <div className='w-full' ref={wrapperRef}>
                    <div className='flex'>
                        <div className='mr-2 sm:mx-2'>
                            <AvatarWithFrame
                                size={60}
                                mobileSize={45}
                                avatarName={user.name}
                                avatarUrl={user.avatar?.url}
                                frameName={user.avatar_frame?.name}
                                frameUrl={user.avatar_frame?.image?.url}
                            />
                        </div>
                        <Textarea
                            ref={inputRef}
                            onFocus={() => setIsFocus(true)}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={parent ? `Phản hồi @${replyName ?? ""}: ...` : "Viết bình luận..."}
                            rows={1}
                            className={cn(
                                "w-full py-5 px-4 text-sm outline-none rounded-md resize-none",
                                "bg-[#f1f2f3] dark:bg-zinc-800",
                                "border border-transparent",
                                "hover:bg-white hover:border-gray-300",
                                "dark:hover:bg-zinc-700 dark:hover:border-zinc-600",
                                "focus:bg-white focus:border-gray-300",
                                "dark:focus:bg-zinc-700 dark:focus:border-zinc-500",
                                "focus-visible:ring-0 focus-visible:ring-offset-0",
                                "transition-all duration-200"
                            )}
                        />
                    </div>
                    {isFocus && (
                        <div className='flex justify-between items-center mt-2.5 ml-14 sm:ml-20'>
                            <PopoverEmoji
                                open={openEmoji}
                                onOpenChange={setOpenEmoji}
                                inputRef={inputRef}
                                onEmojiSelect={handleEmojiSelect}
                                POPOVER_ATTR={POPOVER_ATTR}
                            />
                            <div className='flex gap-2'>
                                <Button
                                    className='h-[32px]'
                                    isLoading={isMutating}
                                    onClick={handleSendComment}>
                                    <Send className='size-3.5'/>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SendComment