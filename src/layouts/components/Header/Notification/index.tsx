'use client'

// ** React
import {useEffect, useState} from "react";

// ** Hooks
import {useAuth} from "@/hooks/common/useAuth";

// ** Icons
import {Bell} from "lucide-react";

// ** Shadcn ui
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// ** Skeleton
import ButtonSkeleton from "@/skeletons/layouts/ButtonSkeleton";

// ** Hooks
import useInfiniteLoad from "@/hooks/common/useInfiniteLoad";
import useGetMethod from "@/hooks/common/useGetMethod";
import useSentinel from "@/hooks/common/useSentinel";
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Layout components
import NotificationItem from "@/layouts/components/Header/Notification/NotificationItem";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

// ** Service
import {NotificationService} from "@/services/api/notification";

// ** Skeleton
import NotificationItemSkeleton from "@/skeletons/layouts/NotificationItemSkeleton";

// ** Type
import {INotification} from "@/types/api";

// ** Lib
import {REFRESH_EVENT} from "@/lib/invalidate-cache/events";
import DropdownAction from "@/layouts/components/Header/Notification/DropdownAction";
import {usePathname} from "next/navigation";

const LIMIT = 10;

const Notification = () => {

    const pathname = usePathname()

    const {isLogin, loading} = useAuth();
    const [open, setOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    // Fetch count
    const {data: firstPageMeta, mutate: mutateCount} = useGetMethod<IModelPaginateNotification<INotification>>({
        api: () => NotificationService.list({page: 1, limit: 1}),
        key: CONFIG_TAG.NOTIFICATION.COUNT,
        enabled: isLogin,
    });

    const totalCount = firstPageMeta?.meta.unreadCount ?? 0;

    // Fetch list
    const {data, isLoading, isValidating, loadMore, mutate: mutateList} = useInfiniteLoad<INotification>({
        key: CONFIG_TAG.NOTIFICATION.LIST,
        enabled: isLogin && hasOpened,
        api: (page) =>
            NotificationService.list({page, limit: LIMIT})
                .then(res => res.data as IModelPaginateNotification<INotification>),
    });

    // Mutate read all and delete all
    const {
        trigger: readAllTrigger,
        isMutating: isReadAllMutating
    } = useMutateMethod({
        api: () => NotificationService.readAll(),
        key: CONFIG_TAG.NOTIFICATION.READ_ALL,
        onSuccess: async () => {
            await mutateList()
        }
    })
    const {
        trigger: deleteAllTrigger,
        isMutating: isDeleteAllMutating
    } = useMutateMethod({
        api: () => NotificationService.deleteAll(),
        key: CONFIG_TAG.NOTIFICATION.DELETE_ALL,
        onSuccess: async () => {
            await mutateList()
            await mutateCount()
        }
    })

    // when change pathname revalidate
    useEffect(() => {
        if (!isLogin) return
        void mutateCount()
        if (hasOpened) {
            void mutateList()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    // Revalidate count and list
    useEffect(() => {
        const handler = async () => {
            await Promise.all([mutateCount(), mutateList()]);
        };
        window.addEventListener(REFRESH_EVENT, handler);
        return () => window.removeEventListener(REFRESH_EVENT, handler);
    }, [mutateCount, mutateList]);

    const handleOpenChange = (value: boolean) => {
        if (value && !hasOpened) setHasOpened(true);
        setOpen(value);
    };

    const {sentinelRef} = useSentinel({onIntersect: loadMore});

    const hasData = data && data.length > 0;
    const isFirstLoad = isLoading && !hasData;

    if (loading) return <ButtonSkeleton/>;

    return (
        <div>
            {isLogin && (
                <DropdownMenu modal={false} open={open} onOpenChange={handleOpenChange}>
                    <DropdownMenuTrigger asChild>
                        <div className="relative p-2.5 cursor-pointer rounded-xl">
                            <Bell className="size-4"/>
                            {totalCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5
                                              min-w-4 h-4 px-[3px]
                                              bg-red-500 dark:bg-amber-400/15 dark:text-amber-400 dark:border-amber-400/25
                                              text-white text-[10px] font-semibold
                                              rounded-full flex items-center justify-center
                                              ring-2 ring-background shadow-sm shadow-red-500/50 dark:shadow-amber-400/10
                                              animate-badge">
                                  {totalCount}
                                </span>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-90 pb-2 px-2 max-h-[36vh] md:max-h-[90vh] overflow-y-auto"
                                         align="center">
                        <div className='flex justify-between items-center'>
                            <DropdownMenuLabel className='font-bold mt-2 mb-0.5'>
                                Thông báo
                            </DropdownMenuLabel>

                            {hasData && (
                                <DropdownAction
                                    onDeleteTrigger={deleteAllTrigger}
                                    onReadTrigger={readAllTrigger}
                                    isLoading={isReadAllMutating || isDeleteAllMutating}
                                    type='MULTI'
                                />
                            )}
                        </div>
                        {(data.length <= 0 && !isLoading) && (
                            <div className="pt-20 pb-24 text-center text-sm text-muted-foreground">
                                Không có thông báo nào
                            </div>
                        )}
                        <DropdownMenuGroup>
                            {isFirstLoad ? (
                                <NotificationItemSkeleton/>
                            ) : (
                                data.map((item) => (
                                    <DropdownMenuItem
                                        key={item._id}
                                        asChild
                                    >
                                        <NotificationItem
                                            id={item._id}
                                            content={item.meta.contentPreview}
                                            type={item.type}
                                            comicName={item.meta.comicName}
                                            isRead={item.isRead}
                                            senderName={item.meta.senderName}
                                            senderAvatar={item.meta.senderAvatar || ''}
                                            mutateList={mutateList}
                                            mutateCount={mutateCount}
                                            comicSlug={item.meta.comicSlug}
                                            parentId={item.commentId}
                                            replyId={item.replyId}
                                            chapterId={item.meta.chapterId}
                                        />
                                    </DropdownMenuItem>
                                ))
                            )}
                            {(isValidating && hasData) && <NotificationItemSkeleton/>}
                            <div ref={sentinelRef}/>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export default Notification;