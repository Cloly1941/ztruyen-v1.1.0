'use client'

// ** SWR
import {mutate} from "swr";

// ** React
import { useEffect } from 'react'

// ** Lib
import { setAccessToken } from '@/lib/localStorage'
import {setLoggedInCookie} from "@/lib/cookie-client";
import {askEnableNotification} from "@/lib/fcm/askEnalbleNotification";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

export function ListenOAuthMessage() {
    useEffect(() => {
        const handler = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return

            if (event.data?.type === 'OAUTH_LOGIN_SUCCESS') {
                const { token } = event.data

                setAccessToken(token)
                setLoggedInCookie();

                await mutate(CONFIG_TAG.USER.PROFILE, undefined, {
                    revalidate: true,
                })

                window.history.back();

                setTimeout(() => {
                    askEnableNotification()
                }, 1000)
            }
        }

        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)
    }, [])

    return null
}
