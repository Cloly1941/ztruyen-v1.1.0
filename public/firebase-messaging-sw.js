importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

const params = new URL(location.href).searchParams;

firebase.initializeApp({
    apiKey: params.get('apiKey'),
    authDomain: params.get('authDomain'),
    projectId: params.get('projectId'),
    storageBucket: params.get('storageBucket'),
    messagingSenderId: params.get('messagingSenderId'),
    appId: params.get('appId'),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const data = payload.data ?? {};
    const senderName = data.senderName ?? 'nguời dùng';
    const comicName = data.comicName ?? 'một truyện nào đó';

    let title = 'Thông báo mới';
    if (data.type === 'REPLY_COMMENT') {
        title = `Người dùng ${senderName} đã phản hồi bình luận của bạn tại truyện ${comicName}`;
    } else if (data.type === 'LIKE_COMMENT') {
        title = `Người dùng ${senderName} đã thích bình luận của bạn tại truyện ${comicName}`;
    } else {
        title = data.title ?? 'Thông báo mới';
    }

    const body = data.body ?? '';

    self.registration.showNotification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/badge.png',
        data,
    });
});

function buildUrl(data) {
    if (data.type === 'REPLY_COMMENT' || data.type === 'LIKE_COMMENT') {
        return data.comicSlug ? `/truyen-tranh/${data.comicSlug}.html` : '/';
    }
    if (data.type === 'ANNOUNCEMENT') {
        return '/';
    }
    return '/';
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification.data ?? {};
    const url = buildUrl(data);

    const channel = new BroadcastChannel('notification-click');
    channel.postMessage({type: 'REVALIDATE', url});
    channel.close();

    event.waitUntil(
        clients
            .matchAll({type: 'window', includeUncontrolled: true})
            .then((clientList) => {
                for (const client of clientList) {
                    if ('focus' in client) {
                        return client.focus().then(() => {
                            if ('navigate' in client) return client.navigate(url);
                        });
                    }
                }
                return clients.openWindow(url);
            })
    );
});