'use client'

// ** React
import {useEffect} from 'react'

// ** SWR
import {mutate} from 'swr'

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

// ** Lib
import {REFRESH_EVENT} from "@/lib/invalidate-cache/events";

const NotificationRevalidate = () => {

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        const handler = (event: MessageEvent) => {
            const msg = event.data;

            // Bắt message từ Firebase SDK
            if (msg?.isFirebaseMessaging && msg?.messageType === 'notification-clicked') {
                void mutate(CONFIG_TAG.NOTIFICATION.COUNT);
                window.dispatchEvent(new Event(REFRESH_EVENT));
                return;
            }

            // Bắt message từ SW custom (fallback)
            if (msg?.type === 'NAVIGATE') {
                void mutate(CONFIG_TAG.NOTIFICATION.COUNT);
                window.dispatchEvent(new Event(REFRESH_EVENT));
            }
        };

        navigator.serviceWorker.addEventListener('message', handler);
        return () => {
            navigator.serviceWorker.removeEventListener('message', handler);
        };
    }, []);

    return null;
};

export default NotificationRevalidate;