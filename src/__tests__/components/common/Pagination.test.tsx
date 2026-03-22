// ** React
import React from 'react';

// ** Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ** Component
import { Pagination } from '@/components/common/Pagination';

// ===== Fix Radix Select issue in JSDOM =====
beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

// ===== Mock next/navigation =====
const pushMock = jest.fn();
let mockSearchParams = new URLSearchParams('trang=2&pageSize=10');
let mockPathname = '/test';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
    }),
    usePathname: () => mockPathname,
    useSearchParams: () => mockSearchParams,
}));

describe('Pagination component (full coverage)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSearchParams = new URLSearchParams('trang=2&pageSize=10');
        mockPathname = '/test';
    });

    it('renders correct page numbers when totalPageCount <= 7', () => {
        render(<Pagination totalCount={50} pageSize={10} page={1} />);

        ['1', '2', '3', '4', '5'].forEach((n) => {
            expect(screen.getByText(n)).toBeInTheDocument();
        });
    });

    it('shows ellipsis when totalPageCount > 7', () => {
        render(<Pagination totalCount={200} pageSize={10} page={6} />);

        const ellipsis = document.querySelectorAll('[data-slot="pagination-ellipsis"]');
        expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('clicking Next calls router.push with correct URL', () => {
        render(<Pagination totalCount={100} pageSize={10} page={1} />);

        fireEvent.click(screen.getByLabelText(/next/i));

        expect(pushMock).toHaveBeenCalledWith('/test?trang=2&pageSize=10');
    });

    it('clicking Previous calls router.push with correct URL', () => {
        render(<Pagination totalCount={100} pageSize={10} page={2} />);

        fireEvent.click(screen.getByLabelText(/previous/i));

        expect(pushMock).toHaveBeenCalledWith('/test?trang=1&pageSize=10');
    });

    it('clicking a page number navigates to the correct page', () => {
        render(<Pagination totalCount={100} pageSize={10} page={1} />);

        fireEvent.click(screen.getByText('4'));

        expect(pushMock).toHaveBeenCalledWith('/test?trang=4&pageSize=10');
    });

    it('disables Next button when on the last page', () => {
        render(<Pagination totalCount={100} pageSize={10} page={10} />);

        expect(screen.getByLabelText(/next/i)).toHaveClass('pointer-events-none');
    });

    it('disables Previous button when on the first page', () => {
        render(<Pagination totalCount={100} pageSize={10} page={1} />);

        expect(screen.getByLabelText(/previous/i)).toHaveClass('pointer-events-none');
    });

    it('changing pageSize resets the page param', () => {
        render(
            <Pagination
                totalCount={100}
                pageSize={10}
                page={3}
                pageSizeSelectOptions={{
                    pageSizeSearchParam: 'pageSize',
                    pageSizeOptions: [10, 20, 50],
                }}
            />
        );

        fireEvent.click(screen.getByRole('combobox'));
        fireEvent.click(screen.getByRole('option', { name: '20' }));

        expect(pushMock).toHaveBeenCalledWith('/test?pageSize=20');
    });

    it('supports custom pageSearchParam and keeps existing params', () => {
        render(
            <Pagination
                totalCount={100}
                pageSize={10}
                page={2}
                pageSearchParam="p"
            />
        );

        fireEvent.click(screen.getByText('3'));

        expect(pushMock).toHaveBeenCalledWith('/test?trang=2&pageSize=10&p=3');
    });

    // ===== NEW TESTS FOR MISSING COVERAGE =====

    // Test case for line 76: page <= 3 branch
    it('renders correct pages when page is 1 (page <= 3 branch)', () => {
        render(<Pagination totalCount={200} pageSize={10} page={1} />);

        // Should show pages 1, 2, 3, 4, 5, ..., 20
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders correct pages when page is 3 (page <= 3 branch)', () => {
        render(<Pagination totalCount={200} pageSize={10} page={3} />);

        // Should show pages 1, 2, 3, 4, 5, ..., 20
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    // Test case for line 98-99: page >= totalPageCount - 2 branch
    it('renders correct pages when near the end (page >= totalPageCount - 2)', () => {
        render(<Pagination totalCount={200} pageSize={10} page={19} />);

        // Should show pages 1, ..., 16, 17, 18, 19, 20
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('16')).toBeInTheDocument();
        expect(screen.getByText('19')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders correct pages when on last page', () => {
        render(<Pagination totalCount={200} pageSize={10} page={20} />);

        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('16')).toBeInTheDocument();
    });

    // Test case for line 135-136: clicking Previous when page > 1
    it('does not navigate when clicking Previous on first page', () => {
        render(<Pagination totalCount={100} pageSize={10} page={1} />);

        const prevButton = screen.getByLabelText(/previous/i);
        fireEvent.click(prevButton);

        // Should not call pushMock because page === 1
        expect(pushMock).not.toHaveBeenCalled();
    });

    // Test case for line 183-184: clicking Next when page < totalPageCount
    it('does not navigate when clicking Next on last page', () => {
        render(<Pagination totalCount={100} pageSize={10} page={10} />);

        const nextButton = screen.getByLabelText(/next/i);
        fireEvent.click(nextButton);

        // Should not call pushMock because page === totalPageCount
        expect(pushMock).not.toHaveBeenCalled();
    });

    // Additional edge cases for complete coverage
    it('handles empty searchParams correctly', () => {
        mockSearchParams = new URLSearchParams();

        render(<Pagination totalCount={100} pageSize={10} page={1} />);

        fireEvent.click(screen.getByText('2'));

        expect(pushMock).toHaveBeenCalledWith('/test?trang=2');
    });

    it('deletes pageSearchParam when changing pageSize with custom param', () => {
        mockSearchParams = new URLSearchParams('customPage=5&pageSize=10');

        render(
            <Pagination
                totalCount={100}
                pageSize={10}
                page={5}
                pageSearchParam="customPage"
                pageSizeSelectOptions={{
                    pageSizeSearchParam: 'pageSize',
                    pageSizeOptions: [10, 20, 50],
                }}
            />
        );

        fireEvent.click(screen.getByRole('combobox'));
        fireEvent.click(screen.getByRole('option', { name: '50' }));

        // Should delete both 'trang' and 'customPage'
        expect(pushMock).toHaveBeenCalledWith('/test?pageSize=50');
    });

    it('renders SelectRowsPerPage with correct value', () => {
        render(
            <Pagination
                totalCount={100}
                pageSize={20}
                page={1}
                pageSizeSelectOptions={{
                    pageSizeOptions: [10, 20, 50],
                }}
            />
        );

        expect(screen.getByText('Rows per page')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('shows ellipsis at start when page is in middle-end range', () => {
        render(<Pagination totalCount={200} pageSize={10} page={10} />);

        const ellipsis = document.querySelectorAll('[data-slot="pagination-ellipsis"]');
        // Should have ellipsis at the start
        expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('shows ellipsis at end when page is in middle-start range', () => {
        render(<Pagination totalCount={200} pageSize={10} page={5} />);

        const ellipsis = document.querySelectorAll('[data-slot="pagination-ellipsis"]');
        // Should have ellipsis at the end
        expect(ellipsis.length).toBeGreaterThan(0);
    });
});