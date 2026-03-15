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
        TOGGLE: 'favorite-toggle'
    },
    IMAGE: {
        UPLOAD: 'upload-image',
    }
} as const