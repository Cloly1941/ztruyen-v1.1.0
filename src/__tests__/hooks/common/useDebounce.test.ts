// ** Testing Library
import { renderHook, act, waitFor } from '@testing-library/react'

// ** Hook
import { useDebounce } from '@/hooks/common/useDebounce'

describe('useDebounce', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('test', 500))

        expect(result.current).toBe('test')
    })

    it('should debounce string value with default delay', async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: 'initial' } }
        )

        expect(result.current).toBe('initial')

        // Change value
        rerender({ value: 'updated' })

        // Value should not change immediately
        expect(result.current).toBe('initial')

        // Fast-forward time by 500ms
        act(() => {
            jest.advanceTimersByTime(500)
        })

        // Value should update after delay
        expect(result.current).toBe('updated')
    })

    it('should debounce number value', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: 0 } }
        )

        expect(result.current).toBe(0)

        rerender({ value: 10 })
        expect(result.current).toBe(0)

        act(() => {
            jest.advanceTimersByTime(300)
        })

        expect(result.current).toBe(10)
    })

    it('should debounce boolean value', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 200),
            { initialProps: { value: false } }
        )

        expect(result.current).toBe(false)

        rerender({ value: true })
        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(200)
        })

        expect(result.current).toBe(true)
    })

    it('should debounce object value', () => {
        const initialObj = { name: 'John', age: 25 }
        const updatedObj = { name: 'Jane', age: 30 }

        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: initialObj } }
        )

        expect(result.current).toEqual(initialObj)

        rerender({ value: updatedObj })
        expect(result.current).toEqual(initialObj)

        act(() => {
            jest.advanceTimersByTime(500)
        })

        expect(result.current).toEqual(updatedObj)
    })

    it('should debounce array value', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            { initialProps: { value: [1, 2, 3] } }
        )

        expect(result.current).toEqual([1, 2, 3])

        rerender({ value: [4, 5, 6] })
        expect(result.current).toEqual([1, 2, 3])

        act(() => {
            jest.advanceTimersByTime(400)
        })

        expect(result.current).toEqual([4, 5, 6])
    })

    it('should use default delay of 500ms when not specified', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value),
            { initialProps: { value: 'initial' } }
        )

        rerender({ value: 'updated' })
        expect(result.current).toBe('initial')

        act(() => {
            jest.advanceTimersByTime(499)
        })
        expect(result.current).toBe('initial')

        act(() => {
            jest.advanceTimersByTime(1)
        })
        expect(result.current).toBe('updated')
    })

    it('should cancel previous timer when value changes quickly', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: 'initial' } }
        )

        // First change
        rerender({ value: 'first' })
        act(() => {
            jest.advanceTimersByTime(200)
        })

        // Second change before first timer completes
        rerender({ value: 'second' })
        act(() => {
            jest.advanceTimersByTime(200)
        })

        // Third change before second timer completes
        rerender({ value: 'third' })

        // Value should still be initial
        expect(result.current).toBe('initial')

        // Complete the last timer
        act(() => {
            jest.advanceTimersByTime(500)
        })

        // Only the last value should be set
        expect(result.current).toBe('third')
    })

    it('should handle rapid value changes correctly', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: 0 } }
        )

        // Rapid changes
        rerender({ value: 1 })
        act(() => {
            jest.advanceTimersByTime(100)
        })

        rerender({ value: 2 })
        act(() => {
            jest.advanceTimersByTime(100)
        })

        rerender({ value: 3 })
        act(() => {
            jest.advanceTimersByTime(100)
        })

        rerender({ value: 4 })
        act(() => {
            jest.advanceTimersByTime(100)
        })

        rerender({ value: 5 })

        // Value should still be initial
        expect(result.current).toBe(0)

        // Complete the last timer
        act(() => {
            jest.advanceTimersByTime(300)
        })

        // Should update to the last value
        expect(result.current).toBe(5)
    })

    it('should handle delay changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        )

        rerender({ value: 'updated', delay: 500 })
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('updated')

        // Change delay
        rerender({ value: 'new', delay: 1000 })
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('updated') // Should not update yet

        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('new')
    })

    it('should cleanup timer on unmount', () => {
        const { result, rerender, unmount } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: 'initial' } }
        )

        rerender({ value: 'updated' })

        // Unmount before timer completes
        unmount()

        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(500)
        })

        // Value should not update after unmount
        expect(result.current).toBe('initial')
    })

    it('should handle null value', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: null } }
        )

        expect(result.current).toBeNull()

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rerender({ value: 'not null' })
        act(() => {
            jest.advanceTimersByTime(300)
        })
        expect(result.current).toBe('not null')
    })

    it('should handle undefined value', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: undefined } }
        )

        expect(result.current).toBeUndefined()

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rerender({ value: 'defined' })
        act(() => {
            jest.advanceTimersByTime(300)
        })
        expect(result.current).toBe('defined')
    })

    it('should handle empty string', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: 'text' } }
        )

        rerender({ value: '' })
        act(() => {
            jest.advanceTimersByTime(300)
        })
        expect(result.current).toBe('')
    })

    it('should handle zero as delay', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 0),
            { initialProps: { value: 'initial' } }
        )

        rerender({ value: 'updated' })

        act(() => {
            jest.advanceTimersByTime(0)
        })
        expect(result.current).toBe('updated')
    })

    it('should handle very long delay', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 10000),
            { initialProps: { value: 'initial' } }
        )

        rerender({ value: 'updated' })
        expect(result.current).toBe('initial')

        act(() => {
            jest.advanceTimersByTime(9999)
        })
        expect(result.current).toBe('initial')

        act(() => {
            jest.advanceTimersByTime(1)
        })
        expect(result.current).toBe('updated')
    })

    it('should not update if value stays the same', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: 'same' } }
        )

        expect(result.current).toBe('same')

        rerender({ value: 'same' })
        act(() => {
            jest.advanceTimersByTime(500)
        })

        expect(result.current).toBe('same')
    })

    it('should work with complex nested objects', () => {
        const initial = {
            user: { name: 'John', settings: { theme: 'dark' } },
            items: [1, 2, 3]
        }
        const updated = {
            user: { name: 'Jane', settings: { theme: 'light' } },
            items: [4, 5, 6]
        }

        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: initial } }
        )

        expect(result.current).toEqual(initial)

        rerender({ value: updated })
        expect(result.current).toEqual(initial)

        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toEqual(updated)
    })
})