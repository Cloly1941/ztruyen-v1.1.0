// ** Configs
import {VARIABLE} from "@/configs/variable";

export const getAccessToken = (): string | null => {
    return localStorage.getItem(VARIABLE.ACCESS_TOKEN);
}

export const setAccessToken = (token: string): void => {
    localStorage.setItem(VARIABLE.ACCESS_TOKEN, token);
}

export const removeAccessToken = (): void => {
    localStorage.removeItem(VARIABLE.ACCESS_TOKEN);
};
