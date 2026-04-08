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

type TDropdownAction = {
    onReadTrigger: () => Promise<unknown>;
    onDeleteTrigger: () => Promise<unknown>;
    isLoading?: boolean;
    type?: 'SINGLE' | 'MULTI';
}

const DropdownAction = ({
                            onDeleteTrigger, onReadTrigger, isLoading, type = 'SINGLE'
                        }: TDropdownAction) => {

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger disabled={isLoading}>
                {
                    isLoading ? (
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
                    <DropdownMenuItem onClick={() => onReadTrigger()}>
                        <Check/>
                        {type === 'SINGLE' ? 'Đánh dấu đã đọc' : 'Đánh dấu là đã đọc tât cả'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteTrigger()}>
                        <div className='text-destructive flex items-center gap-2 cursor-pointer w-full'>
                            <X className='text-destructive'/>
                            {type === 'SINGLE' ? 'Xóa thông báo' : 'Xóa tất cả thông báo'}
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownAction;