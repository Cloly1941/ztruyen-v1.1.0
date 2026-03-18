// ** Next
import Image from "next/image";

// ** Component
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ** Lib
import { cn } from "@/lib/utils";

// ** Image
import AvatarFallBack from '@/public/avatar-fallback.webp'

type TAvatarWithFrameProps = {
    avatarUrl?: string;
    avatarName?: string;
    frameUrl?: string;
    frameName?: string;
    className?: string;
    classAvatar?: string;
};

const AvatarWithFrame = ({
                             avatarUrl,
                             avatarName,
                             frameName,
                             frameUrl,
                             className,
                             classAvatar,
                         }: TAvatarWithFrameProps) => {

    if (!frameUrl) {
        return (
            <div className="relative">
                <Avatar className={classAvatar}>
                    <AvatarImage src={avatarUrl} alt={avatarName} />
                    <AvatarFallback>
                        <Image src={AvatarFallBack} alt='ảnh đại diện dự phòng' width={48} height={48} className='object-cover'/>
                    </AvatarFallback>
                </Avatar>
            </div>
        )
    }

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <Image
                src={frameUrl}
                alt={frameName || ''}
                fill
                className="object-cover pointer-events-none z-10"
            />

            <div className="relative w-[60%] h-[60%] z-0">
                <Avatar className="size-full">
                    <AvatarImage src={avatarUrl} alt={avatarName} />
                    <AvatarFallback className="text-xs">
                        <Image src={AvatarFallBack} alt='ảnh đại diện dự phòng' width={48} height={48} className='object-cover'/>
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

export default AvatarWithFrame;