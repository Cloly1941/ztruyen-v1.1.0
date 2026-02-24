'use client'

// ** React
import {forwardRef} from "react";

// ** Next
import Image, {type ImageProps} from 'next/image';

// ** class variance authority
import {cva, type VariantProps} from 'class-variance-authority';

// ** utils
import {cn} from '@/lib/utils';

// ** Config
import {CONFIG_IMAGE} from "@/configs/image";

const comicImageVariants = cva('aspect-[3/4] object-cover', {
    variants: {
        rounded: {
            default: '',
            sm: 'rounded-[2px]',
            md: 'rounded-[8px]'
        },
        size: {
            default: '',
            full: 'size-full',
        },
    },
    defaultVariants: {
        rounded: 'default',
        size: 'default',
    },
});

type ComicImageSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl';

interface ComicImageDimension {
    width: number;
    height: number;
}

const comicImageSizes: Record<ComicImageSize, ComicImageDimension> = {
    xs: {width: 62, height: 83},
    sm: {width: 100, height: 240},
    default: {width: 135, height: 180},
    lg: {width: 180, height: 240},
    xl: {width: 192.7, height: 258},
    '2xl': {width: 219, height: 288},
    '3xl': {width: 522, height: 300},
};

export interface ComicImageProps
    extends ImageProps,
        VariantProps<typeof comicImageVariants> {
    imgSize?: ComicImageSize;
}

const ComicImage = forwardRef<HTMLImageElement, ComicImageProps>(
    ({size, rounded, className, imgSize = 'default', src, alt, ...props}, ref) => {

        const key = imgSize in comicImageSizes ? imgSize : 'default';
        const safeSize = comicImageSizes[key as ComicImageSize];
        const {width, height} = safeSize;

        return (
            <Image
                ref={ref}
                src={src!}
                alt={alt}
                width={width}
                height={height}
                placeholder={CONFIG_IMAGE.BLUR_DATA_URL as 'data:image/'}
                onError={(e) => {
                    e.currentTarget.src = CONFIG_IMAGE.BLUR_DATA_URL
                }}
                className={cn(comicImageVariants({size, rounded, className}))}
                {...props}
            />
        );
    }
);

ComicImage.displayName = 'ComicImage';

export default ComicImage;
