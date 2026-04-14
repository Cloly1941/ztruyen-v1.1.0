const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const authUrl = baseUrl + '/auth';
const userUrl = baseUrl + '/user';
const frameUrl = baseUrl + '/frame';
const favoriteUrl = baseUrl + '/favorite';
const commentUrl = baseUrl + '/comment';
const emojiUrl = baseUrl + '/emoji';
const emojiCategoriesUrl = baseUrl + '/emoji-category';
const notificationUrl = baseUrl + '/notification';
const announcementUrl = baseUrl + '/announcement';
const comicUrl = baseUrl + '/comic';

export const CONFIG_API = {
    AUTH: {
        LOGIN: `${authUrl}/login`,
        REGISTER: `${authUrl}/register`,
        LOGOUT: `${authUrl}/logout`,
        REFRESH: `${authUrl}/refresh`,
        FORGOT: `${authUrl}/forgot-password`,
        RESET: `${authUrl}/reset-password`,
        GOOGLE: `${authUrl}/google`,
        FACEBOOK: `${authUrl}/facebook`,
    },
    USER: {
        PROFILE: `${userUrl}/profile`,
        FCM: `${userUrl}/fcm-token`,
        REMOVE: '/remove',
        SUBSCRIBE_TOPIC: '/subscribe-topic',
        UNSUBSCRIBE_TOPIC: '/unsubscribe-topic',
    },
    FRAME: {
        INDEX: frameUrl
    },
    FAVORITE: {
        INDEX: favoriteUrl,
        CHECK: `${favoriteUrl}/check`,
        TOGGLE: `${favoriteUrl}/toggle`,
        DELETE: `${favoriteUrl}/delete`,
        DELETE_MULTI: `${favoriteUrl}/delete-multi`,
        READING_PROGRESS: `${favoriteUrl}/reading-progress`
    },
    COMMENT: {
        INDEX: commentUrl,
        REPLIES: `${commentUrl}/replies`,
        REPLY: `${commentUrl}/reply`,
        LIKE: `${commentUrl}/like`,
        REPORT: `${commentUrl}/report`,
        PAGE_OF_REPLY: `${commentUrl}/page-of-reply`
    },
    EMOJI: {
        INDEX: emojiUrl
    },
    EMOJI_CATEGORIES: {
        INDEX: emojiCategoriesUrl
    },
    NOTIFICATION: {
        INDEX: notificationUrl,
        READ_ALL: `${notificationUrl}/read-all`,
        DELETE_ALL: `${notificationUrl}/all`
    },
    ANNOUNCEMENT: {
        INDEX: announcementUrl,
        ACTIVE: `${announcementUrl}/active`,
    },
    COMIC: {
        INDEX: comicUrl,
    },
    IMAGE: {
        INDEX: `${baseUrl}/image`,
        UPLOAD: `${baseUrl}/upload`,
    },
} as const