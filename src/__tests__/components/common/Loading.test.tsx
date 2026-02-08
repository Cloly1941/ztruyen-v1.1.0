// ** Testing Library
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// ** Component
import Loading from '@/components/common/Loading'

describe('Loading component', () => {
    afterEach(() => {
        cleanup()
        document.body.className = ''
    })

    it('renders loading with default text and shortcut', () => {
        render(<Loading />)

        const status = screen.getByRole('status')
        expect(status).toBeInTheDocument()

        expect(screen.getByText(/Chờ tý nhe/i)).toBeInTheDocument()

        const shortcuts = screen.getAllByText('~')
        expect(shortcuts).toHaveLength(3)
    })

    it('renders loading with custom text and shortcut', () => {
        render(<Loading text="Loading data" shortcut="." />)

        expect(screen.getByText('Loading data')).toBeInTheDocument()

        const shortcuts = screen.getAllByText('.')
        expect(shortcuts).toHaveLength(3)
    })

    it('adds loading class to body on mount', () => {
        render(<Loading />)

        expect(document.body.classList.contains('loading')).toBe(true)
    })

    it('removes loading class from body on unmount', () => {
        const { unmount } = render(<Loading />)

        expect(document.body.classList.contains('loading')).toBe(true)

        unmount()

        expect(document.body.classList.contains('loading')).toBe(false)
    })
})
