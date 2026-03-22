import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PaginationLocal } from '@/components/common/PaginationLocal'

// Mock cn utility
jest.mock('@/lib/utils', () => ({
    cn: (...classes: never[]) => classes.filter(Boolean).join(' '),
}))

// Fix Radix Select issue in JSDOM
beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

describe('PaginationLocal component (full coverage)', () => {
    const mockOnPageChange = jest.fn()
    const mockOnPageSizeChange = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    // Helper to get pagination buttons
    const getPaginationButtons = (container: HTMLElement) => {
        const links = container.querySelectorAll('[data-slot="pagination-link"]')
        return {
            previous: links[0] as HTMLElement,
            next: links[links.length - 1] as HTMLElement,
        }
    }

    // ========== BASIC RENDERING ==========
    it('renders null when totalPageCount is 1 and no pageSizeOptions', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={10}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        expect(container.firstChild).toBeNull()
    })

    it('renders pagination when totalPageCount > 1', () => {
        render(
            <PaginationLocal
                totalCount={50}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
    })

    // ========== LINE 56: onClick in simple page rendering (totalPageCount <= 7) ==========
    it('calls onPageChange when clicking page number in simple pagination', () => {
        render(
            <PaginationLocal
                totalCount={50}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        // Click on page 3 (this triggers line 56: onClick={() => onPageChange(i)})
        fireEvent.click(screen.getByText('3'))

        expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })

    it('calls onPageChange for each page in simple pagination', () => {
        render(
            <PaginationLocal
                totalCount={50}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        // Test clicking different pages
        fireEvent.click(screen.getByText('2'))
        expect(mockOnPageChange).toHaveBeenCalledWith(2)

        fireEvent.click(screen.getByText('4'))
        expect(mockOnPageChange).toHaveBeenCalledWith(4)

        fireEvent.click(screen.getByText('5'))
        expect(mockOnPageChange).toHaveBeenCalledWith(5)
    })

    // ========== LINE 88: onClick in middle page range (complex pagination) ==========
    it('calls onPageChange when clicking middle page numbers', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={10}
                onPageChange={mockOnPageChange}
            />
        )

        // Click on page 9 (this triggers line 88: onClick={() => onPageChange(i)})
        fireEvent.click(screen.getByText('9'))

        expect(mockOnPageChange).toHaveBeenCalledWith(9)
    })

    it('calls onPageChange for different middle pages', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={10}
                onPageChange={mockOnPageChange}
            />
        )

        // Page 10 shows: 1, ..., 9, 10, 11, ..., 20
        // Click page 11 (middle range)
        fireEvent.click(screen.getByText('11'))
        expect(mockOnPageChange).toHaveBeenCalledWith(11)
    })

    // ========== LINE 130: onClick on last page number ==========
    it('calls onPageChange when clicking last page number', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        // Click on page 20 (last page, triggers line 130: onClick={() => onPageChange(totalPageCount)})
        fireEvent.click(screen.getByText('20'))

        expect(mockOnPageChange).toHaveBeenCalledWith(20)
    })

    it('calls onPageChange with totalPageCount when clicking last page from middle', () => {
        render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={5}
                onPageChange={mockOnPageChange}
            />
        )

        // Click on page 10 (last page)
        fireEvent.click(screen.getByText('10'))

        expect(mockOnPageChange).toHaveBeenCalledWith(10)
    })

    it('calls onPageChange with totalPageCount from near-end position', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={18}
                onPageChange={mockOnPageChange}
            />
        )

        // Click on page 20 (last page)
        fireEvent.click(screen.getByText('20'))

        expect(mockOnPageChange).toHaveBeenCalledWith(20)
    })

    // ========== ELLIPSIS RENDERING ==========
    it('shows ellipsis when totalPageCount > 7', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={6}
                onPageChange={mockOnPageChange}
            />
        )

        const ellipsis = container.querySelectorAll('[data-slot="pagination-ellipsis"]')
        expect(ellipsis.length).toBeGreaterThan(0)
    })

    // ========== PAGE NAVIGATION ==========
    it('clicking Next calls onPageChange with correct page', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        const { next } = getPaginationButtons(container)
        fireEvent.click(next)

        expect(mockOnPageChange).toHaveBeenCalledWith(2)
    })

    it('clicking Previous calls onPageChange with correct page', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={2}
                onPageChange={mockOnPageChange}
            />
        )

        const { previous } = getPaginationButtons(container)
        fireEvent.click(previous)

        expect(mockOnPageChange).toHaveBeenCalledWith(1)
    })

    it('clicking a page number navigates to the correct page', () => {
        render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        fireEvent.click(screen.getByText('4'))

        expect(mockOnPageChange).toHaveBeenCalledWith(4)
    })

    // ========== DISABLED STATES ==========
    it('disables Next button when on the last page', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={10}
                onPageChange={mockOnPageChange}
            />
        )

        const { next } = getPaginationButtons(container)
        expect(next).toHaveClass('pointer-events-none')
    })

    it('disables Previous button when on the first page', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        const { previous } = getPaginationButtons(container)
        expect(previous).toHaveClass('pointer-events-none')
    })

    it('does not navigate when clicking Previous on first page', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        const { previous } = getPaginationButtons(container)
        fireEvent.click(previous)

        expect(mockOnPageChange).not.toHaveBeenCalled()
    })

    it('does not navigate when clicking Next on last page', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={10}
                onPageChange={mockOnPageChange}
            />
        )

        const { next } = getPaginationButtons(container)
        fireEvent.click(next)

        expect(mockOnPageChange).not.toHaveBeenCalled()
    })

    // ========== PAGE SIZE SELECTION ==========
    it('changing pageSize resets the page param', () => {
        render(
            <PaginationLocal
                totalCount={100}
                pageSize={10}
                page={3}
                onPageChange={mockOnPageChange}
                pageSizeOptions={[10, 20, 50]}
                onPageSizeChange={mockOnPageSizeChange}
            />
        )

        fireEvent.click(screen.getByRole('combobox'))
        fireEvent.click(screen.getByRole('option', { name: '20' }))

        expect(mockOnPageSizeChange).toHaveBeenCalledWith(20)
        expect(mockOnPageChange).toHaveBeenCalledWith(1)
    })

    it('renders page size selector with correct value', () => {
        render(
            <PaginationLocal
                totalCount={100}
                pageSize={20}
                page={1}
                onPageChange={mockOnPageChange}
                pageSizeOptions={[10, 20, 50]}
                onPageSizeChange={mockOnPageSizeChange}
            />
        )

        expect(screen.getByText('Hiển thị')).toBeInTheDocument()
        expect(screen.getByText('/ 100 kết quả')).toBeInTheDocument()
    })

    // ========== PAGE RANGE TESTS ==========
    it('renders correct pages when page is 1 (page <= 3 branch)', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText('20')).toBeInTheDocument()
    })

    it('renders correct pages when page is 3 (page <= 3 branch)', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={3}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('renders correct pages when near the end (page >= totalPageCount - 2)', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={19}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('16')).toBeInTheDocument()
        expect(screen.getByText('19')).toBeInTheDocument()
        expect(screen.getByText('20')).toBeInTheDocument()
    })

    it('renders correct pages when on last page', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={20}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('20')).toBeInTheDocument()
        expect(screen.getByText('16')).toBeInTheDocument()
    })

    it('renders correct pages when page is in middle range (default branch)', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={10}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('9')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
        expect(screen.getByText('11')).toBeInTheDocument()
        expect(screen.getByText('20')).toBeInTheDocument()
    })

    // ========== ADDITIONAL ONCLICK TESTS ==========
    it('calls onPageChange when clicking first page number', () => {
        render(
            <PaginationLocal
                totalCount={200}
                pageSize={10}
                page={10}
                onPageChange={mockOnPageChange}
            />
        )

        // Click on page 1 (always rendered)
        fireEvent.click(screen.getByText('1'))

        expect(mockOnPageChange).toHaveBeenCalledWith(1)
    })

    it('calls onPageChange multiple times for different pages', () => {
        render(
            <PaginationLocal
                totalCount={50}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        // Click multiple pages
        fireEvent.click(screen.getByText('2'))
        expect(mockOnPageChange).toHaveBeenCalledWith(2)

        mockOnPageChange.mockClear()

        fireEvent.click(screen.getByText('3'))
        expect(mockOnPageChange).toHaveBeenCalledWith(3)

        mockOnPageChange.mockClear()

        fireEvent.click(screen.getByText('5'))
        expect(mockOnPageChange).toHaveBeenCalledWith(5)
    })

    // ========== EDGE CASES ==========
    it('handles totalCount of 0', () => {
        const { container } = render(
            <PaginationLocal
                totalCount={0}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        expect(container.firstChild).toBeNull()
    })

    it('handles very large totalCount', () => {
        render(
            <PaginationLocal
                totalCount={10000}
                pageSize={10}
                page={500}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('1000')).toBeInTheDocument()
    })

    it('calculates totalPageCount correctly with ceiling', () => {
        render(
            <PaginationLocal
                totalCount={25}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('marks current page as active', () => {
        render(
            <PaginationLocal
                totalCount={50}
                pageSize={10}
                page={3}
                onPageChange={mockOnPageChange}
            />
        )

        const pageThree = screen.getByText('3').closest('a')
        expect(pageThree).toHaveAttribute('aria-current', 'page')
    })

    it('does not render page size selector when onPageSizeChange is not provided', () => {
        render(
            <PaginationLocal
                totalCount={50}
                pageSize={10}
                page={1}
                onPageChange={mockOnPageChange}
                pageSizeOptions={[10, 20, 50]}
            />
        )

        expect(screen.queryByText('Hiển thị')).not.toBeInTheDocument()
    })
})