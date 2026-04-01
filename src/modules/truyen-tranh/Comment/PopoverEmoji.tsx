'use client'

// ** React
import {RefObject} from "react";

// ** Shadcn ui
import {Popover, PopoverContent, PopoverHeader, PopoverTrigger} from "@/components/ui/popover";

// ** Component
import Button from "@/components/common/Button";

// ** Module
import TabEmoji from "@/modules/truyen-tranh/Comment/TabEmoji";

// ** Icon
import {SmilePlus} from "lucide-react";

type TPopoverEmoji = {
    inputRef: RefObject<HTMLTextAreaElement | null>
    onEmojiSelect: (value: string) => void
    open: boolean
    onOpenChange: (open: boolean) => void
    POPOVER_ATTR: string
}

const PopoverEmoji = ({inputRef, onEmojiSelect, open, onOpenChange, POPOVER_ATTR}: TPopoverEmoji) => {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size='icon'
                    className='size-8 px-0'
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <SmilePlus className='text-third'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                {...{[POPOVER_ATTR]: ""}}
                className='!w-[361.4px] text-[#61666D]'
                align='start'
                onMouseDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => {
                    const target = e.target as HTMLElement
                    if (inputRef.current?.contains(target)) {
                        e.preventDefault()
                    }
                }}
            >
                <PopoverHeader>
                    <TabEmoji onEmojiSelect={onEmojiSelect}/>
                </PopoverHeader>
            </PopoverContent>
        </Popover>
    )
}

export default PopoverEmoji