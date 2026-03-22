// ** React
import React from 'react';

// ** Testing Library
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';

// =====================
// Mock next/link
// =====================
jest.mock('next/link', () => {
    const Link = React.forwardRef<
        HTMLAnchorElement,
        React.PropsWithChildren<{ href: string; className?: string }>
    >(({ href, className, children }, ref) => (
        <a ref={ref} href={href} className={className}>
            {children}
        </a>
    ));

    Link.displayName = 'NextLinkMock';

    return {
        __esModule: true,
        default: Link,
    };
});

// =====================
// Mock breakpoints hook
// =====================
jest.mock('@/hooks/common/useTailwindBreakpoints', () => ({
    __esModule: true,
    default: jest.fn(),
}));

import useTailwindBreakpoints from '@/hooks/common/useTailwindBreakpoints';
import NavListGenre from '@/modules/the-loai/NavListGenre';

const mockUseTailwindBreakpoints = useTailwindBreakpoints as jest.Mock;

// =====================
// Mock data
// =====================
const mockGenres = [
    { _id: '011', name: 'Action', slug: 'action' },
    { _id: '012', name: 'Romance', slug: 'romance' },
];

describe('<NavListGenre />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the genre list and the "All" item', () => {
        mockUseTailwindBreakpoints.mockReturnValue({ isSm: true });

        render(<NavListGenre listGenre={mockGenres} slug="action" />);

        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('Romance')).toBeInTheDocument();
        expect(screen.getByText('Tất cả')).toBeInTheDocument();
    });

    it('highlights the active genre correctly', () => {
        mockUseTailwindBreakpoints.mockReturnValue({ isSm: true });

        render(<NavListGenre listGenre={mockGenres} slug="romance" />);

        const activeLink = screen.getByText('Romance');
        expect(activeLink).toHaveClass('text-primary');

        const inactiveLink = screen.getByText('Action');
        expect(inactiveLink).not.toHaveClass('text-primary');
    });

    it('highlights "All" when slug is "tat-ca"', () => {
        mockUseTailwindBreakpoints.mockReturnValue({ isSm: true });

        render(<NavListGenre listGenre={mockGenres} slug="tat-ca" />);

        const allLink = screen.getByText('Tất cả');
        expect(allLink).toHaveClass('text-primary');
    });

    it('scrolls to the active item when not on small screens', async () => {
        mockUseTailwindBreakpoints.mockReturnValue({ isSm: false });

        const mockScrollTopSetter = jest.fn();

        Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
            configurable: true,
            set: mockScrollTopSetter,
            get: () => 0,
        });

        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            top: 100,
        } as DOMRect);

        render(<NavListGenre listGenre={mockGenres} slug="action" />);

        await waitFor(() => {
            expect(mockScrollTopSetter).toHaveBeenCalled();
        });
    });

    it('does not scroll when closest("ul") returns null', async () => {
        mockUseTailwindBreakpoints.mockReturnValue({ isSm: false });

        jest.spyOn(HTMLElement.prototype, 'closest').mockReturnValue(null);

        const mockScrollTopSetter = jest.fn();
        Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
            configurable: true,
            set: mockScrollTopSetter,
            get: () => 0,
        });

        render(<NavListGenre listGenre={mockGenres} slug="action" />);

        await new Promise((r) => setTimeout(r, 0));

        expect(mockScrollTopSetter).not.toHaveBeenCalled();
    });

    it('does not apply active class for inactive genre item', () => {
        mockUseTailwindBreakpoints.mockReturnValue({ isSm: true });

        render(<NavListGenre listGenre={mockGenres} slug="action" />);

        const inactiveLink = screen.getByText('Romance');

        expect(inactiveLink.classList.contains('text-primary')).toBe(false);
    });
});