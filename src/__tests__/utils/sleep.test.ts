// ** utils
import { sleep } from '@/utils/sleep'

describe('sleep utils', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('resolves only after the specified delay has elapsed', async () => {
        const promise = sleep(1000)

        let resolved = false
        promise.then(() => {
            resolved = true
        })

        jest.advanceTimersByTime(999)
        await Promise.resolve() // flush microtasks
        expect(resolved).toBe(false)

        jest.advanceTimersByTime(1)
        await Promise.resolve()
        expect(resolved).toBe(true)
    })
})
