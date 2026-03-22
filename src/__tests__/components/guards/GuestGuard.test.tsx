// ** Testing library
import { render, screen } from '@testing-library/react'

// ** Next
import { useRouter } from 'next/navigation'

// ** lib
import { getAccessToken } from '@/lib/localStorage'

// ** Components
import GuestGuard from "@/components/guards/GuestGuard";

// ================= MOCKS =================

jest.mock('@/lib/localStorage')
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

// ================= TESTS =================

describe('GuestGuard', () => {
    const replaceMock = jest.fn()

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            replace: replaceMock,
        })
    })

    it('Render children when no accessToken', () => {
        (getAccessToken as jest.Mock).mockReturnValue(null);

        render(
            <GuestGuard>
                <div>Login Page</div>
            </GuestGuard>
        )

        expect(screen.getByText('Login Page')).toBeInTheDocument()
        expect(replaceMock).not.toHaveBeenCalled()
    })

    it('Redirect to "/" when accessToken exists', () => {
        (getAccessToken as jest.Mock).mockReturnValue('token-123');

        render(
            <GuestGuard>
                <div>Login Page</div>
            </GuestGuard>
        )

        expect(replaceMock).toHaveBeenCalledWith('/')
    })
})
