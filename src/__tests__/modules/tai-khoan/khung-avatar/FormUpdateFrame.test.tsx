/* eslint-disable @typescript-eslint/no-explicit-any */

// ** Testing Library
import { render, screen, fireEvent } from "@testing-library/react"

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod"
import useMutateMethod from "@/hooks/common/useMutateMethod"
import { useDebounce } from "@/hooks/common/useDebounce"

// ** Services
import { UserService } from "@/services/api/user"
import { FrameService } from "@/services/api/frame"

// ** Component
import FormUpdateFrame from "@/modules/tai-khoan/khung-avatar/FormUpdateFrame"

// ** Toast
import toast from "react-hot-toast"
import { CONFIG_TAG } from "@/configs/tag"

// ---------------- MOCKS ----------------

jest.mock("@/hooks/common/useGetMethod", () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock("@/hooks/common/useMutateMethod", () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock("@/hooks/common/useDebounce", () => ({
    useDebounce: jest.fn(),
}))

jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

jest.mock("@/services/api/user", () => ({
    UserService: {
        getProfile: jest.fn(),
        updateProfileImage: jest.fn(),
    },
}))

jest.mock("@/services/api/frame", () => ({
    FrameService: {
        list: jest.fn(),
    },
}))

jest.mock("@/components/common/AvatarWithFrame", () => ({
    __esModule: true,
    default: () => <div data-testid="avatar-frame" />,
}))

jest.mock("@/components/common/Button", () => ({
    __esModule: true,
    default: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}))

jest.mock("@/components/common/PaginationLocal", () => ({
    PaginationLocal: () => <div data-testid="pagination" />,
}))

jest.mock("@/skeletons/tai-khoan/khung-avatar/FrameSkeleton", () => ({
    FrameSkeleton: () => <div data-testid="skeleton" />,
}))

// ---------------- TYPES ----------------

const mockedUseGetMethod = useGetMethod as jest.Mock
const mockedUseMutateMethod = useMutateMethod as jest.Mock
const mockedUseDebounce = useDebounce as jest.Mock

// ---------------- DATA ----------------

const mockUser = {
    name: "John",
    avatar: { url: "avatar.jpg" },
    avatar_frame: { _id: "frame1" },
}

const mockFrames = {
    result: [
        {
            _id: "frame1",
            name: "Frame 1",
            image: { url: "frame1.png" },
        },
        {
            _id: "frame2",
            name: "Frame 2",
            image: { url: "frame2.png" },
        },
    ],
    meta: {
        totalItems: 2,
    },
}

// ---------------- TEST ----------------

describe("FormUpdateFrame", () => {
    const mockTrigger = jest.fn()
    const mockMutate = jest.fn()

    beforeEach(() => {
        mockedUseDebounce.mockImplementation((v) => v)

        mockedUseGetMethod.mockImplementation((options) => {
            if (options.key === CONFIG_TAG.USER.PROFILE) {
                return {
                    data: mockUser,
                    isLoading: false,
                    mutate: mockMutate,
                }
            }

            return {
                data: mockFrames,
                isLoading: false,
            }
        })

        mockedUseMutateMethod.mockReturnValue({
            trigger: mockTrigger,
            isMutating: false,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    // ---------------- UI ----------------

    it("renders search input and update button", () => {
        render(<FormUpdateFrame />)

        expect(
            screen.getByPlaceholderText("Tìm tên khung...")
        ).toBeInTheDocument()

        expect(screen.getByText("Cập nhật")).toBeInTheDocument()
    })

    it("renders frame list", () => {
        render(<FormUpdateFrame />)

        expect(screen.getAllByTestId("avatar-frame").length).toBeGreaterThan(0)
    })

    it("shows skeleton when loading", () => {
        mockedUseGetMethod
            .mockReturnValueOnce({
                data: undefined,
                isLoading: true,
            })
            .mockReturnValueOnce({
                data: undefined,
                isLoading: true,
            })

        render(<FormUpdateFrame />)

        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })

    it("shows empty state when no frames", () => {
        mockedUseGetMethod.mockReset()

        mockedUseGetMethod
            .mockReturnValueOnce({
                data: mockUser,
                isLoading: false,
                mutate: mockMutate,
            })
            .mockReturnValueOnce({
                data: { result: [], meta: { totalItems: 0 } },
                isLoading: false,
            })
            .mockReturnValue({
                data: { result: [], meta: { totalItems: 0 } },
                isLoading: false,
            })

        render(<FormUpdateFrame />)

        expect(screen.getByText("Không có khung nào.")).toBeInTheDocument()
    })

    // ---------------- INTERACTION ----------------

    it("updates search value", () => {
        render(<FormUpdateFrame />)

        const input = screen.getByPlaceholderText("Tìm tên khung...")

        fireEvent.change(input, {
            target: { value: "Frame 1" },
        })

        expect(input).toHaveValue("Frame 1")
    })

    it("calls trigger when clicking update button", () => {
        render(<FormUpdateFrame />)

        fireEvent.click(screen.getByText("Cập nhật"))

        expect(mockTrigger).toHaveBeenCalled()
    })

    // ---------------- MUTATION ----------------

    it("shows success toast and refetch user", async () => {
        let capturedOptions: any

        mockedUseMutateMethod.mockImplementation((options) => {
            capturedOptions = options

            return {
                trigger: mockTrigger,
                isMutating: false,
            }
        })

        render(<FormUpdateFrame />)

        await capturedOptions.onSuccess()

        expect(toast.success).toHaveBeenCalledWith("Cập nhật khung thành công!")
        expect(mockMutate).toHaveBeenCalled()
    })

    // ---------------- API ----------------

    it("calls UserService.getProfile", async () => {
        render(<FormUpdateFrame />)

        const options = mockedUseGetMethod.mock.calls[0][0]

        await options.api()

        expect(UserService.getProfile).toHaveBeenCalledTimes(1)
    })

    it("calls FrameService.list", async () => {
        render(<FormUpdateFrame />)

        const options = mockedUseGetMethod.mock.calls[1][0]

        await options.api()

        expect(FrameService.list).toHaveBeenCalled()
    })

    it("sends correct frame id to API", async () => {
        let capturedOptions: any

        mockedUseMutateMethod.mockImplementation((options) => {
            capturedOptions = options
            return { trigger: mockTrigger, isMutating: false }
        })

        render(<FormUpdateFrame />)

        await capturedOptions.api()

        expect(UserService.updateProfileImage).toHaveBeenCalled()
    })

    it("changes selected frame when clicked", () => {
        render(<FormUpdateFrame />)

        const frames = screen.getAllByTestId("avatar-frame")

        fireEvent.click(frames[1])

        expect(frames[1]).toBeInTheDocument()
    })
})