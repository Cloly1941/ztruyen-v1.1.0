// ** testing-library
import {render, screen} from "@testing-library/react"
import {userEvent} from "@testing-library/user-event"

// ** react-hook-form
import {Controller, useForm} from "react-hook-form"

// ** Component
import InputPassword from "@/components/common/InputPassword"

type TFormValues = {
    password: string
}

function RenderInputPassword({invalid = false}: { invalid?: boolean }) {
    const {control} = useForm<TFormValues>({
        defaultValues: {
            password: "",
        },
    })

    return (
        <Controller
            name="password"
            control={control}
            render={({field, fieldState}) => (
                <InputPassword
                    field={field}
                    fieldState={{...fieldState, invalid}}
                    placeholder="Nhập mật khẩu"
                />
            )}
        />
    )
}

describe('<InputPassword />', () => {
    it('Render input password with type password initially', () => {
        render(<RenderInputPassword/>)

        const input = screen.getByPlaceholderText(/nhập mật khẩu/i)

        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute("type", "password")
    })

    it('Toggle password visibility when clicking the icon', async () => {
        const user = userEvent.setup()

        render(<RenderInputPassword/>)

        const input = screen.getByPlaceholderText(/nhập mật khẩu/i)
        const toggleButton = input.nextElementSibling as HTMLElement

        await user.click(toggleButton)
        expect(input).toHaveAttribute("type", "text")

        await user.click(toggleButton)
        expect(input).toHaveAttribute("type", "password")
    })

    it('Set aria-invalid khi fieldState.invalid = true', () => {
        render(<RenderInputPassword invalid/>)

        const input = screen.getByPlaceholderText(/nhập mật khẩu/i)

        expect(input).toHaveAttribute("aria-invalid", "true")
    })

    it('Use default placeholder if not provided', () => {
        function Wrapper() {
            const { control } = useForm<TFormValues>({
                defaultValues: {
                    password: "",
                },
            })

            return (
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputPassword
                            field={field}
                            fieldState={fieldState}
                        />
                    )}
                />
            )
        }

        render(<Wrapper />)

        const input = screen.getByPlaceholderText(/mật khẩu của bạn/i)
        expect(input).toBeInTheDocument()
    })
})