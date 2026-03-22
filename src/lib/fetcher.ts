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

    const { params, headers, body, ...rest } = options;

    const query = params
        ? '?' +
        Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';

    const isFormData = body instanceof FormData;

    const res = await fetch(`${url}${query}`, {
        credentials: 'include',
        ...rest,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...headers,
        },
        body: isFormData
            ? body
            : body
                ? body
                : undefined,
    });

    let responseBody: unknown;

    try {
        responseBody = await res.json();
    } catch {
        responseBody = null;
    }

    if (!res.ok) {
        const payload = responseBody as ErrorPayload | null;

        const message =
            Array.isArray(payload?.message)
                ? payload.message.join('\n')
                : payload?.message ??
                payload?.error ??
                `Request failed (${res.status})`;

        throw new ApiError(message, res.status);
    }

    return responseBody as T;
}

