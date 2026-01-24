// ** Next
import { useRouter } from 'next/navigation';

// ** Testing library
import {fireEvent, render, screen} from "@testing-library/react";

// ** Layout components
import Search from "@/layouts/components/Header/Search";

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

describe('<Search />', () => {
    const pushMock = jest.fn();
    const placeholderInput = 'Tìm truyện...'
    const nameBtnMobile = 'search'

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        });
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("Render Search input ", () => {
        render(<Search/>)

        expect(screen.getByPlaceholderText(placeholderInput)).toBeInTheDocument();
    })

    it("Submits search and navigates correctly ", () => {
        render(<Search/>)

        const input = screen.getByPlaceholderText(placeholderInput)

        fireEvent.change(input, {
            target: {
                value: 'doraemon'
            }
        })

        fireEvent.submit(input.closest('form')!)

        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith('/tim-kiem?tu-khoa=doraemon');
    })

    it("Does not navigate when search input is empty", () => {
        render(<Search/>)

        const form = screen.getByPlaceholderText(placeholderInput).closest('form')

        fireEvent.submit(form!)

        expect(pushMock).not.toHaveBeenCalled();
    })

    it("Opens search on mobile icon click", () => {
        render(<Search/>)

        const mobileSearchBtn = screen.getByRole('button', {name: nameBtnMobile});

        expect(mobileSearchBtn).toBeDefined();

        fireEvent.click(mobileSearchBtn!)

        expect(screen.getByPlaceholderText(placeholderInput)).toBeInTheDocument();
    })

    it("Close search when clicking outside mobile", () => {
        render(<Search/>)

        // Click icon search
        const searchIconBtn = screen.getByRole('button', {name: nameBtnMobile});
        fireEvent.click(searchIconBtn!);

        // Search open
        const input = screen.getByPlaceholderText(placeholderInput);
        expect(input).toBeInTheDocument();

        // click outside
        fireEvent.click(document.body)

        expect(input.closest('div')).toHaveClass('hidden');
    })

    it('Does not close search when clicking inside search box', () => {
        render(<Search />);

        // open search mobile
        const btn = screen.getByRole('button', { name: nameBtnMobile });
        fireEvent.click(btn);

        const input = screen.getByPlaceholderText(placeholderInput);
        expect(input).toBeInTheDocument();

        fireEvent.click(input);

        expect(input.closest('div')).not.toHaveClass('hidden');
    });
})