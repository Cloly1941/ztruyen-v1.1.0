'use client'

// ** Configs
import {VARIABLE} from "@/configs/variable";

// ** Lib
import {removeLoggedInCookie} from "@/lib/cookie-client";

export const getAccessToken = (): string | null => {
    return localStorage.getItem(VARIABLE.ACCESS_TOKEN);
}

export const setAccessToken = (token: string): void | null => {
    localStorage.setItem(VARIABLE.ACCESS_TOKEN, token);
}

export const removeAccessToken = (): void | null => {
    localStorage.removeItem(VARIABLE.ACCESS_TOKEN);
    removeLoggedInCookie();
};
