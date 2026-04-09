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
    chapterPage?: number | null
    chapterName?: string | null
    type?: "detail" | "reading";
    mobileSize?: number
}

const AvatarWithName = (
    {
        size, name, avatarUrl, frameName, frameUrl,
        className, chapterName, chapterPage, type = 'detail',
        mobileSize
    }
    : TAvatarWithName) => {
    return (
        <div className='flex items-start'>
            <div className={cn('mr-2', size === 60 && 'mr-2 sm:mx-2')}>
                <AvatarWithFrame
                    size={size}
                    mobileSize={mobileSize}
                    avatarName={name}
                    avatarUrl={avatarUrl}
                    frameName={frameName}
                    frameUrl={frameUrl}
                />
            </div>
            <div className={cn(
                'text-[#61666D] text-sm sm:text-[15px] truncate dark:text-gray-300',
                size === 60 ? 'mt-1 sm:mt-3' : 'mt-1',
                className
            )}>
                {name}
                {chapterName && (
                    <>
                        <span
                            className='inline-block mx-1 sm:mx-1.5 text-xs sm:text-[13px]'>
                            tại {type === 'detail' ? 'chương' : 'ảnh'}
                        </span>
                        <span className='text-link cursor-pointer text-xs sm:text-sm'>
                            {type === 'detail' && `Chương ${chapterName}`} {chapterPage}P
                        </span>
                    </>
                )}
            </div>

        </div>
    )
}

export default AvatarWithName