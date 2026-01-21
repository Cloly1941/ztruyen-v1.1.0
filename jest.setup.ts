import '@testing-library/jest-dom'

beforeAll(() => {
    global.fetch = jest.fn()

    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
    ;(fetch as jest.Mock).mockReset()
    jest.clearAllMocks()
    jest.restoreAllMocks()
})
