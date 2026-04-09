// ** React
import {CSSProperties} from "react";

// ** Next
import Image from "next/image";

// ** Component
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Lib
import {cn} from "@/lib/utils";

// ** Config
import {CONFIG_IMG} from "@/configs/img";

type TAvatarWithFrameProps = {
    avatarUrl?: string;
    avatarName?: string;
    frameUrl?: string;
    frameName?: string;
    size?: number;
    mobileSize?: number;
    className?: string;
};

export const fallbackAvatar = (
    <Image
        src={CONFIG_IMG.AVATAR_FALLBACK}
        alt="fallback"
        fill
        className="object-cover"
    />
);

const AvatarWithFrame = ({
                             avatarUrl,
                             avatarName,
                             frameName,
                             frameUrl,
                             size = 48,
                             mobileSize,
                             className,
                         }: TAvatarWithFrameProps) => {
    const hasFrame = !!frameUrl;

    return (
        <div
            style={
                {
                    "--avatar-size": `${mobileSize ?? size}px`,
                    "--avatar-size-sm": `${size}px`,
                } as CSSProperties
            }
            className={cn(
                "relative shrink-0",
                "[width:var(--avatar-size)] [height:var(--avatar-size)]",
                "sm:[width:var(--avatar-size-sm)] sm:[height:var(--avatar-size-sm)]",
                className
            )}
        >
            {/* Avatar */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <Avatar
                    className={cn(
                        hasFrame
                            ? "[width:calc(var(--avatar-size)*0.68)] [height:calc(var(--avatar-size)*0.68)] sm:[width:calc(var(--avatar-size-sm)*0.68)] sm:[height:calc(var(--avatar-size-sm)*0.68)]"
                            : "[width:calc(var(--avatar-size)*0.8)] [height:calc(var(--avatar-size)*0.8)] sm:[width:calc(var(--avatar-size-sm)*0.8)] sm:[height:calc(var(--avatar-size-sm)*0.8)]"
                    )}
                >
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={avatarName}/>}
                    <AvatarFallback asChild>
                        <div className="relative size-full">{fallbackAvatar}</div>
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Frame */}
            {hasFrame && (
                <Image
                    src={frameUrl}
                    alt={frameName || "frame"}
                    fill
                    sizes={`(max-width: 768px) ${mobileSize ?? size}px, ${size}px`}
                    className="object-contain z-10 pointer-events-none"
                />
            )}
        </div>
    );
};

export default AvatarWithFrame;