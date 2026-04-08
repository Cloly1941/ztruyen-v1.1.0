'use client';

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Component
import DropdownAction from "@/layouts/components/Header/Notification/DropdownAction";

// ** Lib
import {cn} from "@/lib/utils";

// ** Type
import {NotificationType} from "@/types/api";

// ** Component
import {fallbackAvatar} from "@/components/common/AvatarWithFrame";

// ** Util
import {getBadgeNotification} from "@/utils/getBadgeNotification";

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Service
import {NotificationService} from "@/services/api/notification";
import {CONFIG_TAG} from "@/configs/tag";

type TNotificationItem = {
    id: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    isRead: boolean;
    comicName: string;
    type: NotificationType;
    mutateList: () => Promise<unknown>;
    mutateCount: () => Promise<unknown>;
}

const NotificationItem = ({
                              id, senderName, senderAvatar, content, comicName, isRead,
                              type, mutateList, mutateCount
                          }: TNotificationItem) => {

    const badge = getBadgeNotification[type];

    // Mutate methods
    const {
        trigger: readTrigger,
        isMutating: isReadMutating
    } = useMutateMethod({
        api: () => NotificationService.read(id),
        key: CONFIG_TAG.NOTIFICATION.READ,
        onSuccess: async () => {
            await mutateList()
        }
    })
    const {
        trigger: deleteTrigger,
        isMutating: isDeleteMutating
    } = useMutateMethod({
        api: () => NotificationService.delete(id),
        key: CONFIG_TAG.NOTIFICATION.DELETE,
        onSuccess: async () => {
            await mutateList()
            await mutateCount()
        }
    })

    return (
        <div className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm">
            <div className='flex gap-3 items-center py-2 relative'>
                <div className='relative flex-shrink-0'>
                    <Avatar className='size-14'>
                        <AvatarImage src={senderAvatar} alt={senderName}/>
                        <AvatarFallback asChild>
                            <div className="relative size-full">{fallbackAvatar}</div>
                        </AvatarFallback>
                    </Avatar>

                    <div
                        className='absolute -bottom-1 -right-1 rounded-full size-6 bg-primary flex justify-center items-center'
                        style={{background: badge.bg}}
                    >
                        {badge.icon}
                    </div>
                </div>
                <div className={cn('min-w-0', isRead ? 'opacity-60' : '')}>
                    <p className='line-clamp-3 break-words'>
                        <span className='text-sm font-medium'>{senderName}</span>
                        {' '}
                        <span className='text-xs text-muted-foreground'>
                        {type === 'REPLY_COMMENT' ? 'đã phản hồi về ' : 'đã thích '}
                            bình luận của bạn tại truyện {' '}
                            <span className='text-primary'>{comicName}</span>

                        : {content}
                    </span>
                    </p>
                </div>
                {!isRead && <div className='rounded-full size-2 bg-primary flex-shrink-0'/>}
                <div>
                    <DropdownAction
                        onReadTrigger={readTrigger}
                        onDeleteTrigger={deleteTrigger}
                        isLoading={isReadMutating || isDeleteMutating}
                    />
                </div>
            </div>
        </div>
    )
}

export default NotificationItem