'use client'

// ** React
import { ReactNode, useEffect } from 'react'

// ** Next
import { useRouter } from 'next/navigation'

// ** Lib
import { getAccessToken } from '@/lib/localStorage'

const GuestGuard = ({ children }: { children: ReactNode }) => {
    const router = useRouter()

    useEffect(() => {
        const token = getAccessToken()

        if (token) {
            router.replace('/')
        }
    }, [router])

    return children
}

export default GuestGuard
