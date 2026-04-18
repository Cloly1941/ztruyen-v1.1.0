'use client'

// ** React
import {useEffect, useState} from 'react';

// ** Lib
import {onMessage, getFirebaseMessaging} from '@/lib/fcm/firebase';

// ** React hot toast
import toast from 'react-hot-toast';

// ** Hook
import {useAuth} from '@/hooks/common/useAuth';
import useMutateMethod from '@/hooks/common/useMutateMethod';

// ** Icons
import {X} from 'lucide-react';

// ** Component
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

// ** Lib
import {dispatchRefresh} from "@/lib/invalidate-cache/events";
import {cn} from "@/lib/utils";

// ** Type
import {INotificationFCM, NotificationType} from "@/types/api";
import {fallbackAvatar} from "@/components/common/AvatarWithFrame";
import {getBadgeNotification} from "@/utils/getBadgeNotification";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import DialogNotificationContent from "@/layouts/components/Header/Notification/DialogNotificationContent";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

// ** Service
import {NotificationService} from "@/services/api/notification";

// ** SWR
import {mutate} from "swr";

export type NotificationFCMType = NotificationType | 'system';

type TDialogData = {
    open: boolean;
    comicName: string;
    comicSlug: string;
    commentId: string;
    replyId: string;
    chapterId: string;
    notificationId: string;
}

const initialDialogData: TDialogData = {
    open: false,
    comicName: '',
    comicSlug: '',
    commentId: '',
    replyId: '',
    chapterId: '',
    notificationId: '',
}

const NotificationListener = () => {
    const {isLogin} = useAuth();
    const [dialogData, setDialogData] = useState<TDialogData>(initialDialogData);

    const {trigger: readTrigger} = useMutateMethod({
        api: (id: string) => NotificationService.read(id),
        key: CONFIG_TAG.NOTIFICATION.READ,
        onSuccess: async () => {
            await mutate(CONFIG_TAG.NOTIFICATION.COUNT)
            await mutate(CONFIG_TAG.NOTIFICATION.LIST)
        }
    })

    useEffect(() => {
        if (!isLogin) return;

        if (typeof window === 'undefined') return;
        if (!('Notification' in window)) return;

        let unsubscribe: (() => void) | undefined;

        try {
            const messaging = getFirebaseMessaging();
            if (!messaging) return;

            unsubscribe = onMessage(messaging, (payload) => {

                const data = (payload.data ?? {}) as Partial<INotificationFCM> & {
                    title?: string;
                    body?: string;
                };

                const title = data.title ?? '';
                const body = data.body ?? '';
                const avatarUrl = data.senderAvatar ?? '';
                const type: NotificationFCMType = data.type ?? 'system';
                const senderName = data.senderName ?? '';
                const comicName = data.comicName ?? '';
                const comicSlug = data.comicSlug ?? '';
                const commentId = data.commentId ?? '';
                const replyId = data.replyId ?? '';
                const chapterId = data.chapterId ?? '';
                const notificationId = data.notificationId ?? '';

                const badge = getBadgeNotification[type];

                if (type === 'REPLY_COMMENT' || type === 'LIKE_COMMENT') {
                    dispatchRefresh();
                }

                toast.custom(
                    (t) => (
                        <div
                            onClick={async () => {
                                toast.dismiss(t.id);
                                if (notificationId) {
                                    await readTrigger(notificationId);
                                }
                                setDialogData({
                                    open: true,
                                    comicName,
                                    comicSlug,
                                    commentId,
                                    replyId,
                                    chapterId,
                                    notificationId,
                                });
                            }}
                            className={cn(
                                'notification-wrapper',
                                t.visible ? 'animate-enter' : 'animate-leave',
                            )}
                        >
                            {/* Header */}
                            <p className="notification-header">Thông báo mới</p>

                            {/* Body */}
                            <div className="notification-body">
                                {/* Avatar + badge */}
                                <div className="relative flex-shrink-0">
                                    <Avatar className="size-10 sm:size-12">
                                        <AvatarImage src={avatarUrl} alt={senderName}/>
                                        <AvatarFallback asChild>
                                            <div className="relative size-full">{fallbackAvatar}</div>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className="absolute -bottom-1 -right-1 size-5 sm:size-[22px] rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center"
                                        style={{background: badge.bg}}
                                    >
                                        {badge.icon}
                                    </div>
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <p className="text-[13px] leading-snug">
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 mr-1">
                                        {senderName}
                                    </span>
                                        <span className="text-zinc-500 dark:text-zinc-400">
                                        {title}
                                    </span>
                                    </p>
                                    {body && (
                                        <p className="notification-desc line-clamp-4 pl-2.5 border-l-2 border-zinc-300 dark:border-zinc-600">
                                            {body}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Close */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toast.dismiss(t.id);
                                }}
                                className="notification-close"
                            >
                                <X/>
                            </button>
                        </div>
                    ),
                    {duration: 5000, position: 'top-right'},
                );
            });
        } catch (err) {
            console.warn('[FCM] onMessage setup failed:', err);
        }

        return () => {
            try {
                unsubscribe?.();
            } catch {
            }
        };
    }, [isLogin]);

    return (
        <Dialog
            open={dialogData.open}
            onOpenChange={(open) => setDialogData(prev => ({...prev, open}))}
        >
            <DialogContent className="dialog-comment-content">
                <VisuallyHidden>
                    <DialogTitle>{dialogData.comicName}</DialogTitle>
                </VisuallyHidden>
                <DialogNotificationContent
                    comicName={dialogData.comicName}
                    comicSlug={dialogData.comicSlug}
                    parentId={dialogData.commentId}
                    replyId={dialogData.replyId}
                    type={dialogData.chapterId ? 'reading' : 'detail'}
                />
            </DialogContent>
        </Dialog>
    );
};

export default NotificationListener;