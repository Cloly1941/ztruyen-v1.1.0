'use server'

// ** Next
import { cookies } from 'next/headers'

// ** Configs
import {VARIABLE} from "@/configs/variable";

export const getCookie = async () => {
    const cookieStore = await cookies()
    return cookieStore.get(VARIABLE.REFRESH_TOKEN)
}