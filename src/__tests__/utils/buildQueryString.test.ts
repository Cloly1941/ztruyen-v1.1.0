// ** Utils
import { buildQueryString, TQueryParams, TRangeFilter } from '@/utils/buildQueryString'

describe('buildQueryString', () => {
    describe('Basic parameters', () => {
        it('should build query string with page and limit only', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
            }

            const result = buildQueryString(params)

            expect(result).toBe('page=1&limit=10')
        })

        it('should convert page and limit to strings', () => {
            const params: TQueryParams = {
                page: 5,
                limit: 20,
            }

            const result = buildQueryString(params)

            expect(result).toContain('page=5')
            expect(result).toContain('limit=20')
        })
    })

    describe('Sort parameter', () => {
        it('should include sort parameter when provided', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                sort: '-createdAt',
            }

            const result = buildQueryString(params)

            expect(result).toContain('sort=-createdAt')
        })

        it('should not include sort parameter when not provided', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
            }

            const result = buildQueryString(params)

            expect(result).not.toContain('sort')
        })
    })

    describe('Search parameters', () => {
        it('should include search when both search and searchField are provided', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                search: 'test query',
                searchField: 'title',
            }

            const result = buildQueryString(params)

            expect(result).toContain('title=%2Ftest+query%2Fi')
        })

        it('should not include search when searchField is missing', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                search: 'test query',
            }

            const result = buildQueryString(params)

            expect(result).not.toContain('test+query')
        })

        it('should not include search when search value is missing', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                searchField: 'title',
            }

            const result = buildQueryString(params)

            expect(result).not.toContain('title')
        })

        it('should properly encode special characters in search', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                search: 'test & query',
                searchField: 'name',
            }

            const result = buildQueryString(params)

            // URLSearchParams encodes & as %26 and space as +
            expect(result).toContain('name=')
            expect(result).toContain('%2Ftest+%26+query%2Fi')
        })
    })

    describe('Filters', () => {
        it('should include single filter with single value', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: {
                    category: ['fiction'],
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('category=fiction')
        })

        it('should include single filter with multiple values', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: {
                    category: ['fiction', 'non-fiction', 'biography'],
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('category=fiction')
            expect(result).toContain('category=non-fiction')
            expect(result).toContain('category=biography')
        })

        it('should include multiple filters with multiple values', () => {
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

        it('should handle empty filters object', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: {},
            }

            const result = buildQueryString(params)

            expect(result).toBe('page=1&limit=10')
        })

        it('should handle filters with empty array', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: {
                    category: [],
                },
            }

            const result = buildQueryString(params)

            expect(result).toBe('page=1&limit=10')
        })
    })

    describe('Range filters', () => {
        it('should include range filter with min only', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {
                    price: { min: 100 },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3E=100')
        })

        it('should include range filter with max only', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {
                    price: { max: 500 },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3C=500')
        })

        it('should include range filter with both min and max', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {
                    price: { min: 100, max: 500 },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3E=100')
            expect(result).toContain('price%3C=500')
        })

        it('should handle multiple range filters', () => {
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

        it('should handle string values in range filters', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {
                    date: { min: '2024-01-01', max: '2024-12-31' },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('date%3E=2024-01-01')
            expect(result).toContain('date%3C=2024-12-31')
        })

        it('should not include range filter when min is empty string', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {
                    price: { min: '', max: 500 },
                },
            }

            const result = buildQueryString(params)

            expect(result).not.toContain('price%3E=')
            expect(result).toContain('price%3C=500')
        })

        it('should not include range filter when max is empty string', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {
                    price: { min: 100, max: '' },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3E=100')
            expect(result).not.toContain('price%3C=')
        })

        it('should handle range filter with zero values', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {
                    price: { min: 0, max: 0 },
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('price%3E=0')
            expect(result).toContain('price%3C=0')
        })

        it('should handle empty range filters object', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                rangeFilters: {},
            }

            const result = buildQueryString(params)

            expect(result).toBe('page=1&limit=10')
        })
    })

    describe('Combined parameters', () => {
        it('should build query string with all parameters', () => {
            const params: TQueryParams = {
                page: 2,
                limit: 20,
                sort: '-createdAt',
                search: 'test',
                searchField: 'title',
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
            expect(result).toContain('title=')
            expect(result).toContain('category=fiction')
            expect(result).toContain('category=non-fiction')
            expect(result).toContain('status=active')
            expect(result).toContain('price%3E=100')
            expect(result).toContain('price%3C=500')
            expect(result).toContain('rating%3E=4')
        })

        it('should handle complex real-world scenario', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 50,
                sort: 'name',
                search: 'mystery thriller',
                searchField: 'title',
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

            // Verify all parameters are included
            expect(result).toContain('page=1')
            expect(result).toContain('limit=50')
            expect(result).toContain('sort=name')

            // Verify filters
            expect(result).toContain('genre=mystery')
            expect(result).toContain('genre=thriller')
            expect(result).toContain('genre=crime')

            // Verify range filters
            expect(result).toContain('publishYear%3E=2020')
            expect(result).toContain('publishYear%3C=2024')
            expect(result).toContain('price%3E=50000')
            expect(result).toContain('rating%3E=4.5')
        })
    })

    describe('Edge cases', () => {
        it('should handle page as 0', () => {
            const params: TQueryParams = {
                page: 0,
                limit: 10,
            }

            const result = buildQueryString(params)

            expect(result).toContain('page=0')
        })

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

        it('should handle special characters in filter values', () => {
            const params: TQueryParams = {
                page: 1,
                limit: 10,
                filters: {
                    tag: ['sci-fi & fantasy', 'romance/drama'],
                },
            }

            const result = buildQueryString(params)

            expect(result).toContain('tag=')
            // URLSearchParams will encode these automatically
            expect(result).toContain('sci-fi')
        })
    })
})