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

const comicImageVariants = cva('relative aspect-[3/4] overflow-hidden', {
    variants: {
        rounded: {
            default: '',
            sm: 'rounded-[2px]',
            md: 'rounded-[8px]'
        },
        size: {
            default: 'w-[135px]',
            xs: 'w-[62px]',
            sm: 'w-[100px]',
            lg: 'w-[180px]',
            xl: 'w-[192.7px]',
            '2xl': 'w-[219px]',
            '3xl': 'w-[522px]',
            full: 'w-full',
        },
    },
    defaultVariants: {
        rounded: 'default',
        size: 'default',
    },
});

export interface ComicImageProps
    extends Omit<ImageProps, 'width' | 'height' | 'fill'>,
        VariantProps<typeof comicImageVariants> {
    wrapperClassName?: string;
}

const ComicImage = forwardRef<HTMLImageElement, ComicImageProps>(
    ({size, rounded, className, wrapperClassName, src, alt, ...props}, ref) => {
        return (
            <div className={cn(comicImageVariants({size, rounded}), wrapperClassName)}>
                <Image
                    ref={ref}
                    src={src!}
                    alt={alt}
                    fill
                    placeholder={CONFIG_IMAGE.BLUR_DATA_URL as 'data:image/'}
                    onError={(e) => {
                        e.currentTarget.src = CONFIG_IMAGE.BLUR_DATA_URL
                    }}
                    className={cn('object-cover', className)}
                    {...props}
                />
            </div>
        );
    }
);

ComicImage.displayName = 'ComicImage';

export default ComicImage;