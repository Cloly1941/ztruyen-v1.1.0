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
    return self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientsArr) => {
            if (clientsArr.length > 0) return;

            const data = payload.data || {};
            return self.registration.showNotification(data.title || 'Thông báo mới', {
                body: data.body || 'Có thông báo mới',
                icon: data.icon || 'https://img.ztruyen.io.vn/public/favicon/favicon.ico',
                badge: data.badge || 'https://img.ztruyen.io.vn/public/favicon/favicon.ico',
                data: data,
                requireInteraction: true,
            });
        });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification.data || {};
    let url = '/';

    if (data.type === 'REPLY_COMMENT' || data.type === 'LIKE_COMMENT') {
        url = data.comicSlug
            ? `/truyen-tranh/${data.comicSlug}.html`
            : '/';
    }

    const fullUrl = `${self.location.origin}${url}`;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(async (clientsArr) => {
                const existingClient = clientsArr.find(client =>
                    client.url.includes(self.location.origin)
                );

                if (existingClient) {
                    await existingClient.focus();
                } else {
                    await clients.openWindow(fullUrl);
                }
            })
    );
});