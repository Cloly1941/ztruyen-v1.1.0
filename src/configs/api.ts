const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const authUrl = baseUrl + '/auth';
const userUrl = baseUrl + '/user';
const frameUrl = baseUrl + '/frame';

export const CONFIG_API = {
    AUTH: {
        LOGIN:`${authUrl}/login`,
        REGISTER:`${authUrl}/register`,
        LOGOUT:`${authUrl}/logout`,
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
    IMAGE: {
        UPLOAD: `${baseUrl}/upload`,
    },
} as const