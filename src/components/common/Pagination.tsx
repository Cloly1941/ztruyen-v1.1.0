'use client';

// ** Next
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

// ** React
import { type ReactNode, useCallback } from 'react';

// ** Shadcn ui
import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

// ** Utils
import { cn } from '@/lib/utils';

export interface PaginationProps {
    pageSizeSelectOptions?: {
        pageSizeSearchParam?: string;
        pageSizeOptions: number[];
    };
    totalCount: number;
    pageSize: number;
    page: number;
    pageSearchParam?: string;
}

export function Pagination({
                               pageSizeSelectOptions,
                               pageSize,
                               totalCount,
                               page,
                               pageSearchParam,
                           }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPageCount = Math.ceil(totalCount / pageSize);

    const buildLink = useCallback(
        (newPage: number) => {
            const key = pageSearchParam || 'trang';
            const newSearchParams = new URLSearchParams(searchParams || undefined);
            newSearchParams.set(key, String(newPage));
            return `${pathname}?${newSearchParams.toString()}`;
        },
        [searchParams, pathname, pageSearchParam]
    );

    const goToPage = (newPage: number) => {
        router.push(buildLink(newPage));
    };

    const navToPageSize = useCallback(
        (newPageSize: number) => {
            const key = pageSizeSelectOptions?.pageSizeSearchParam || 'pageSize';

            const newSearchParams = new URLSearchParams(searchParams || undefined);
            newSearchParams.delete('trang');

            if (pageSearchParam) {
                newSearchParams.delete(pageSearchParam);
            }

            newSearchParams.set(key, String(newPageSize));

            router.push(`${pathname}?${newSearchParams.toString()}`);
        },
        [searchParams, pathname, pageSizeSelectOptions, pageSearchParam, router]
    );

    const renderPageNumbers = () => {
        const items: ReactNode[] = [];
        const maxVisiblePages = 7;

        if (totalPageCount <= maxVisiblePages) {
            for (let i = 1; i <= totalPageCount; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={page === i}
                            href={buildLink(i)}
                            onClick={(e) => {
                                e.preventDefault();
                                goToPage(i);
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
            return items;
        }

        let start: number;
        let end: number;

        switch (true) {
            case page <= 3:
                start = 2;
                end = Math.min(5, totalPageCount - 1);
                break;

            case page >= totalPageCount - 2:
                start = Math.max(2, totalPageCount - 4);
                end = totalPageCount - 1;
                break;

            default:
                start = page - 1;
                end = page + 1;
        }

        items.push(
            <PaginationItem key={1}>
                <PaginationLink
                    isActive={page === 1}
                    href={buildLink(1)}
                    onClick={(e) => {
                        e.preventDefault();
                        goToPage(1);
                    }}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        if (start > 2) {
            items.push(
                <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        for (let i = start; i <= end; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={page === i}
                        href={buildLink(i)}
                        onClick={(e) => {
                            e.preventDefault();
                            goToPage(i);
                        }}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (end < totalPageCount - 1) {
            items.push(
                <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        items.push(
            <PaginationItem key={totalPageCount}>
                <PaginationLink
                    isActive={page === totalPageCount}
                    href={buildLink(totalPageCount)}
                    onClick={(e) => {
                        e.preventDefault();
                        goToPage(totalPageCount);
                    }}
                >
                    {totalPageCount}
                </PaginationLink>
            </PaginationItem>
        );

        return items;
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
            {pageSizeSelectOptions && (
                <div className="flex flex-col gap-4 flex-1">
                    <SelectRowsPerPage
                        options={pageSizeSelectOptions.pageSizeOptions}
                        setPageSize={navToPageSize}
                        pageSize={pageSize}
                    />
                </div>
            )}

            <ShadcnPagination
                className={cn({ 'md:justify-end': pageSizeSelectOptions })}
            >
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={buildLink(Math.max(page - 1, 1))}
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) goToPage(page - 1);
                            }}
                            aria-disabled={page === 1}
                            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>

                    {renderPageNumbers()}

                    <PaginationItem>
                        <PaginationNext
                            href={buildLink(Math.min(page + 1, totalPageCount))}
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPageCount) goToPage(page + 1);
                            }}
                            aria-disabled={page === totalPageCount}
                            className={page === totalPageCount ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                </PaginationContent>
            </ShadcnPagination>
        </div>
    );
}

function SelectRowsPerPage({
                               options,
                               setPageSize,
                               pageSize,
                           }: {
    options: number[];
    setPageSize: (newSize: number) => void;
    pageSize: number;
}) {
    return (
        <div className="flex items-center gap-4">
            <span className="whitespace-nowrap text-sm">Rows per page</span>

            <Select
                value={String(pageSize)}
                onValueChange={(value) => setPageSize(Number(value))}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select page size">
                        {String(pageSize)}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}