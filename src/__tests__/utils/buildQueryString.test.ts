// ** Utils
import { buildQueryString, TQueryParams, TRangeFilter } from '@/utils/buildQueryString'

describe('buildQueryString', () => {
    // -------------------------------------------------------------------------
    // Basic parameters
    // -------------------------------------------------------------------------
    describe('Basic parameters', () => {
        it('should build query string with page and limit only', () => {
            const params: TQueryParams = { page: 1, limit: 10 }

            const result = buildQueryString(params)

            expect(result).toBe('page=1&limit=10')
        })

        it('should convert page and limit to strings', () => {
            const params: TQueryParams = { page: 5, limit: 20 }

            const result = buildQueryString(params)

            expect(result).toContain('page=5')
            expect(result).toContain('limit=20')
        })

        it('should handle page as 0', () => {
            const params: TQueryParams = { page: 0, limit: 10 }

            const result = buildQueryString(params)

            expect(result).toContain('page=0')
        })
    })

    // -------------------------------------------------------------------------
    // Sort parameter
    // -------------------------------------------------------------------------
    describe('Sort parameter', () => {
        it('should include sort parameter when provided', () => {
            const params: TQueryParams = { page: 1, limit: 10, sort: '-createdAt' }

            const result = buildQueryString(params)

            expect(result).toContain('sort=-createdAt')
        })

        it('should not include sort when not provided', () => {
            const params: TQueryParams = { page: 1, limit: 10 }

            const result = buildQueryString(params)

            expect(result).not.toContain('sort')
        })
    })

    // -------------------------------------------------------------------------
    // Search parameter
    // -------------------------------------------------------------------------
    describe('Search parameter', () => {
        it('should include search when provided', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                search: 'test query',
            }

            const result = buildQueryString(params)

            // search value is trimmed and set as-is
            expect(result).toContain('search=test+query')
        })

        it('should trim whitespace from search value', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                search: '  hello world  ',
            }

            const result = buildQueryString(params)

            expect(result).toContain('search=hello+world')
        })

        it('should not include search when value is empty string', () => {
            const params: TQueryParams = { page: 1, limit: 10, search: '' }

            const result = buildQueryString(params)

            expect(result).not.toContain('search')
        })

        it('should not include search when value is only whitespace', () => {
            const params: TQueryParams = { page: 1, limit: 10, search: '   ' }

            const result = buildQueryString(params)

            expect(result).not.toContain('search')
        })

        it('should not include search when search is undefined', () => {
            const params: TQueryParams = { page: 1, limit: 10 }

            const result = buildQueryString(params)

            expect(result).not.toContain('search')
        })

        it('should encode special characters in search value', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                search: 'test & query',
            }

            const result = buildQueryString(params)

            // URLSearchParams encodes & as %26, space as +
            expect(result).toContain('search=test+%26+query')
        })
    })

    // -------------------------------------------------------------------------
    // Filters
    // -------------------------------------------------------------------------
    describe('Filters', () => {
        it('should include a single filter with a single value', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: { category: ['fiction'] },
            }

            const result = buildQueryString(params)

            expect(result).toContain('category=fiction')
        })

        it('should repeat the key for multiple values (multi-value filter)', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: { category: ['fiction', 'non-fiction', 'biography'] },
            }

            const result = buildQueryString(params)

            expect(result).toContain('category=fiction')
            expect(result).toContain('category=non-fiction')
            expect(result).toContain('category=biography')
        })

        it('should handle multiple filter keys', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: {
                    category: ['fiction', 'non-fiction'],
                    status: ['active', 'pending'],
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('category=fiction')
            expect(result).toContain('category=non-fiction')
            expect(result).toContain('status=active')
            expect(result).toContain('status=pending')
        })

        it('should produce clean output for empty filters object', () => {
            const params: TQueryParams = { page: 1, limit: 10, filters: {} }

            const result = buildQueryString(params)

            expect(result).toBe('page=1&limit=10')
        })

        it('should skip a filter key whose array is empty', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: { category: [] },
            }

            const result = buildQueryString(params)

            expect(result).toBe('page=1&limit=10')
        })

        it('should encode special characters in filter values', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: { tag: ['sci-fi & fantasy', 'romance/drama'] },
            }

            const result = buildQueryString(params)

            expect(result).toContain('tag=')
            expect(result).toContain('sci-fi')
        })
    })

    // -------------------------------------------------------------------------
    // Range filters
    // -------------------------------------------------------------------------
    describe('Range filters', () => {
        it('should append key>= param when only min is provided', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: { price: { min: 100 } },
            }

            const result = buildQueryString(params)

            // URLSearchParams encodes > as %3E
            expect(result).toContain('price%3E=100')
            expect(result).not.toContain('price%3C=')
        })

        it('should append key<= param when only max is provided', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: { price: { max: 500 } },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3C=500')
            expect(result).not.toContain('price%3E=')
        })

        it('should append both params when min and max are provided', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: { price: { min: 100, max: 500 } },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3E=100')
            expect(result).toContain('price%3C=500')
        })

        it('should handle multiple range filter keys', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {
                    price: { min: 100, max: 500 },
                    age: { min: 18, max: 65 },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3E=100')
            expect(result).toContain('price%3C=500')
            expect(result).toContain('age%3E=18')
            expect(result).toContain('age%3C=65')
        })

        it('should support string values (e.g. ISO dates)', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: { date: { min: '2024-01-01', max: '2024-12-31' } },
            }

            const result = buildQueryString(params)

            expect(result).toContain('date%3E=2024-01-01')
            expect(result).toContain('date%3C=2024-12-31')
        })

        it('should include range param when value is 0', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: { price: { min: 0, max: 0 } },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3E=0')
            expect(result).toContain('price%3C=0')
        })

        it('should skip min param when min is empty string', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: { price: { min: '', max: 500 } },
            }

            const result = buildQueryString(params)

            expect(result).not.toContain('price%3E=')
            expect(result).toContain('price%3C=500')
        })

        it('should skip max param when max is empty string', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: { price: { min: 100, max: '' } },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3E=100')
            expect(result).not.toContain('price%3C=')
        })

        it('should skip both params when min and max are empty strings', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: { price: { min: '', max: '' } },
            }

            const result = buildQueryString(params)

            expect(result).not.toContain('price%3E=')
            expect(result).not.toContain('price%3C=')
        })

        it('should produce clean output for empty rangeFilters object', () => {
            const params: TQueryParams = { page: 1, limit: 10, rangeFilters: {} }

            const result = buildQueryString(params)

            expect(result).toBe('page=1&limit=10')
        })
    })

    // -------------------------------------------------------------------------
    // Combined parameters
    // -------------------------------------------------------------------------
    describe('Combined parameters', () => {
        it('should build query string with all parameters', () => {
            const params: TQueryParams = {
                page: 2,
                limit: 20,
                sort: '-createdAt',
                search: 'test',
                filters: {
                    category: ['fiction', 'non-fiction'],
                    status: ['active'],
                },
                rangeFilters: {
                    price: { min: 100, max: 500 },
                    rating: { min: 4 },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('page=2')
            expect(result).toContain('limit=20')
            expect(result).toContain('sort=-createdAt')
            expect(result).toContain('search=test')
            expect(result).toContain('category=fiction')
            expect(result).toContain('category=non-fiction')
            expect(result).toContain('status=active')
            expect(result).toContain('price%3E=100')
            expect(result).toContain('price%3C=500')
            expect(result).toContain('rating%3E=4')
        })

        it('should handle a complex real-world scenario', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 50,
                sort: 'name',
                search: 'mystery thriller',
                filters: {
                    genre: ['mystery', 'thriller', 'crime'],
                    language: ['en', 'vi'],
                    availability: ['in-stock'],
                },
                rangeFilters: {
                    publishYear: { min: 2020, max: 2024 },
                    price: { min: 50000, max: 200000 },
                    rating: { min: 4.5 },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('page=1')
            expect(result).toContain('limit=50')
            expect(result).toContain('sort=name')
            expect(result).toContain('search=mystery+thriller')
            expect(result).toContain('genre=mystery')
            expect(result).toContain('genre=thriller')
            expect(result).toContain('genre=crime')
            expect(result).toContain('language=en')
            expect(result).toContain('language=vi')
            expect(result).toContain('availability=in-stock')
            expect(result).toContain('publishYear%3E=2020')
            expect(result).toContain('publishYear%3C=2024')
            expect(result).toContain('price%3E=50000')
            expect(result).toContain('price%3C=200000')
            expect(result).toContain('rating%3E=4.5')
        })
    })

    // -------------------------------------------------------------------------
    // Edge cases
    // -------------------------------------------------------------------------
    describe('Edge cases', () => {
        it('should handle very large numbers', () => {
            const params: TQueryParams = {
                page: 999999,
                limit: 100,
                rangeFilters: {
                    price: { min: 999999999, max: 9999999999 },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('page=999999')
            expect(result).toContain('price%3E=999999999')
            expect(result).toContain('price%3C=9999999999')
        })
    })
})