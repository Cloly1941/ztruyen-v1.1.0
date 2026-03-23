// ** Component
import AvatarWithFrame from "@/components/common/AvatarWithFrame";

// ** Lib
import {cn} from "@/lib/utils";

type TAvatarWithName = {
    size: number
    name: string
    avatarUrl?: string
    frameName?: string
    frameUrl?: string
    className?: string
}

const AvatarWithName = ({ size, name, avatarUrl, frameName, frameUrl, className }: TAvatarWithName) => {
    return (
        <div className='flex items-start'>
            <div className={cn('mr-2', size === 60 && 'mr-2 sm:mx-2')}>
                <AvatarWithFrame
                    size={size}
                    avatarName={name}
                    avatarUrl={avatarUrl}
                    frameName={frameName}
                    frameUrl={frameUrl}
                />
            </div>
            <div className={cn(
                'text-[#61666D] text-[15px] truncate dark:text-gray-300',
                size === 60 ? 'mt-3' : 'mt-1',
                className
            )}>
                {name}
            </div>
        </div>
    )
}

export default AvatarWithName