const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const authUrl = baseUrl + '/auth';
const userUrl = baseUrl + '/user';
const frameUrl = baseUrl + '/frame';
const favoriteUrl = baseUrl + '/favorite';
const commentUrl = baseUrl + '/comment';
const emojiUrl = baseUrl + '/emoji';
const emojiCategoriesUrl = baseUrl + '/emoji-category';

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
    },
    FRAME: {
        INDEX: frameUrl
    },
    FAVORITE: {
        INDEX: favoriteUrl,
        CHECK: `${favoriteUrl}/check`,
        TOGGLE: `${favoriteUrl}/toggle`,
        DELETE: `${favoriteUrl}/delete`,
        DELETE_MULTI: `${favoriteUrl}/delete-multi`
    },
    COMMENT: {
        INDEX: commentUrl,
        REPLIES: `${commentUrl}/replies`,
        REPLY: `${commentUrl}/reply`,
        LIKE: `${commentUrl}/like`,
        REPORT: `${commentUrl}/report`
    },
    EMOJI: {
        INDEX: emojiUrl
    },
    EMOJI_CATEGORIES: {
        INDEX: emojiCategoriesUrl
    },
    IMAGE: {
        INDEX: `${baseUrl}/image`,
        UPLOAD: `${baseUrl}/upload`,
    },
} as const