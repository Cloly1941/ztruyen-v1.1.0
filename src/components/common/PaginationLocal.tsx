'use client'

// ** React
import { type ReactNode } from 'react'

// ** Shadcn ui
import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// ** Utils
import { cn } from '@/lib/utils'

interface PaginationLocalProps {
    totalCount: number
    pageSize: number
    page: number
    onPageChange: (page: number) => void
    pageSizeOptions?: number[]
    onPageSizeChange?: (size: number) => void
}

export function PaginationLocal({
                                    totalCount,
                                    pageSize,
                                    page,
                                    onPageChange,
                                    pageSizeOptions,
                                    onPageSizeChange,
                                }: PaginationLocalProps) {
    const totalPageCount = Math.ceil(totalCount / pageSize)

    const renderPageNumbers = () => {
        const items: ReactNode[] = []
        const maxVisiblePages = 7

        if (totalPageCount <= maxVisiblePages) {
            for (let i = 1; i <= totalPageCount; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={page === i}
                            onClick={() => onPageChange(i)}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                )
            }
            return items
        }

        let start: number
        let end: number

        switch (true) {
            case page <= 3:
                start = 2
                end = Math.min(5, totalPageCount - 1)
                break
            case page >= totalPageCount - 2:
                start = Math.max(2, totalPageCount - 4)
                end = totalPageCount - 1
                break
            default:
                start = page - 1
                end = page + 1
        }

        items.push(
            <PaginationItem key={1}>
                <PaginationLink
                    isActive={page === 1}
                    onClick={() => onPageChange(1)}
                    className="cursor-pointer"
                >
                    1
                </PaginationLink>
            </PaginationItem>
        )

        if (start > 2) {
            items.push(
                <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                </PaginationItem>
            )
        }

        for (let i = start; i <= end; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={page === i}
                        onClick={() => onPageChange(i)}
                        className="cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        if (end < totalPageCount - 1) {
            items.push(
                <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                </PaginationItem>
            )
        }

        items.push(
            <PaginationItem key={totalPageCount}>
                <PaginationLink
                    isActive={page === totalPageCount}
                    onClick={() => onPageChange(totalPageCount)}
                    className="cursor-pointer"
                >
                    {totalPageCount}
                </PaginationLink>
            </PaginationItem>
        )

        return items
    }

    if (totalPageCount <= 1 && !pageSizeOptions) return null

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            {/* Page size select */}
            {pageSizeOptions && onPageSizeChange && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="whitespace-nowrap">Hiển thị</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(value) => {
                            onPageSizeChange(Number(value))
                            onPageChange(1)
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="whitespace-nowrap">/ {totalCount} kết quả</span>
                </div>
            )}

            {/* Pagination */}
            {totalPageCount > 1 && (
                <ShadcnPagination className={cn(pageSizeOptions && "sm:justify-end")}>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => { if (page > 1) onPageChange(page - 1) }}
                                aria-disabled={page === 1}
                                className={cn(
                                    "cursor-pointer",
                                    page === 1 && "pointer-events-none opacity-50"
                                )}
                            />
                        </PaginationItem>

                        {renderPageNumbers()}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => { if (page < totalPageCount) onPageChange(page + 1) }}
                                aria-disabled={page === totalPageCount}
                                className={cn(
                                    "cursor-pointer",
                                    page === totalPageCount && "pointer-events-none opacity-50"
                                )}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </ShadcnPagination>
            )}
        </div>
    )
}