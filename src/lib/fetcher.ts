// ** libs
import {ApiError} from "@/lib/api-error";

export interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | undefined>;
}

type ErrorPayload = {
    message?: string | string[];
    error?: string;
};

export async function fetcher<T>(
    url: string,
    options: FetchOptions = {}
): Promise<T> {
    const { params, headers, ...rest } = options;

    const query = params
        ? '?' +
        Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';

    const res = await fetch(`${url}${query}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        ...rest,
    });

    let body: unknown;

    try {
        body = await res.json();
    } catch {
        body = null;
    }

    // error
    if (!res.ok) {
        const payload = body as ErrorPayload | null;

        const message =
            Array.isArray(payload?.message)
                ? payload.message.join('\n')
                : payload?.message ??
                payload?.error ??
                `Request failed (${res.status})`;

        throw new ApiError(message, res.status);
    }

    return body as T;
}
