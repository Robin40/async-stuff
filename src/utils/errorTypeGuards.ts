import { StructError } from 'superstruct';
import { FetchError } from '../FetchError';

/** Returns `true` if `error` is a "token invalid or expired" error
 * from Django Rest Framework's JWT authentication. */
export function isDjangoTokenError(
    error: unknown
): error is FetchError & {
    response: { status: 401 };
    data: { code: 'token_not_valid' };
} {
    return (
        isFetchError(error) &&
        error.response.status === 401 &&
        error.data.code === 'token_not_valid'
    );
}

/** Returns `true` if `error` is a `FetchError` from `@tdc-cl/async-stuff`,
 * that is thrown when there *is* a backend response
 * but with a bad status code (400-599). */
export function isFetchError(error: unknown): error is FetchError {
    return error instanceof Error && error.name === 'FetchError';
}

/** Returns `true` if `error` is a `NetworkError` from the fetch API,
 * that is thrown when the request don't even reach the backend. */
export function isNetworkError(error: unknown): error is TypeError {
    return (
        error instanceof TypeError &&
        (error.message.includes('NetworkError') ||
            error.message.includes('fetch'))
    );
}

/** Returns `true` if `error` is a `StructError` from `superstruct`,
 * that is thrown when there is a backend response
 * with a good status code (200-299), but with a response data
 * that is not valid against the endpoint's `struct`. */
export function isStructError(error: unknown): error is StructError {
    return error instanceof StructError;
}
