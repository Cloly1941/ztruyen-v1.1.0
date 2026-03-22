// ** React
import {PropsWithChildren} from "react";

// ** Next
import { usePathname } from 'next/navigation';

// ** Testing library
import { render, screen } from '@testing-library/react';

// ** Layout Components
import NavHeaderMobile from '@/layouts/components/Header/NavHeaderMobile';

// ** Configs
import { navHeader } from '@/configs/header';

// ================ MOCKS =================
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

jest.mock('@/components/ui/sheet', () => ({
    SheetClose: ({ children }: PropsWithChildren) => <>{children}</>,
    SheetTitle: ({ children }: PropsWithChildren) => <>{children}</>,
}));

// ================ TESTS =================
describe('<NavHeaderMobile />', () => {
    it('Renders all navigation items', () => {
        (usePathname as jest.Mock).mockReturnValue('/');

        render(<NavHeaderMobile />);

        navHeader.forEach((item) => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
        });
    });

    it("Active 'Thể loại' when path starts with /the-loai", () => {
        (usePathname as jest.Mock).mockReturnValue('/the-loai/tat-ca');

        render(<NavHeaderMobile />);

        expect(
            screen.getByText(/^thể loại$/i).closest('a')
        ).toHaveClass('text-primary');
    });

    it('Fanpage link opens in new tab', () => {
        (usePathname as jest.Mock).mockReturnValue('/');

        render(<NavHeaderMobile />);

        const fanpage = screen.getByText(/^fanpage$/i).closest('a');
        expect(fanpage).toHaveAttribute('target', '_blank');
    });
});
