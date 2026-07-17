import {getLiferay} from '../liferay/global';

export class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly responseBody?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function portalFetch<T>(
    path: string,
    init: RequestInit = {}
): Promise<T> {
    const url = new URL(path, window.location.origin);
    const headers = new Headers(init.headers);
    const authToken = getLiferay()?.authToken;

    headers.set('Accept', 'application/json');

    if (init.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (authToken) {
        headers.set('x-csrf-token', authToken);
    }

    const response = await fetch(url, {
        credentials: 'same-origin',
        ...init,
        headers,
    });

    if (!response.ok) {
        const responseBody = await response.text();

        throw new ApiError(
            `Liferay API request failed with HTTP ${response.status}.`,
            response.status,
            responseBody
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}
