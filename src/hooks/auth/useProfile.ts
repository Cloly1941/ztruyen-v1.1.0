'use client'

// ** SWR
import useSWR from 'swr'

// ** Types
import { IUserProfile } from '@/types/api'

// ** Services
import { UserService } from '@/services/user'

// ** Configs
import {CONFIG_TAG} from "@/configs/tag";

export const useProfile = () => {
    return useSWR<IUserProfile | null>(
        CONFIG_TAG.USER.PROFILE,
        async () => {
            const res = await UserService.getProfile()
            return res.data ?? null
        },
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    )
}
