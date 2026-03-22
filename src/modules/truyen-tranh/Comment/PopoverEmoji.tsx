'use client'

// ** React
import {Ref, useState} from "react";

// ** Shadcn ui
import {Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger} from "@/components/ui/popover";
import Button from "@/components/common/Button";

// ** Icon
import {SmilePlus} from "lucide-react";
import {cn} from "@/lib/utils";

type TPopoverEmoji = {
    popoverRef: Ref<HTMLDivElement | null>
}

const PopoverEmoji = ({popoverRef}: TPopoverEmoji) => {

    const [emoji, setEmoji] = useState(1)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size='icon' className='size-8 px-0'>
                    <SmilePlus className='text-third'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                ref={popoverRef}
                className='!w-[361px] text-[#61666D]'
                align='start'>
                <PopoverHeader>
                    <PopoverTitle
                        className='pt-3.5 pb-1.5 text-sm px-[15px]'>Kaomoji</PopoverTitle>
                    <div className='h-[196px] overflow-y-auto'>
                        <div className='flex flex-wrap px-3'>
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className='px-2 py-[5px] rounded-md hover:bg-[#e3e5e7] cursor-pointer'>(￣▽￣)</div>
                            ))}
                        </div>
                    </div>
                    <div className='flex bg-[#f1f2f3]'>
                        <div
                            onClick={() => setEmoji(1)}
                            className={cn('w-[58px] h-[36px] cursor-pointer flex justify-center items-center hover:bg-[#E3E5E7]',
                                emoji === 1 && 'bg-white'
                            )}>
                            (￣▽￣)
                        </div>
                        <div
                            onClick={() => setEmoji(2)}
                            className={cn('w-[58px] h-[36px] cursor-pointer flex justify-center items-center hover:bg-[#E3E5E7]',
                                emoji === 2 && 'bg-white'
                            )}>
                            (￣3￣)
                        </div>
                        <div
                            onClick={() => setEmoji(3)}
                            className={cn('w-[58px] h-[36px] cursor-pointer flex justify-center items-center hover:bg-[#E3E5E7]',
                                emoji === 3 && 'bg-white'
                            )}>
                            ￣▽￣
                        </div>
                    </div>
                </PopoverHeader>
            </PopoverContent>
        </Popover>
    )
}

export default PopoverEmoji