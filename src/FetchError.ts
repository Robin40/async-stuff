/** An error thrown by fetches made by a resource object.
 * It contains the response object returned by `fetch`. */
import { Endpoint } from './Endpoint';

export class FetchError extends Error {
    constructor(
        readonly endpoint: Endpoint<any, any>,
        readonly response: Response,
        readonly data: any
    ) {
        super(
            `${response.status} error thrown by ${endpoint.method} to ${response.url}`
        );

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError);
        }

        this.name = 'FetchError';
    }
}

export function isFetchError(error: unknown): error is FetchError {
    return error instanceof Error && error.name === 'FetchError';
}
