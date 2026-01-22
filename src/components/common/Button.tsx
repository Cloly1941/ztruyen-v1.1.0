// ** React
import {ComponentProps} from "react";

// ** Components
import { Button as ShadcnButton } from '@/components/ui/button'

// ** lib
import {cn} from "@/lib/utils";

// ** cva
import {cva, VariantProps} from "class-variance-authority";

const buttonVariants = cva(
    "cursor-pointer",
    {
        variants: {
            shape: {
                normal: "rounded-md",
                pill: "rounded-full",
            },
            width: {
                auto: "",
                full: "w-full",
            },
            sizeCustom: {
                sm: "px-4 py-2 text-xs",
                md: "px-5 py-2.5 text-sm",
            },
        },
        defaultVariants: {
            shape: "normal",
            width: "auto",
            sizeCustom: "md",
        },
    }
)

interface ButtonProps
    extends ComponentProps<typeof ShadcnButton>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean
}

const Button = ({
                    shape,
                    width,
                    sizeCustom,
                    isLoading,
                    className,
                    children,
                    disabled,
                    ...props
                }: ButtonProps) => {
    return (
        <ShadcnButton
            className={cn(buttonVariants({ shape, width, sizeCustom }), className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? "Đợi xíu nhe~" : children}
        </ShadcnButton>
    )
}

export default Button