'use client'

// ** React
import { useEffect } from 'react'

// ** Lib
import { setAccessToken } from '@/lib/localStorage'

export function ListenOAuthMessage() {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return

            if (event.data?.type === 'OAUTH_LOGIN_SUCCESS') {
                const { token } = event.data

                setAccessToken(token)

                window.location.href = '/'
            }
        }

        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)
    }, [])

    return null
}
