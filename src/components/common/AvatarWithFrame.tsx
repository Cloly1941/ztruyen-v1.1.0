// ** Next
import Image from "next/image";

// ** Component
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Lib
import {cn} from "@/lib/utils";

// ** Image
import AvatarFallBack from "@/public/avatar-fallback.webp";

type TAvatarWithFrameProps = {
    avatarUrl?: string;
    avatarName?: string;
    frameUrl?: string;
    frameName?: string;
    size?: number;
    className?: string;
};

const AvatarWithFrame = ({
                             avatarUrl,
                             avatarName,
                             frameName,
                             frameUrl,
                             size = 48,
                             className
                         }: TAvatarWithFrameProps) => {
    const fallbackAvatar = (
        <Image
            src={AvatarFallBack}
            alt="fallback"
            fill
            className="object-cover"
        />
    );

    if (!frameUrl) {
        const avatarSize = size * 0.8;

        return (
            <div
                style={{width: size, height: size}}
                className="flex items-center justify-center shrink-0"
            >
                <Avatar style={{width: avatarSize, height: avatarSize}}>
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={avatarName}/>}
                    <AvatarFallback asChild>
                        <div className="relative size-full">{fallbackAvatar}</div>
                    </AvatarFallback>
                </Avatar>
            </div>
        );
    }

    return (
        <div
            style={{width: size, height: size}}
            className={cn("relative shrink-0", className)}
        >
            {/* Avatar center */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <Avatar
                    style={{width: size * 0.68, height: size * 0.68}}
                    className="rounded-full"
                >
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={avatarName}/>}
                    <AvatarFallback asChild>
                        <div className="relative size-full">{fallbackAvatar}</div>
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Frame */}
            <Image
                src={frameUrl}
                alt={frameName || "frame"}
                fill
                sizes={`${size}px`}
                className="object-contain z-10 pointer-events-none"
            />
        </div>
    );
};

export default AvatarWithFrame;