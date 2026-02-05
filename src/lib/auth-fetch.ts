// ** libs
import {fetcher, FetchOptions} from "@/lib/fetcher"
import {ApiError} from "@/lib/api-error";

// ** Services
import {AuthService} from "@/services/auth";

// ** lib
import {getAccessToken, removeAccessToken} from "@/lib/localStorage";

export async function authFetcher<T>(
    url: string,
    options: FetchOptions = {}
): Promise<T> {
    const accessToken =
        typeof window !== 'undefined'
            ? getAccessToken()
            : null;

    return fetcher<T>(url, {
        ...options,
        headers: {
            ...options.headers,
            ...(accessToken && {
                Authorization: `Bearer ${accessToken}`,
            }),
        },
    });
}

let refreshPromise: Promise<void> | null = null;

export async function authFetcherWithRefresh<T>(
    url: string,
    options: FetchOptions = {}
): Promise<T> {
    try {
        return await authFetcher<T>(url, options);
    } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 401) {
            throw err;
        }

        if (!refreshPromise) {
            refreshPromise = AuthService.refreshToken()
                .then(() => {})
                .catch((e) => {
                    removeAccessToken();
                    throw e;
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        await refreshPromise;

        return authFetcher<T>(url, options);
    }
}


