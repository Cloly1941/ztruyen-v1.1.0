/* eslint-disable @typescript-eslint/no-explicit-any */
// ** testing-library
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// ** Component
import FormRegister from "@/modules/dang-ky/FormRegister"

// ** Services
import { AuthService } from "@/services/auth"

// ** Next router
import { useRouter } from "next/navigation"

// ** Toast
import toast from "react-hot-toast"

// ================= MOCKS =================

jest.mock("@/services/auth", () => ({
    AuthService: {
        register: jest.fn(),
    },
}))

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}))

jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock("@/components/auth/TurnstileWidget", () => ({
    __esModule: true,
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button onClick={() => onVerify("cf-token")}>Verify CF</button>
    ),
}))

jest.mock("@/components/ui/select", () => ({
    Select: ({ value, onValueChange, children }: any) => (
        <select
            data-testid="gender-select"
            value={value ?? ""}
            onChange={(e) => onValueChange(e.target.value)}
        >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="lgbt">LGBT</option>
            {children}
        </select>
    ),
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <>{placeholder}</>,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children }: any) => <>{children}</>,
}))

jest.mock("@/components/ui/popover", () => ({
    Popover: ({ children }: any) => <div>{children}</div>,
    PopoverTrigger: ({ children }: any) => <div>{children}</div>,
    PopoverContent: ({ children }: any) => <div>{children}</div>,
}))

jest.mock("@/components/ui/calendar", () => ({
    Calendar: ({ onSelect }: any) => (
        <button
            type="button"
            onClick={() => onSelect(new Date("2000-01-01"))}
        >
            Pick birthday
        </button>
    ),
}))


// ================= TESTS =================

describe("<FormRegister />", () => {
    const push = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        ;(useRouter as jest.Mock).mockReturnValue({ push })
    })

    const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(
            screen.getByPlaceholderText("Tên hiển thị của bạn"),
            "Nguyen Van A"
        )

        await user.type(
            screen.getByPlaceholderText("Email bạn dùng để đăng ký"),
            "test@gmail.com"
        )

        await user.type(screen.getByLabelText("Mật khẩu"), "123456")
        await user.type(screen.getByLabelText("Nhập lại mật khẩu"), "123456")

        // gender (mocked select)
        await user.selectOptions(
            screen.getByTestId("gender-select"),
            "male"
        )

        // birthday (mocked calendar)
        await user.click(screen.getByText("Pick birthday"))
    }

    it("Render register form fields", () => {
        render(<FormRegister />)

        expect(
            screen.getByPlaceholderText("Tên hiển thị của bạn")
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText("Email bạn dùng để đăng ký")
        ).toBeInTheDocument()

        expect(
            screen.getByLabelText("Mật khẩu")
        ).toBeInTheDocument()

        expect(
            screen.getByLabelText("Nhập lại mật khẩu")
        ).toBeInTheDocument()

        expect(
            screen.getByRole("button", { name: /đăng ký/i })
        ).toBeInTheDocument()
    })

    it("Show error toast if submit without Cloudflare verification", async () => {
        const user = userEvent.setup()
        render(<FormRegister />)

        await fillValidForm(user)

        await user.click(
            screen.getByRole("button", { name: /đăng ký/i })
        )

        expect(toast.error).toHaveBeenCalledWith(
            "Vui lòng xác thực bạn không phải bot"
        )

        expect(AuthService.register).not.toHaveBeenCalled()
    })

    it("Submit successfully and redirect to login page", async () => {
        const user = userEvent.setup()

        ;(AuthService.register as jest.Mock).mockResolvedValue({
            message: "Register success",
        })

        render(<FormRegister />)

        await user.click(screen.getByText("Verify CF"))

        await fillValidForm(user)

        await user.click(
            screen.getByRole("button", { name: /đăng ký/i })
        )

        await waitFor(() => {
            expect(AuthService.register).toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Register success")
        })

        expect(push).toHaveBeenCalledWith("/dang-nhap")
    })

    it("Show error toast when register failed (Error instance)", async () => {
        const user = userEvent.setup()

        ;(AuthService.register as jest.Mock).mockRejectedValue(
            new Error("Email đã tồn tại")
        )

        render(<FormRegister />)

        await user.click(screen.getByText("Verify CF"))

        await fillValidForm(user)

        await user.click(
            screen.getByRole("button", { name: /đăng ký/i })
        )

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Email đã tồn tại")
        })
    })

    it("Show fallback error toast when error is not instance of Error", async () => {
        const user = userEvent.setup()

        ;(AuthService.register as jest.Mock).mockRejectedValue("UNKNOWN_ERROR")

        render(<FormRegister />)

        await user.click(screen.getByText("Verify CF"))

        await fillValidForm(user)

        await user.click(
            screen.getByRole("button", { name: /đăng ký/i })
        )

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Đã có lỗi xảy ra khi đăng ký, vui lòng thử lại sau!"
            )
        })
    })
})
