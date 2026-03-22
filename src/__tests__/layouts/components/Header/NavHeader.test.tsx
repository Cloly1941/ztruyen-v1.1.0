// ** Next
import { usePathname } from 'next/navigation';

// ** testing-library
import {render, screen} from "@testing-library/react";

// ** Components
import NavHeader from "@/layouts/components/Header/NavHeader";

// ** Configs
import {navHeader} from "@/configs/header";

// ================ MOCKS =================
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

// ================ TESTS =================
describe("<NavHeader/>", () => {
    it("Render all navigation items", () => {
        (usePathname as jest.Mock).mockReturnValue('/');

        render(<NavHeader />)
        navHeader.forEach((nav) => {
            expect(screen.getByText(nav.title)).toBeInTheDocument();
        });
    })

    it("Active 'Thể loại' when path starts with /the-loai", () => {
        (usePathname as jest.Mock).mockReturnValue('/the-loai/tat-ca');

        render(<NavHeader />);

        expect(screen.getByText(/thể loại/i)).toHaveClass('text-primary');
    })

    it("Fanpage link opens in new tab", () => {
        (usePathname as jest.Mock).mockReturnValue('/');

        render(<NavHeader />);

        const fanpage = screen.getByText(/fanpage/i);
        expect(fanpage).toHaveAttribute('target', '_blank');
    })
})