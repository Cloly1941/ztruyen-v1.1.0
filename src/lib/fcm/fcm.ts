import {
    getFirebaseMessaging,
    getToken,
    deleteToken,
    VAPID_KEY,
} from '@/lib/fcm/firebase';
import { UserService } from '@/services/api/user';

const FCM_TOKEN_KEY = 'fcm_token';

/**
 * Build service worker URL with Firebase config
 */
function buildSwUrl(): string {
    const url = new URL('/firebase-messaging-sw.js', location.origin);

    url.searchParams.set('apiKey', process.env.NEXT_PUBLIC_FIREBASE_API_KEY!);
    url.searchParams.set('authDomain', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!);
    url.searchParams.set('projectId', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!);
    url.searchParams.set('storageBucket', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!);
    url.searchParams.set('messagingSenderId', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!);
    url.searchParams.set('appId', process.env.NEXT_PUBLIC_FIREBASE_APP_ID!);

    return url.toString();
}

/**
 * Ask user permission (call only on user action)
 */
export async function requestNotificationPermission(): Promise<boolean> {
    try {
        if (typeof window === 'undefined') return false;
        if (!('Notification' in window)) return false;

        if (Notification.permission === 'granted') return true;

        const permission = await Notification.requestPermission();

        return permission === 'granted';
    } catch (err) {
        console.warn('[FCM] request permission failed:', err);
        return false;
    }
}

/**
 * Get or register service worker safely
 */
async function getOrRegisterServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    try {
        let registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {
            registration = await navigator.serviceWorker.register(buildSwUrl());
        }

        await navigator.serviceWorker.ready;
        return registration;
    } catch (err) {
        console.error('[FCM] SW registration failed:', err);
        return null;
    }
}

/**
 * Init FCM (ONLY when permission granted)
 */
export async function initFCM(): Promise<void> {
    try {
        if (typeof window === 'undefined') return;
        if (!('serviceWorker' in navigator)) return;
        if (!('Notification' in window)) return;

        // check permission
        if (Notification.permission !== 'granted') {
            console.warn('[FCM] Permission not granted');
            return;
        }

        const registration = await getOrRegisterServiceWorker();
        if (!registration) return;

        const messaging = getFirebaseMessaging();
        if (!messaging) return;

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        if (!token) {
            console.warn('[FCM] No token received');
            return;
        }

        const savedToken = localStorage.getItem(FCM_TOKEN_KEY);

        if (savedToken === token) {
            return;
        }

        localStorage.setItem(FCM_TOKEN_KEY, token);

        await Promise.all([
            UserService.saveFcmToken(token),
            UserService.subscribeToTopic(token, 'global'),
        ]);

    } catch (err) {
        console.warn('[FCM] initFCM failed:', err);
    }
}

/**
 * Destroy FCM (logout)
 */
export async function destroyFCM(): Promise<void> {
    try {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem(FCM_TOKEN_KEY);
        if (!token) return;

        await Promise.all([
            UserService.removeFcmToken(token),
            UserService.unsubscribeFromTopic(token, 'global'),
        ]);

        const messaging = getFirebaseMessaging();
        if (messaging) {
            await deleteToken(messaging);
        }

        localStorage.removeItem(FCM_TOKEN_KEY);

    } catch (err) {
        console.error('[FCM] destroyFCM failed:', err);
    }
}

/**
 * Get saved token (client only)
 */
export function getSavedFcmToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(FCM_TOKEN_KEY);
}