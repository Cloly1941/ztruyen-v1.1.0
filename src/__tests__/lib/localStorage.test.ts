// ** Utils
import {
    getAccessToken,
    setAccessToken,
    removeAccessToken,
} from "@/lib/localStorage"

// ** Configs
import { VARIABLE } from "@/configs/variable"

describe("access token utils", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("setAccessToken should save token to localStorage", () => {
        setAccessToken("token-123")

        expect(localStorage.getItem(VARIABLE.ACCESS_TOKEN))
            .toBe("token-123")
    })

    it("getAccessToken should return token from localStorage", () => {
        localStorage.setItem(VARIABLE.ACCESS_TOKEN, "token-456")

        const token = getAccessToken()

        expect(token).toBe("token-456")
    })

    it("removeAccessToken should remove token from localStorage", () => {
        localStorage.setItem(VARIABLE.ACCESS_TOKEN, "token-789")

        removeAccessToken()

        expect(localStorage.getItem(VARIABLE.ACCESS_TOKEN))
            .toBeNull()
    })
})
