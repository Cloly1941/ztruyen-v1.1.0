'use client'

import { useEffect } from 'react'

type Props = {
    token?: string
}

const HandleSocialToken = ({ token }: Props) => {
    useEffect(() => {
        if (!token) return

        if (window.opener) {
            window.opener.postMessage(
                { type: 'OAUTH_LOGIN_SUCCESS', token },
                window.location.origin
            )

            window.close()
        }
    }, [token])

    return null
}

export default HandleSocialToken
