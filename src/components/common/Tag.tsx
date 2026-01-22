// ** React
import {HTMLAttributes} from "react";

// ** Next
import Link from 'next/link';

// ** class variance authority
import { cva, type VariantProps } from 'class-variance-authority';

// ** utils
import { cn } from '@/lib/utils';

const tagVariants = cva(
    'rounded-sm text-xs h-[20px] py-[1px] px-1.5 flex-shrink-0 text-white font-ui',
    {
        variants: {
            theme: {
                default: 'bg-white/25 text-white/90',
                gray: 'bg-[#76797a]',
                dark: 'bg-gray-700 opacity-80',
            },
        },
        defaultVariants: {
            theme: 'default',
        },
    }
);

export interface TagProps
    extends HTMLAttributes<HTMLLIElement>,
        VariantProps<typeof tagVariants> {
    href: string;
}

const Tag = (
    ({ children, href, className, theme, ...props }: TagProps) => {
        return (
            <li
                className={cn(tagVariants({ theme, className }))}
                {...props}
            >
                <Link href={href}>{children}</Link>
            </li>
        );
    }
);

export default Tag;