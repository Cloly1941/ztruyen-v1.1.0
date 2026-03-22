/* eslint-disable @typescript-eslint/no-explicit-any */

// ** React
import React from "react"

// ** Testing library
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"

// =============================== Mocks =============================//
const mockPush = jest.fn()
const mockGet = jest.fn()

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    useSearchParams: () => ({
        get: mockGet,
        toString: () => "",
    }),
}))

jest.mock("@/configs/page", () => ({
    listSortByDate: [
        { label: "Mới nhất", value: "moi-nhat" },
        { label: "Cũ nhất", value: "cu-nhat" },
    ],
}))

jest.mock("@/lib/utils", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}))

// ** Component
import SortByDate from "@/components/common/SortByDate"

// ** Enum
import { ESortOrder } from "@/types/enum"

// =============================== Tests =============================//
describe("SortByDate", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockGet.mockReturnValue(null)
    })

    // Render
    it("renders label 'Sắp xếp'", () => {
        render(<SortByDate />)
        expect(screen.getByText("Sắp xếp")).toBeInTheDocument()
    })

    it("renders all sort options", () => {
        render(<SortByDate />)

        expect(screen.getByText("Mới nhất")).toBeInTheDocument()
        expect(screen.getByText("Cũ nhất")).toBeInTheDocument()
    })

    // Active state
    it("highlights default sort (UPDATED_AT_DESC) when no searchParam", () => {
        mockGet.mockReturnValue(null)

        render(<SortByDate />)

        expect(screen.getByText("Mới nhất")).toHaveClass("text-primary")
        expect(screen.getByText("Cũ nhất")).not.toHaveClass("text-primary")
    })

    it("highlights UPDATED_AT_ASC when searchParam is cu-nhat", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_ASC)

        render(<SortByDate />)

        expect(screen.getByText("Cũ nhất")).toHaveClass("text-primary")
        expect(screen.getByText("Mới nhất")).not.toHaveClass("text-primary")
    })

    it("highlights UPDATED_AT_DESC when searchParam is moi-nhat", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_DESC)

        render(<SortByDate />)

        expect(screen.getByText("Mới nhất")).toHaveClass("text-primary")
    })

    // handleSort
    it("pushes url with sort param when clicking inactive option", () => {
        mockGet.mockReturnValue(null) // default = moi-nhat

        render(<SortByDate />)

        fireEvent.click(screen.getByText("Cũ nhất"))

        expect(mockPush).toHaveBeenCalledWith("?sap-xep=cu-nhat")
    })

    it("removes sort param when clicking active option", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_ASC)

        render(<SortByDate />)

        fireEvent.click(screen.getByText("Cũ nhất"))

        expect(mockPush).toHaveBeenCalledWith("?")
    })

    it("removes sort param when clicking active default option", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_DESC)

        render(<SortByDate />)

        fireEvent.click(screen.getByText("Mới nhất"))

        expect(mockPush).toHaveBeenCalledWith("?")
    })

    it("calls router.push when clicking any sort option", () => {
        mockGet.mockReturnValue(null)

        render(<SortByDate />)

        fireEvent.click(screen.getByText("Mới nhất"))

        expect(mockPush).toHaveBeenCalledTimes(1)
    })
})