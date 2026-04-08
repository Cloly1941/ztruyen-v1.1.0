'use client'

// ** Shadcn ui
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ** Icons
import {Check, Ellipsis, Loader2, X} from "lucide-react";

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Tag
import {CONFIG_TAG} from "@/configs/tag";

// ** Service
import {NotificationService} from "@/services/api/notification";

type TDropdownAction = {
    mutateNotification: () => Promise<unknown>;
    mutateTotal: () => Promise<unknown>;
}

const DropdownAction = ({mutateNotification, mutateTotal}: TDropdownAction) => {

    const {trigger: readAllTrigger, isMutating: isReadAllMutating} = useMutateMethod({
        api: () => NotificationService.readAll(),
        key: CONFIG_TAG.NOTIFICATION.READ_ALL,
        onSuccess: async () => {
            await mutateNotification()
        }
    })

    const {trigger: deleteAllTrigger, isMutating: isDeleteAllMutating} = useMutateMethod({
        api: () => NotificationService.deleteAll(),
        key: CONFIG_TAG.NOTIFICATION.DELETE_ALL,
        onSuccess: async () => {
            await mutateNotification()
            await mutateTotal()
        }
    })

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger disabled={isReadAllMutating || isDeleteAllMutating}>
                {
                    isReadAllMutating || isDeleteAllMutating ? (
                        <Loader2 className='size-4 mr-1 animate-spin text-primary disabled cursor-default'/>
                    ) : (
                        <Ellipsis className='size-4 mr-1 text-setting'/>
                    )
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
            >
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => readAllTrigger()}>
                        <Check/>
                        Đánh dấu là đã đọc tât cả
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteAllTrigger()}>
                        <div className='text-destructive flex items-center gap-2 cursor-pointer w-full'>
                            <X className='text-destructive'/>
                            Xoá tất cả bình luận
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownAction;