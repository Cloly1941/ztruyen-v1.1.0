// ** testing-library
import {userEvent} from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";

// ** Components
import Button from "@/components/common/Button";

describe("<Button />", () => {
    it('Should render and click to button: ', async () => {
        const user = userEvent.setup();

        const onClick = jest.fn();

        render(<Button onClick={onClick}>Button Test</Button>)

        const button = screen.getByRole('button', { name: /button test/i });

        await user.click(button);

        expect(button).toBeInTheDocument();

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('Show loading text when isLoading is true', () => {
        render(<Button isLoading>Submit</Button>)

        const button = screen.queryByText("Submit")
        const buttonLoading =  screen.getByRole('button', { name: /đợi xíu nhe~/i });

        expect(buttonLoading).toBeInTheDocument()
        expect(button).not.toBeInTheDocument()
    })

    it('Disabled button when isLoading is true', () => {
        render(<Button isLoading>Submit</Button>)

        const button = screen.getByRole("button", { name: /đợi xíu nhe~/i })
        expect(button).toBeDisabled()
    })

    it('applies shape, width, and sizeCustom classes', () => {
        render(
            <Button shape="pill" width="full" sizeCustom="sm">
                Custom Button
            </Button>
        );

        const button = screen.getByRole("button", { name: /custom button/i });

        expect(button).toHaveClass("rounded-full");
        expect(button).toHaveClass("w-full");
        expect(button).toHaveClass("px-4 py-2 text-xs");
    })
})