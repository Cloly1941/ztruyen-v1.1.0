/* eslint-disable @typescript-eslint/no-explicit-any */

// ** React
import React from "react";

// ** Testing library
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// =============================== Mocks =============================//
const mockPush = jest.fn();
const mockGet = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    useSearchParams: () => ({
        get: mockGet,
        toString: () => "",
    }),
}));

jest.mock("@/configs/page", () => ({
    listSortByDate: [
        { label: "Mới nhất", value: "moi-nhat" },
        { label: "Cũ nhất", value: "cu-nhat" },
    ],
}));

jest.mock("clsx", () => ({
    __esModule: true,
    default: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// ** Component
import SortByDate from "@/components/common/SortByDate";

// ** Enum
import { ESortOrder } from "@/types/enum";

// =============================== Tests =============================//
describe("SortByDate", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGet.mockReturnValue(null);
    });

    //  Render
    it("should render label 'Sắp xếp'", () => {
        render(<SortByDate />);

        expect(screen.getByText("Sắp xếp")).toBeInTheDocument();
    });

    it("should render all sort options", () => {
        render(<SortByDate />);

        expect(screen.getByText("Mới nhất")).toBeInTheDocument();
        expect(screen.getByText("Cũ nhất")).toBeInTheDocument();
    });

    // Active
    it("should apply active style to UPDATED_AT_DESC by default when no searchParam", () => {
        mockGet.mockReturnValue(null);

        render(<SortByDate />);

        const moiNhat = screen.getByText("Mới nhất");
        expect(moiNhat.className).toContain("text-primary");

        const cuNhat = screen.getByText("Cũ nhất");

        const cuNhatClasses = cuNhat.className.split(" ");
        expect(cuNhatClasses).not.toContain("text-primary");
    });

    it("should apply active style to UPDATED_AT_ASC when searchParam is cu-nhat", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_ASC);

        render(<SortByDate />);

        const cuNhat = screen.getByText("Cũ nhất");
        const cuNhatClasses = cuNhat.className.split(" ");
        expect(cuNhatClasses).toContain("text-primary");

        const moiNhat = screen.getByText("Mới nhất");
        const moiNhatClasses = moiNhat.className.split(" ");
        expect(moiNhatClasses).not.toContain("text-primary");
    });

    it("should apply active style to UPDATED_AT_DESC when searchParam is moi-nhat", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_DESC);

        render(<SortByDate />);

        const moiNhat = screen.getByText("Mới nhất");
        expect(moiNhat.className).toMatch(/(?<!\w)text-primary(?!\w)/);
    });

    it("should apply active style to UPDATED_AT_DESC when searchParam is moi-nhat", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_DESC);

        render(<SortByDate />);

        const moiNhat = screen.getByText("Mới nhất");
        expect(moiNhat.className).toContain("text-primary");
    });

    // handleSort
    it("should push url with sort param when clicking inactive sort option", () => {
        mockGet.mockReturnValue(null); // currentSort = moi-nhat (default)

        render(<SortByDate />);

        fireEvent.click(screen.getByText("Cũ nhất"));

        expect(mockPush).toHaveBeenCalledWith("?sap-xep=cu-nhat");
    });

    it("should remove sort param when clicking active sort option", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_ASC); // currentSort = cu-nhat

        render(<SortByDate />);

        fireEvent.click(screen.getByText("Cũ nhất"));

        // delete param => url don't have sap-xep
        expect(mockPush).toHaveBeenCalledWith("?");
    });

    it("should push url without param when clicking active default sort", () => {
        mockGet.mockReturnValue(ESortOrder.UPDATED_AT_DESC); // currentSort = moi-nhat

        render(<SortByDate />);

        fireEvent.click(screen.getByText("Mới nhất"));

        expect(mockPush).toHaveBeenCalledWith("?");
    });

    it("should call router.push when clicking any sort option", () => {
        mockGet.mockReturnValue(null);

        render(<SortByDate />);

        fireEvent.click(screen.getByText("Mới nhất"));

        expect(mockPush).toHaveBeenCalledTimes(1);
    });
});