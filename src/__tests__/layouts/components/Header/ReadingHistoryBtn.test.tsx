// ** Next
import { usePathname } from 'next/navigation';

// ** testing-library
import {render, screen} from "@testing-library/react";

// ** Components
import ReadingHistoryBtn from "@/layouts/components/Header/ReadingHistoryBtn";

// ================ MOCKS =================
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

// ================ TESTS =================
describe('<ReadingHistoryBtn />', () => {
    const linkName = 'Lịch sử đọc truyện'
    const pathHistory = '/lich-su.html'

    it("Render link to reading history page", () => {
        (usePathname as jest.Mock).mockReturnValue('/');

        render(<ReadingHistoryBtn />);

        const link = screen.getByRole('link', {
            name: linkName,
        });

        expect(link).toHaveAttribute('href', pathHistory);
    })

    it("Highlights icon when current path is reading history page", () => {
        (usePathname as jest.Mock).mockReturnValue(pathHistory);

        render(<ReadingHistoryBtn />);

        const icon = screen.getByRole('link', {
            name: linkName
        }).querySelector('svg')

        expect(icon).toHaveClass('text-primary');
    })

    it('Does not highlight icon when current path is not reading history page', () => {
        (usePathname as jest.Mock).mockReturnValue('/');

        render(<ReadingHistoryBtn />);

        const icon = screen
            .getByRole('link', { name: linkName })
            .querySelector('svg');

        expect(icon).not.toHaveClass('text-primary');
    });
})