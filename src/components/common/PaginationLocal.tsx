'use client'

import { type ReactNode } from 'react'
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
import { cn } from '@/lib/utils'
import { getPaginationPages } from '@/utils/pagination'

interface PaginationLocalProps {
    totalCount: number
    pageSize: number
    page: number
    onPageChange: (page: number) => void
    pageSizeOptions?: number[]
    onPageSizeChange?: (size: number) => void
    maxVisiblePages?: number
}

export function PaginationLocal({
                                    totalCount,
                                    pageSize,
                                    page,
                                    onPageChange,
                                    pageSizeOptions,
                                    onPageSizeChange,
                                    maxVisiblePages = 7,
                                }: PaginationLocalProps) {
    const totalPageCount = Math.ceil(totalCount / pageSize)

    const renderPageNumbers = (): ReactNode[] => {
        return getPaginationPages(page, totalPageCount, maxVisiblePages).map((p, index) =>
            p === '...' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                </PaginationItem>
            ) : (
                <PaginationItem key={p}>
                    <PaginationLink
                        isActive={page === p}
                        onClick={() => onPageChange(p as number)}
                        className="cursor-pointer"
                    >
                        {p}
                    </PaginationLink>
                </PaginationItem>
            )
        )
    }

    if (totalPageCount <= 1 && !pageSizeOptions) return null

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
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