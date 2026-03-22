'use client';

// ** Next
import { useRouter } from 'next/navigation';

// ** React
import { useEffect } from 'react';

export default function DevToolsDetection() {
    const router = useRouter();

    useEffect(() => {
        const redirect = () => router.replace('/');

        // Window size
        const checkWindowSize = () => {
            return (
                window.outerWidth - window.innerWidth > 160 ||
                window.outerHeight - window.innerHeight > 160
            );
        };

        // Debugger timing
        const checkDebugger = () => {
            const start = performance.now();
            // eslint-disable-next-line no-debugger
            debugger;
            return performance.now() - start > 100;
        };

        const check = () => {
            if ( checkWindowSize() || checkDebugger()) {
                redirect();
            }
        };

        check();

        const interval = setInterval(check, 5000);

        return () => clearInterval(interval);
    }, [router]);

    return null;
}