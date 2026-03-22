// ** Testing Library
import { renderHook, act } from '@testing-library/react';

// ** Hook
import useTailwindBreakpoints from '@/hooks/common/useTailwindBreakpoints';

describe('useTailwindBreakpoints', () => {
    const resizeWindow = (width: number) => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
        });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });
    };

    beforeEach(() => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 500, // < sm
        });
    });

    it('should return correct initial values', () => {
        const { result } = renderHook(() => useTailwindBreakpoints());

        expect(result.current.windowWidth).toBe(500);
        expect(result.current.isSm).toBe(false);
        expect(result.current.isMd).toBe(false);
        expect(result.current.isLg).toBe(false);
        expect(result.current.isXl).toBe(false);
        expect(result.current.is2xl).toBe(false);
    });

    it('should update values when resizing window', () => {
        const { result } = renderHook(() => useTailwindBreakpoints());

        resizeWindow(800);

        expect(result.current.windowWidth).toBe(800);
        expect(result.current.isSm).toBe(true);
        expect(result.current.isMd).toBe(true);
        expect(result.current.isLg).toBe(false);
    });

    it('should correctly detect xl and 2xl breakpoints', () => {
        const { result } = renderHook(() => useTailwindBreakpoints());

        resizeWindow(1600);

        expect(result.current.isSm).toBe(true);
        expect(result.current.isMd).toBe(true);
        expect(result.current.isLg).toBe(true);
        expect(result.current.isXl).toBe(true);
        expect(result.current.is2xl).toBe(true);
    });

    it('should remove resize listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        const { unmount } = renderHook(() => useTailwindBreakpoints());

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function)
        );
    });
});
