// ** testing-library
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

// ** Component
import FormLogin from "@/modules/dang-nhap/FormLogin";

// ** Services
import { AuthService } from "@/services/auth"

// ** Next router
import { useRouter } from "next/navigation"

// ** Toast
import toast from "react-hot-toast"

// ================= MOCKS =================

jest.mock("@/services/auth", () => ({
    AuthService: {
        login: jest.fn(),
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

// ================= TESTS =================

describe("<FormLogin />", () => {
    const push = jest.fn()

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push })
    })

    it("Render form login fields", () => {
        render(<FormLogin />)

        expect(
            screen.getByPlaceholderText(/email bạn dùng để đăng nhập/i)
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText(/mật khẩu/i)
        ).toBeInTheDocument()

        expect(
            screen.getByRole("button", { name: /đăng nhập/i })
        ).toBeInTheDocument()
    })

    it("Show error toast if submit without Cloudflare verification", async () => {
        const user = userEvent.setup()
        render(<FormLogin />)

        await user.type(
            screen.getByPlaceholderText(/email bạn dùng/i),
            "test@gmail.com"
        )

        await user.type(
            screen.getByPlaceholderText(/mật khẩu/i),
            "123456"
        )

        await user.click(
            screen.getByRole("button", { name: /đăng nhập/i })
        )

        expect(toast.error).toHaveBeenCalledWith(
            "Vui lòng xác thực bạn không phải bot"
        )
    })

    it("Submit successfully and redirect", async () => {
        const user = userEvent.setup();

        (AuthService.login as jest.Mock).mockResolvedValue({
            message: "Login success",
        })

        render(<FormLogin />)

        // verify cloudflare
        await user.click(screen.getByText("Verify CF"))

        await user.type(
            screen.getByPlaceholderText(/email bạn dùng/i),
            "test@gmail.com"
        )

        await user.type(
            screen.getByPlaceholderText(/mật khẩu/i),
            "123456"
        )

        await user.click(
            screen.getByRole("button", { name: /đăng nhập/i })
        )

        expect(AuthService.login).toHaveBeenCalledWith(
            {
                email: "test@gmail.com",
                password: "123456",
            },
            "cf-token"
        )

        expect(toast.success).toHaveBeenCalledWith("Login success")
        expect(push).toHaveBeenCalledWith("/")
    })

    it("Show error toast when login failed", async () => {
        const user = userEvent.setup();

        (AuthService.login as jest.Mock).mockRejectedValue(
            new Error("Sai mật khẩu")
        )

        render(<FormLogin />)

        await user.click(screen.getByText("Verify CF"))

        await user.type(
            screen.getByPlaceholderText(/email bạn dùng/i),
            "test@gmail.com"
        )

        await user.type(
            screen.getByPlaceholderText(/mật khẩu/i),
            "123456"
        )

        await user.click(
            screen.getByRole("button", { name: /đăng nhập/i })
        )

        expect(toast.error).toHaveBeenCalledWith("Sai mật khẩu")
    })

    it("Show fallback error toast when error is not instance of Error", async () => {
        const user = userEvent.setup();

        (AuthService.login as jest.Mock).mockRejectedValue("UNKNOWN_ERROR")

        render(<FormLogin />)

        await user.click(screen.getByText("Verify CF"))

        await user.type(
            screen.getByPlaceholderText(/email bạn dùng/i),
            "test@gmail.com"
        )

        await user.type(
            screen.getByPlaceholderText(/mật khẩu/i),
            "123456"
        )

        await user.click(
            screen.getByRole("button", { name: /đăng nhập/i })
        )

        expect(toast.error).toHaveBeenCalledWith(
            "Đã có lỗi xảy ra khi đăng nhập, vui lòng thử lại sau!"
        )
    })
})
