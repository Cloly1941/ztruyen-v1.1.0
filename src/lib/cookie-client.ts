// ** Configs
import {VARIABLE} from "@/configs/variable";

export const setLoggedInCookie = () => {
    document.cookie = `${VARIABLE.IS_LOGGED_IN}=true; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export const removeLoggedInCookie = () => {
    document.cookie = `${VARIABLE.IS_LOGGED_IN}=; path=/; max-age=0; SameSite=Lax`;
}