// ** Testing library
import { renderHook, waitFor } from '@testing-library/react'

// ** Hook
import useMounted from '@/hooks/common/useMounted'

describe('useMounted', () => {
    it('should become true after mounted', async () => {
        const { result } = renderHook(() => useMounted())

        await waitFor(() => {
            expect(result.current).toBe(true)
        })
    })
})
