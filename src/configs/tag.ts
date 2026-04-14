export const CONFIG_TAG = {
    AUTH: {
        LOGIN: 'login',
        LOGOUT: 'logout',
        REGISTER: 'register',
        RESET: 'reset-password',
        FORGOT: 'forgot-password',
    },
    USER: {
        PROFILE: 'profile',
        DELETE_PROFILE: 'delete-profile',
    },
    FRAME: {
        INDEX: 'frame',
        UPDATE: 'update-frame'
    },
    FAVORITE: {
        INDEX: 'favorite',
        LIST: 'favorite-list',
        TOGGLE: 'favorite-toggle',
        DELETE: 'delete-favorite',
        DELETE_MULTI: 'delete-multi-favorite'
    },
    COMMENT: {
        LIST: 'comment-list',
        LIKE: 'comment-like',
        CREATE: 'create-comment',
        DELETE: 'delete-comment',
        REPORT: 'report-comment',
        DETAIL: 'comment-detail',
    },
    EMOJI: {
        LIST: 'emoji-list'
    },
    EMOJI_CATEGORIES: {
        LIST: 'emoji-categories-list'
    },
    NOTIFICATION: {
        LIST: 'notification-list',
        COUNT: 'notification-count',
        READ: 'notification-read',
        DELETE: 'notification-delete',
        READ_ALL: 'notification-read-all',
        DELETE_ALL: 'notification-delete-all',
    },
    ANNOUNCEMENT: {
        ACTIVE: 'active-announcement',
    },
    COMIC: {
        LIST: 'comment-list',
    },
    IMAGE: {
        UPLOAD: 'upload-image',
    }
} as const