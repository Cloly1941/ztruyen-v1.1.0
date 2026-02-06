// ** util
import {
    getAgeToBirthday,
    isBirthdayValid,
    getDefaultBirthdayMonth,
} from '@/utils/date'

describe('date utils', () => {
    const TODAY = new Date(2025, 1, 1)

    beforeAll(() => {
        jest.useFakeTimers()
        jest.setSystemTime(TODAY)
    })

    afterAll(() => {
        jest.useRealTimers()
    })

    describe('getAgeToBirthday', () => {
        it('returns correct age when birthday has already passed', () => {
            const birthday = new Date(2000, 0, 1)

            expect(getAgeToBirthday(birthday)).toBe(25)
        })

        it('returns correct age when birthday has not occurred yet', () => {
            const birthday = new Date(2000, 11, 31)

            expect(getAgeToBirthday(birthday)).toBe(24)
        })

        it('decreases age if same month but birthday has not arrived', () => {
            const birthday = new Date(2000, 1, 10)

            expect(getAgeToBirthday(birthday)).toBe(24)
        })

        it('does not decrease age when today is the birthday', () => {
            const birthday = new Date(2000, 1, 1)

            expect(getAgeToBirthday(birthday)).toBe(25)
        })
    })

    describe('isBirthdayValid', () => {
        it('returns true when age is exactly 10', () => {
            const birthday = new Date(2015, 1, 1)

            expect(isBirthdayValid(birthday)).toBe(true)
        })

        it('returns true when age is exactly 100', () => {
            const birthday = new Date(1925, 1, 1)

            expect(isBirthdayValid(birthday)).toBe(true)
        })

        it('returns false when age is less than 10', () => {
            const birthday = new Date(2016, 1, 1)

            expect(isBirthdayValid(birthday)).toBe(false)
        })

        it('returns false when age is greater than 100', () => {
            const birthday = new Date(1924, 1, 1)

            expect(isBirthdayValid(birthday)).toBe(false)
        })

        it('returns false when birthday is in the future', () => {
            const birthday = new Date(2030, 0, 1)

            expect(isBirthdayValid(birthday)).toBe(false)
        })
    })

    describe('getDefaultBirthdayMonth', () => {
        it('returns date set to 10 years ago, same month, day = 1', () => {
            const result = getDefaultBirthdayMonth()

            expect(result.getFullYear()).toBe(2015)
            expect(result.getMonth()).toBe(1)
            expect(result.getDate()).toBe(1)
        })
    })
})
