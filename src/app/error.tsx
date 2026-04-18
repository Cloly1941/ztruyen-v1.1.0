'use client'

// ** Next
import Link from "next/link";
import {useRouter} from "next/navigation";

// ** Shadcn ui
import {Button} from "@/components/ui/button";

type TErrorProps = {
    error: Error & { digest?: string }
    reset: () => void
}

const ErrorPage = ({error, reset}: TErrorProps) => {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
            <p className="text-[80px] md:text-[120px] leading-none select-none">
                ⚠️
            </p>
            <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">
                    Đã xảy ra lỗi
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs md:max-w-sm">
                    Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ fanpage để được hỗ trợ.
                </p>
                {error.digest && (
                    <p className="text-xs text-muted-foreground/60 mt-1">
                        Mã lỗi: {error.digest}
                    </p>
                )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.back()}>
                    Quay lại
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={reset}>
                    Thử lại
                </Button>
                <Button asChild className="w-full sm:w-auto dark:text-white">
                    <Link
                        href="https://facebook.com/Ztruyen-io-vn-61582484157563"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Liên hệ fanpage
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default ErrorPage