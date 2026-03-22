'use client';

// ** Next
import {useTheme} from "next-themes";

// ** React turnstile
import { Turnstile } from '@marsidev/react-turnstile';

interface Props {
    onVerify: (token: string) => void;
}

export default function TurnstileWidget({ onVerify }: Props) {

    const {theme} = useTheme()

    const turnstileTheme =
        theme === 'dark' ? 'dark' : 'light';

    return (
        <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            options={{
                theme: turnstileTheme,
                size: 'flexible',
            }}
            onSuccess={onVerify}
        />
    );
}
