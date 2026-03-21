'use client'

// ** Next
import Link from "next/link";
import Image from "next/image";

// ** React
import {useEffect, useRef, useState} from "react";

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

// ** Image
import AvatarFallBack from "@/public/avatar-fallback.webp";

// ** Icon
import {Send} from "lucide-react";

// ** Toast
import toast from "react-hot-toast";

export type TSendCommentPayload = {
    comicSlug: string
    comicName: string
    content: string
    parent?: string | null
    replyTo?: string | null
    chapterName?: string | null
    page?: number | null
}

export type TSendReplyPayload = {
    parent: string
    replyTo?: string | null
    content: string
}

export type TSendComment = {
    comicSlug: string
    comicName: string
    mutate: () => void
    mutateReply?: () => void
    parent?: string | null
    replyTo?: string | null
    user?: IUserProfile
    replyName?: string | null
}

const SendComment = ({
                         comicSlug,
                         comicName,
                         mutate,
                         mutateReply,
                         parent = null,
                         replyTo = null,
                         user,
                         replyName
                     }: TSendComment) => {
    const [isFocus, setIsFocus] = useState(false);
    const [comment, setComment] = useState<string>("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {trigger, isMutating} = useMutateMethod<void, TSendCommentPayload | TSendReplyPayload>({
        api: (arg) => parent
            ? CommentService.createReply(arg as TSendReplyPayload)
            : CommentService.create(arg as TSendCommentPayload),
        key: CONFIG_TAG.COMMENT.LIST,
        onSuccess: async (data) => {
            toast.success(data.message)
            if (parent) {
                mutateReply?.()
                mutate()
            } else {
                mutate()
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
            const isClickInsidePopover = popoverRef.current?.contains(target);
            if (!isClickInsideWrapper && !isClickInsidePopover) {
                setIsFocus(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendComment = async () => {
        if (!comment) {
            return toast.error('Bình luận không được để trống !')
        }

        await trigger(
            parent
                ? {parent, replyTo, content: comment} satisfies TSendReplyPayload
                : {comicName, comicSlug, content: comment} satisfies TSendCommentPayload
        )
    }

    return (
        <div className='mt-6 flex'>
            {!user ? (
                <>
                    <div className='relative size-12 mx-4 shrink-0'>
                        <Image
                            src={AvatarFallBack}
                            alt='ảnh đại diện dự phòng'
                            fill
                            placeholder='blur'
                            className='object-cover rounded-full'
                        />
                    </div>
                    <div
                        className='flex justify-center items-center bg-[#f1f2f3] dark:bg-zinc-800 text-sm w-full rounded-md text-third'>
                        Bạn cần
                        <Link href='/dang-nhap'>
                            <Button size='sm' className='text-xs mx-2 h-6 px-2.5'>Đăng nhập</Button>
                        </Link>
                        để bình luận đó nhe (・ω・)
                    </div>
                </>
            ) : (
                <div className='w-full' ref={wrapperRef}>
                    <div className='flex'>
                        <div className='mx-2'>
                            <AvatarWithFrame
                                size={60}
                                avatarName={user.name}
                                avatarUrl={user.avatar?.url}
                                frameName={user.avatar_frame?.name}
                                frameUrl={user.avatar_frame?.image?.url}
                            />
                        </div>
                        <input
                            ref={inputRef}
                            onFocus={() => setIsFocus(true)}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={parent ? `Phản hồi @${replyName ?? ""}: ...` : "Viết bình luận..."}
                            className="
                                w-full py-2 px-4 text-sm outline-none rounded-md
                                bg-[#f1f2f3] dark:bg-zinc-800
                                border border-transparent
                                hover:bg-white hover:border-gray-300
                                dark:hover:bg-zinc-700 dark:hover:border-zinc-600
                                focus:bg-white focus:border-gray-300
                                dark:focus:bg-zinc-700 dark:focus:border-zinc-500
                                transition-all duration-200"
                        />
                    </div>
                    {isFocus && (
                        <div className='flex justify-between items-center mt-2.5 ml-20'>
                            <PopoverEmoji popoverRef={popoverRef}/>
                            <div className='flex gap-2'>
                                <Button
                                    sizeCustom='xs'
                                    isLoading={isMutating}
                                    onClick={handleSendComment}>
                                    <Send/>
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